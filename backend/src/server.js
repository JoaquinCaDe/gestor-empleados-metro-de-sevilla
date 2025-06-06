import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/user.route.js';
import shiftRoutes from './routes/shift.route.js';
import User from './models/user.model.js';

// Express app initialization
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Metro de Sevilla Shift Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Validate environment variables
const validateEnvironmentVariables = () => {
  console.log('🔍 Validating environment variables...');

  const requiredEnvVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
    ADMIN_DNE: process.env.ADMIN_DNE
  };

  const missingVars = [];
  const presentVars = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.trim() === '') {
      missingVars.push(key);
    } else {
      presentVars.push(key);
    }
  }

  if (presentVars.length > 0) {
    console.log('✅ Present environment variables:', presentVars.join(', '));
  }

  if (missingVars.length > 0) {
    console.warn('❌ Missing environment variables:', missingVars.join(', '));
    console.warn('💡 To create an admin user, please set these variables in your .env file:');
    missingVars.forEach(varName => {
      console.warn(`   - ${varName}=your_${varName.toLowerCase().replace('admin_', '')}_here`);
    });
    console.warn('⚠️  Admin user creation will be skipped');
    return false;
  }

  console.log('✅ All required environment variables are present');
  return true;
};

// Check and initialize database
const initializeDatabase = async () => {
  try {
    console.log('🔍 Initializing database...');

    // Extract database name from MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    let dbName = 'metro-sevilla'; // Default database name

    if (mongoUri) {
      const uriMatch = mongoUri.match(/\/([^/?]+)(\?.*)?$/);
      if (uriMatch && uriMatch[1]) {
        dbName = uriMatch[1];
      }
    }

    console.log(`🎯 Target database: ${dbName}`);

    // Check if database exists and is accessible
    const connectionDbName = mongoose.connection.name || mongoose.connection.db.databaseName;
    console.log(`📊 Connected to database: ${connectionDbName}`);

    if (connectionDbName !== dbName) {
      console.warn(`⚠️  Connected database (${connectionDbName}) doesn't match expected (${dbName})`);
      console.warn('💡 This might be expected behavior depending on your MongoDB setup');
    }

    // Get database statistics
    const dbStats = await mongoose.connection.db.stats();
    console.log(`📊 Database stats: ${dbStats.collections} collections, ${dbStats.documents} documents`);

    // List existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    if (collectionNames.length === 0) {
      console.log('📄 Database is empty - this appears to be a fresh installation');
      console.log('💡 Collections will be created automatically when first documents are inserted');

      // Ensure database is properly initialized by creating a test document and removing it
      try {
        const testCollection = mongoose.connection.db.collection('_init_test');
        await testCollection.insertOne({ test: true, createdAt: new Date() });
        await testCollection.deleteOne({ test: true });
        console.log('✅ Database initialization test passed');
      } catch (initError) {
        console.warn('⚠️  Database initialization test failed:', initError.message);
      }
    } else {
      console.log('📄 Existing collections:', collectionNames.join(', '));

      // Check if users collection exists and get count
      if (collectionNames.includes('users')) {
        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        console.log(`👥 Users collection found with ${userCount} documents`);

        if (userCount === 0) {
          console.log('👥 Users collection is empty - no existing users found');
        }
      } else {
        console.log('👥 Users collection not found - will be created when first user is added');
      }

      // Check if shifts collection exists
      if (collectionNames.includes('shifts')) {
        const shiftCount = await mongoose.connection.db.collection('shifts').countDocuments();
        console.log(`📅 Shifts collection found with ${shiftCount} documents`);
      } else {
        console.log('📅 Shifts collection not found - will be created when first shift is added');
      }
    }

    // Test database write permissions
    try {
      await mongoose.connection.db.admin().ping();
      console.log('✅ Database connection is healthy and writable');
    } catch (pingError) {
      console.warn('⚠️  Database ping failed, but connection seems OK:', pingError.message);
    }

    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('💡 The server will continue, but database operations might fail');
    return false;
  }
};

// Check database connection and collections
const validateDatabaseSetup = async () => {
  try {
    console.log('🔍 Validating database setup...');

    // Get database name from connection string
    const dbName = mongoose.connection.name || 'Unknown';
    console.log(`📊 Connected to database: ${dbName}`);

    // Check if we can access the database
    const dbStats = await mongoose.connection.db.stats();
    console.log(`📊 Database stats: ${dbStats.collections} collections, ${dbStats.documents} documents`);

    // List existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    if (collectionNames.length === 0) {
      console.log('📄 Database is empty - this appears to be a fresh installation');
      console.log('💡 Collections will be created automatically when first documents are inserted');
    } else {
      console.log('📄 Existing collections:', collectionNames.join(', '));

      // Check if users collection exists
      if (collectionNames.includes('users')) {
        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        console.log(`👥 Users collection found with ${userCount} documents`);
      } else {
        console.log('👥 Users collection not found - will be created when first user is added');
      }
    }

    // Test database write permissions
    try {
      await mongoose.connection.db.admin().ping();
      console.log('✅ Database connection is healthy and writable');
    } catch (pingError) {
      console.warn('⚠️  Database ping failed, but connection seems OK:', pingError.message);
    }

    return true;
  } catch (error) {
    console.error('❌ Error validating database setup:', error.message);
    console.error('💡 The server will continue, but database operations might fail');
    return false;
  }
};

// Create initial admin user if it doesn't exist
const createInitialAdminUser = async () => {
  try {
    // Validate environment variables first
    if (!validateEnvironmentVariables()) {
      console.log('⏭️  Skipping admin user creation due to missing environment variables');
      console.log('💡 Please set ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, and ADMIN_DNE in your .env file');
      return false;
    }    // Check if admin user already exists
    console.log('🔍 Checking for existing admin user...');
    const existingAdmin = await User.findOne({
      username: process.env.ADMIN_USERNAME
    });

    if (existingAdmin) {
      console.log('👤 Admin user already exists');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   DNE: ${existingAdmin.dne}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return true;
    }

    // Check if DNE is already in use
    const existingDNE = await User.findOne({
      dne: process.env.ADMIN_DNE
    });

    if (existingDNE) {
      console.warn(`⚠️  DNE ${process.env.ADMIN_DNE} is already in use by another user`);
      console.warn('⚠️  Admin user creation skipped to avoid conflicts');
      console.warn('💡 Please use a different ADMIN_DNE value or remove the existing user');
      return false;
    }

    // Check if email is already in use
    const existingEmail = await User.findOne({
      email: process.env.ADMIN_EMAIL
    });

    if (existingEmail) {
      console.warn(`⚠️  Email ${process.env.ADMIN_EMAIL} is already in use by another user`);
      console.warn('⚠️  Admin user creation skipped to avoid conflicts');
      console.warn('💡 Please use a different ADMIN_EMAIL value or remove the existing user');
      return false;
    }

    console.log('🔨 Creating new admin user...');// Create admin user
    const adminUser = new User({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME,
      dne: process.env.ADMIN_DNE,
      role: 'admin'
    }); await adminUser.save();
    console.log('✅ Initial admin user created successfully');
    console.log(`👤 Admin username: ${process.env.ADMIN_USERNAME}`);
    console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🆔 Admin DNE: ${process.env.ADMIN_DNE}`);
    console.log(`🔐 Default role: admin`);
    return true;
  } catch (error) {
    console.error('❌ Error creating initial admin user:', error.message);
    // Provide helpful error messages
    if (error.name === 'ValidationError') {
      console.error('📝 Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`   - ${key}: ${error.errors[key].message}`);
      });
      console.error('💡 Please check your environment variables and ensure all required fields are set');
    } else if (error.code === 11000) {
      console.error('🔄 Duplicate key error - user with this username, email, or DNE already exists');
      console.error('💡 Please check your database for existing users or use different values');
    } else {
      console.error('💡 Unexpected error occurred during user creation');
    }

    console.error('⚠️  Server will continue without admin user - you may need to create one manually');
    return false;
  }
};

// Connect to MongoDB and start server
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  console.error('💡 Please set MONGODB_URI in your .env file');
  process.exit(1);
}

console.log('🔗 Attempting to connect to MongoDB...');
console.log(`📡 Connection URI: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//*****:*****@')}`);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('🔗 Connected to MongoDB');

    // Initialize and validate database setup
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.warn('⚠️  Database initialization failed, but server will continue');
    }

    // Validate database setup
    const dbValid = await validateDatabaseSetup();
    if (!dbValid) {
      console.warn('⚠️  Database validation failed, but server will continue');
    }

    // Attempt to create initial admin user
    const adminCreated = await createInitialAdminUser();
    if (!adminCreated) {
      console.log('⚠️  Admin user creation was skipped or failed');
      console.log('💡 You may need to create an admin user manually or check your environment variables');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log('📋 Server initialization summary:');
      console.log(`   - Database: ${dbValid ? '✅ Connected and validated' : '⚠️  Connected but validation failed'}`);
      console.log(`   - Admin user: ${adminCreated ? '✅ Ready' : '⚠️  Not created'}`);
    });

    // Initialize the scheduler system (non-blocking)
    setTimeout(async () => {
      try {
        console.log('🚀 Initializing scheduler system...');
        const { initializeScheduler } = await import('./jobs/scheduler.js');
        const schedulerStarted = initializeScheduler();

        if (schedulerStarted) {
          console.log('✅ Scheduler system initialized successfully');
        } else {
          console.log('❌ Scheduler system failed to initialize');
        }
      } catch (error) {
        console.error('❌ Failed to initialize scheduler system:', error);
        console.log('⚠️  Server will continue without job scheduling');
      }
    }, 1000); // Give the server time to start
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('💡 Please check your MongoDB connection string and ensure MongoDB is running');
    process.exit(1);
  });

export default app;