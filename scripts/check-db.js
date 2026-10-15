const { createPrismaClient } = require("../src/lib/prisma");

async function main() {
  let prisma;
  try {
    prisma = createPrismaClient();
    await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log("Conexión MySQL verificada mediante Prisma.");
  } catch {
    // No imprimir el error del driver: puede contener datos de conexión.
    console.error("No se pudo verificar MySQL. Revisa DATABASE_URL, el servidor, la base de datos y los permisos del usuario.");
    process.exitCode = 1;
  } finally {
    if (prisma) await prisma.$disconnect();
  }
}

main().catch(() => {
  console.error("No se pudo cerrar la conexión MySQL correctamente.");
  process.exitCode = 1;
});
