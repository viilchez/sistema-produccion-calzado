require("dotenv").config({ quiet: true });

const { PrismaClient } = require("../generated/prisma");

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Configura DATABASE_URL en el archivo .env.");
  }

  const url = new URL(connectionString);
  if (url.protocol !== "mysql:" || url.pathname.length <= 1) {
    throw new Error("DATABASE_URL debe indicar una conexión MySQL con nombre de base de datos.");
  }

  return new PrismaClient();
}

module.exports = { createPrismaClient };
