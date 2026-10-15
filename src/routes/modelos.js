const express = require("express");

function createModelosRouter(prisma) {
  const router = express.Router();
  async function render(res, status = 200, values = {}, errors = {}) {
    const modelos = await prisma.modeloCalzado.findMany({ orderBy: { id: "desc" } });
    return res.status(status).render("modelos", { modelos, values, errors, guardado: false });
  }

  router.get("/", async (req, res) => {
    const modelos = await prisma.modeloCalzado.findMany({ orderBy: { id: "desc" } });
    res.render("modelos", { modelos, values: {}, errors: {}, guardado: req.query.guardado === "1" });
  });

  router.post("/", async (req, res) => {
    const values = {};
    for (const field of ["codigo", "nombre", "descripcion"]) {
      values[field] = typeof req.body?.[field] === "string" ? req.body[field].trim() : "";
    }
    values.codigo = values.codigo.toUpperCase();
    const errors = {};
    if (!/^[A-Z0-9][A-Z0-9_-]{0,29}$/.test(values.codigo)) {
      errors.codigo = "Escribe un código de 1 a 30 caracteres: letras sin tildes, números, guion o guion bajo. Debe empezar con letra o número.";
    }
    if (!values.nombre || values.nombre.length > 100) errors.nombre = "Escribe un nombre de 1 a 100 caracteres.";
    if (!values.descripcion || values.descripcion.length > 1000) errors.descripcion = "Escribe una descripción de 1 a 1000 caracteres.";
    if (Object.keys(errors).length) return render(res, 422, values, errors);

    try {
      await prisma.modeloCalzado.create({ data: values });
    } catch (error) {
      if (error.code === "P2002") {
        return render(res, 409, values, { codigo: "Ya existe un modelo con ese código. Utiliza otro." });
      }
      throw error;
    }
    res.redirect(303, "/modelos?guardado=1");
  });
  return router;
}

module.exports = { createModelosRouter };
