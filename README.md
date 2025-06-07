# gestor-empleados-metro-de-sevilla
FRONTED 
# Gestor Empleados Metro de Sevilla - Frontend

Este es el frontend del proyecto **Gestor Empleados Metro de Sevilla**, una aplicación para la gestión de horarios y turnos de empleados del Metro de Sevilla.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Descripción

La aplicación permite a los empleados visualizar y gestionar sus horarios mediante un dashboard interactivo. Incluye vistas de calendario mensual y de lista, con la posibilidad de añadir, editar y eliminar turnos.

## Tecnologías

- **React** como framework principal.
- **Vite** (o Create React App) para la configuración del entorno.
- **Tailwind CSS** para la maquetación y estilos.
- **Lucide React** para íconos.
- **React Router** para la navegación.
- Componentes personalizados organizados en la carpeta `src/components`.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://ruta-de-tu-repositorio.git
   ```

2. Navega a la carpeta del frontend:
   ```bash
   cd gestor-empleados-metro-de-sevilla/frontend
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

Para arrancar el proyecto en modo desarrollo:
```bash
npm run dev
```

El proyecto se ejecutará generalmente en `http://localhost:3000` (o el puerto configurado).

Para construir la versión de producción:
```bash
npm run build
```

## Estructura del Proyecto

```
frontend/
├── public/            # Archivos estáticos
├── src/
│   ├── assets/        # Recursos como imágenes, fuentes, etc.
│   ├── components/    # Componentes reutilizables (ej. Dashboard, MonthlyCalendar, etc.)
│   ├── contexts/      # Contextos de React (p.ej. AuthContext)
│   ├── pages/         # Vistas o páginas (ej. Dashboard.jsx)
│   ├── lib/           # Funciones de utilidad y llamadas API
│   ├── App.jsx        # Componente principal de la aplicación
│   └── main.jsx       # Punto de entrada de la aplicación
├── package.json
└── README.md
```

## Contribución

Si deseas contribuir:
1. Haz un fork del proyecto.
2. Crea una rama para tu nueva funcionalidad o corrección.
3. Realiza tus cambios y envía un pull request.

BANCKEND

  Programación de recordatorios para avisar a los empleados sobre sus turnos mediante un sistema de scheduling y envío de correos electrónicos.

## Estructura del Proyecto

```
gestor-empleados-metro-de-sevilla
└── backend
    ├── src
    │   ├── config
    │   │   └── db.js                     # Conexión a MongoDB
    │   ├── controllers                   # Controladores para usuarios y turnos
    │   ├── jobs                          # Sistema de scheduler para recordatorios
    │   ├── lib
    │   │   └── email.js                  # Envío de emails
    │   ├── middleware                    # Middlewares de autenticación y manejo de errores
    │   │   └── auth.middleware.js
    │   ├── models                        # Modelos Mongoose para Usuario y Turno
    │   │   ├── user.model.js
    │   │   └── shift.model.js
    │   ├── routes                        # Rutas de la API para usuarios y turnos
    │   │   ├── userRoutes.js
    │   │   └── shiftRoutes.js
    │   └── server.js                     # Inicialización del servidor
    ├── tests                             # Pruebas automatizadas y scripts de testing
    ├── scripts                           # Scripts para desarrollo y producción
    └── .env                              # Variables de entorno (no incluir en producción)
```

## Requisitos

- Node.js (version 14 o superior)
- MongoDB

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://tu-repositorio-url.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd gestor-empleados-metro-de-sevilla/backend
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

## Configuración

Crea un archivo `.env` en la raíz del directorio `backend` con las siguientes variables de entorno:

```
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/metro-sevilla

# JWT Configuration
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=2h

# Admin user (se creará cuando no existan usuarios)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@metrosevilla.com
ADMIN_PASSWORD=tu_password_admin
ADMIN_NAME=Joaquin
ADMIN_DNE=ADMIN001

# Configuración para envío de emails (usando Resend o similar)
RESEND_API_KEY=tu_api_key
FROM_EMAIL=delivered@resend.dev
```

Asegúrate de reemplazar los valores de ejemplo por los correspondientes a tu entorno.

## Ejecución

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

En modo producción:
```bash
npm start
```

El servidor se conectará a MongoDB, validará las variables de entorno y, si no existe, creará un usuario administrador inicial. Además, se inicializará el sistema de scheduler de forma no bloqueante.

## Endpoints Principales

- **Usuarios:**  
  `/api/users`
  - Registro, login, actualización y manejo de datos de usuarios.

- **Turnos:**  
  `/api/shifts`
  - Gestión completa de los turnos de los empleados, incluyendo recordatorios y notificaciones.

## Testing

La carpeta `tests` contiene scripts y pruebas para verificar el correcto funcionamiento de la API y el scheduler. Para ejecutar las pruebas, utiliza:
```bash
npm test
```
