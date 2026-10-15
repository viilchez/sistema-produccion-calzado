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
npm run db:generate
```

En macOS o Linux, utiliza `cp .env.example .env` para copiar el archivo.
Si ya tienes un archivo `.env`, conserva su configuración en lugar de sobrescribirlo.
No publiques ese archivo: puede contener credenciales y está excluido por `.gitignore`.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto del servidor. Por defecto, `3000`. |
| `DATABASE_URL` | Conexión MySQL utilizada por Prisma y `npm run db:check`. Reemplaza los valores de ejemplo en tu `.env` local. |

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

Ejecuta `npm test` con MySQL activo, `.env` configurado y las migraciones aplicadas.
La prueba de integración registra un modelo temporal, comprueba persistencia,
rechazo de duplicados, validación y escape HTML, y elimina únicamente su registro
de prueba al finalizar. No hay comprobaciones automáticas en GitHub.
El endpoint `/health` confirma que el servidor responde; no comprueba una conexión
a base de datos.

## MySQL y Prisma

Se utiliza Prisma 6.19.3 con el cliente CommonJS de este proyecto. La dependencia
transitiva `deepmerge-ts` se fija en 8.0.2 para corregir su vulnerabilidad de
agotamiento de pila. No retires esa regla sin repetir la auditoría y las pruebas.

1. Instala MySQL Community Server 8.4 LTS desde el sitio oficial de MySQL.
   En Windows también puedes ejecutar:

   ```powershell
   winget install --id Oracle.MySQL --exact
   ```

2. Completa la configuración del servidor en MySQL Configurator, conserva
   el puerto 3306 y establece una contraseña de administrador. Mantén el
   servidor limitado al equipo local para desarrollo.
3. En una sesión administrativa de MySQL, crea la base y un usuario exclusivo
   del proyecto. Sustituye la contraseña ilustrativa antes de ejecutar:

   ```sql
   CREATE DATABASE produccion_calzado CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'calzado_app'@'localhost' IDENTIFIED BY 'CAMBIA_ESTA_CLAVE';
   GRANT ALL PRIVILEGES ON produccion_calzado.* TO 'calzado_app'@'localhost';
   ```

4. Configura `.env` con `DATABASE_URL` usando ese usuario y contraseña.
   Codifica los caracteres especiales de usuario y contraseña para una URL.
   No utilices el usuario administrador para la aplicación.
5. Genera el cliente, valida el esquema y comprueba la conexión:

   ```powershell
   npm run db:generate
   npm run db:validate
   npm run db:check
   ```

`db:check` ejecuta `SELECT 1` a través de Prisma y termina con error si no puede
conectarse. No imprime credenciales. El cliente generado no se versiona:
repite `db:generate` tras instalar o cambiar el esquema.

Aplica las migraciones ya versionadas con `npm run db:deploy` antes de abrir
`/modelos` o ejecutar las pruebas. Este comando no necesita una base sombra.
Para desarrollar nuevas migraciones, `npm run db:migrate -- --name nombre_del_cambio`
requiere además una base de datos sombra y sus permisos de desarrollo.

## Registro de modelos (HU-01)

Abre `/modelos` o usa «Gestionar modelos de calzado» en el inicio.
Completa código, nombre y descripción, y pulsa «Guardar modelo».
El registro aparece en el listado y permanece en MySQL al reiniciar el servidor.

- Código obligatorio y único, de 1 a 30 caracteres: letras sin tildes, números,
  guion y guion bajo, empezando por una letra o número. Se recortan espacios
  exteriores y se guarda en mayúsculas.
- Nombre obligatorio, hasta 100 caracteres.
- Descripción obligatoria, hasta 1000 caracteres.
- Un código duplicado muestra un error y conserva los datos del formulario.

La autenticación corresponde a HU-10 y aún está pendiente. Usa esta entrega
en el entorno local de desarrollo.

## Estado del proyecto

Implementado: servidor Express, renderizado EJS, estilos Bootstrap y endpoint de salud.

Implementado: integración Prisma/MySQL, primera migración de modelos, formulario,
listado y pruebas de registro. La conexión local se verificó mediante `db:check`.

Pendiente de HU-01: comprobar que el modelo guardado se ofrece al crear una orden,
cuando se implemente ese flujo. No marcar HU-01 completa hasta verificar ese criterio.
