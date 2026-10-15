# sistema-produccion-calzado

Base de una aplicación web para gestionar la producción de calzado, con Express,
plantillas EJS y Bootstrap 5.3.3.

## Requisitos

- Node.js 24.x y npm.
- Acceso a Internet para instalar las dependencias y cargar Bootstrap desde su CDN.

## Instalación

Desde la carpeta del proyecto:

```powershell
npm ci
Copy-Item .env.example .env
```

En macOS o Linux, utiliza `cp .env.example .env` para copiar el archivo.
Si ya tienes un archivo `.env`, conserva su configuración en lugar de sobrescribirlo.
No publiques ese archivo: puede contener credenciales y está excluido por `.gitignore`.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto del servidor. Por defecto, `3000`. |
| `DATABASE_URL` | Ejemplo de conexión MySQL; todavía no se utiliza. Sustituye los valores ilustrativos cuando se implemente la base de datos. |

## Ejecutar

Para desarrollo, con reinicio automático al cambiar los archivos JavaScript:

```powershell
npm run dev
```

Para iniciar sin vigilancia de archivos:

```powershell
npm start
```

Abre http://localhost:3000 (o el puerto configurado). Detén el servidor con `Ctrl+C`.
El modo de desarrollo utiliza la función `--watch` de Node.js; no requiere nodemon.
Actualiza el navegador después de editar una plantilla EJS.

## Comprobaciones

Con el servidor en ejecución, visita:

- `GET /`: debe mostrar el panel de inicio con el título «Panel de inicio».
- `GET /health`: debe responder HTTP 200 y `{"status":"ok"}`.
- Una ruta inexistente: debe responder HTTP 404.

Para consultar vulnerabilidades conocidas de las dependencias:

```powershell
npm audit
```

Todavía no hay una suite de pruebas ni comprobaciones automáticas en GitHub.
El endpoint `/health` confirma que el servidor responde; no comprueba una conexión
a base de datos.

## Estado del proyecto

Implementado: servidor Express, renderizado EJS, estilos Bootstrap y endpoint de salud.

Pendiente: integración con MySQL y Prisma ORM, modelo de datos de calzado,
formulario y listado de modelos. No es necesario instalar MySQL para ejecutar
esta versión inicial.
