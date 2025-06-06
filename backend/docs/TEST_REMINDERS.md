# 🧪 GUÍA DE PRUEBAS PARA RECORDATORIOS DE TURNOS

## Endpoints disponibles para testing

### 1. Crear turno de prueba con recordatorios inmediatos
**POST** `/api/shifts/test`

```json
{
  "employee": "EMPLOYEE_ID_AQUI",
  "minutesFromNow": 5
}
```

**Este endpoint creará:**
- Un turno que empieza en 5 minutos (puedes cambiar el valor)
- Recordatorios automáticos a los 30 segundos, 1 minuto y 2 minutos desde AHORA

### 2. Ver trabajos programados
**GET** `/api/shifts/jobs`

Te muestra todos los trabajos de recordatorio programados en la cola.

### 3. Crear turno normal con modo de prueba
**POST** `/api/shifts/`

```json
{
  "start": "2025-06-05T15:00:00Z",
  "end": "2025-06-05T17:00:00Z", 
  "title": "Turno de prueba",
  "type": "morning",
  "employee": "EMPLOYEE_ID_AQUI",
  "testMode": true
}
```

**Nota:** Los tipos válidos son: `"morning"`, `"afternoon"`, `"night"`

Si incluyes `testMode: true`, los recordatorios se enviarán a los 30s, 1min y 2min desde la creación del turno.

## Pasos para probar:

1. **Asegúrate de que el servidor esté corriendo** y Agenda haya iniciado correctamente
2. **Obtén un ID de empleado válido** (puedes usar GET `/api/users` para ver usuarios)
3. **Usa Postman, Thunder Client o curl** para hacer las requests
4. **Revisa la consola del servidor** para ver los logs de programación
5. **Espera los emails** - deberían llegar a `daniel.zapata.682@gmail.com` según está configurado
6. **Consulta `/api/shifts/jobs`** para ver el estado de los trabajos

## Ejemplo completo con curl:

```bash
# 1. Crear turno de prueba (reemplaza EMPLOYEE_ID y añade headers de auth)
curl -X POST http://localhost:5000/api/shifts/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"employee": "EMPLOYEE_ID_AQUI", "minutesFromNow": 3}'

# 2. Ver trabajos programados
curl -X GET http://localhost:5000/api/shifts/jobs \
  -H "Authorization: Bearer TU_TOKEN"
```

## Qué esperar:

- **En la consola:** Logs mostrando la programación de trabajos con emojis 🧪
- **Emails de prueba:** Llegarán con marca [PRUEBA] en el asunto
- **Timestamps:** Cada email mostrará cuándo fue enviado exactamente

## Timeouts configurados:

- **30 segundos:** Primer recordatorio de prueba
- **1 minuto:** Segundo recordatorio de prueba  
- **2 minutos:** Tercer recordatorio de prueba

¡Perfecto para ver cómo funciona el sistema en tiempo real!
