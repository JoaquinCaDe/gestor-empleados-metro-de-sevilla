# Metro de Sevilla - Employee Shift Management System

Este backend proporciona una API para gestionar turnos de empleados del Metro de Sevilla.

## Estructura del proyecto

```
backend/
├── src/
│   ├── controllers/    # Controladores para manejar la lógica de negocio
│   ├── middleware/     # Middleware de autenticación y autorización
│   ├── models/         # Modelos de datos para MongoDB
│   ├── routes/         # Rutas de la API
│   └── server.js       # Configuración principal del servidor
├── .env.example        # Plantilla para variables de entorno
├── package.json        # Dependencias y scripts del proyecto
└── README.md           # Documentación del proyecto
```

## Requisitos

- Node.js (v14+)
- MongoDB

## Configuración

1. Copia el archivo `.env.example` a `.env` y configura las variables de entorno:

```bash
cp .env.example .env
```

2. Modifica el archivo `.env` con tu configuración:

```
PORT=5000                               # Puerto para el servidor
MONGODB_URI=mongodb://localhost:27017/metro-sevilla  # URL de conexión a MongoDB
JWT_SECRET=your_jwt_secret_key_here     # Clave secreta para tokens JWT
```

## Instalación

```bash
# Instalar dependencias
npm install
```

## Ejecución

```bash
# Modo desarrollo con recarga automática
npm run dev

# Modo producción
npm start
```

## API Endpoints

### Autenticación

- `POST /api/users/register` - Registrar nuevo usuario
- `POST /api/users/login` - Iniciar sesión y obtener token

### Usuarios

- `GET /api/users/profile` - Obtener perfil del usuario autenticado
- `GET /api/users/all` - Obtener todos los usuarios (solo admin)
- `PUT /api/users/update/:id` - Actualizar usuario
- `PUT /api/users/password` - Actualizar contraseña
- `PUT /api/users/deactivate/:id` - Desactivar usuario (solo admin)

### Turnos

- `POST /api/shifts` - Crear nuevo turno (solo admin)
- `GET /api/shifts` - Obtener todos los turnos
- `GET /api/shifts/:id` - Obtener turno por ID
- `GET /api/shifts/employee/:employeeId` - Obtener turnos por empleado
- `PUT /api/shifts/:id` - Actualizar turno (solo admin)
- `DELETE /api/shifts/:id` - Eliminar turno (solo admin)

## Modelos

### Usuario

```javascript
{
  username: String,         // Nombre de usuario único
  email: String,            // Correo electrónico único
  password: String,         // Contraseña (hasheada)
  name: String,             // Nombre completo
  role: String,             // Rol: 'admin' o 'employee'
  isActive: Boolean,        // Estado de la cuenta
  createdAt: Date,          // Fecha de creación
  updatedAt: Date           // Fecha de última actualización
}
```

### Turno

```javascript
{
  start: Date,              // Fecha y hora de inicio
  end: Date,                // Fecha y hora de fin
  title: String,            // Título del turno
  type: String,             // Tipo: 'mañana', 'tarde' o 'noche'
  employee: ObjectId,       // ID del empleado (ref: User)
  createdAt: Date,          // Fecha de creación
  updatedAt: Date           // Fecha de última actualización
}
```
