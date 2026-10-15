require("dotenv").config({ quiet: true });

const express = require("express");
const path = require("path");
const { createPrismaClient } = require("./lib/prisma");
const { createModelosRouter } = require("./routes/modelos");

function createApp(prisma) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (req, res) => {
    res.render("index", { titulo: "Panel de inicio" });
  });
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/modelos", createModelosRouter(prisma));

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.status === 400 ? 400 : error.status === 413 ? 413 : 503;
    res.status(status).render("error", { status });
  });
  return app;
}

if (require.main === module) {
  const prisma = createPrismaClient();
  const app = createApp(prisma);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

module.exports = { createApp };
