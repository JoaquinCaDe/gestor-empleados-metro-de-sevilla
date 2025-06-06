import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  }, type: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add validation to ensure end time is after start time
shiftSchema.pre('validate', function (next) {
  if (this.end <= this.start) {
    this.invalidate('end', 'End time must be after start time');
  }
  next();
});

const Shift = mongoose.model('Shift', shiftSchema);
export default Shift;