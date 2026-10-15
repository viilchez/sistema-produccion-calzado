const { test } = require("node:test");
const assert = require("node:assert/strict");
const { randomBytes } = require("node:crypto");
const { createApp } = require("../src/app");
const { createPrismaClient } = require("../src/lib/prisma");

test("registro, duplicados y validación con MySQL real", async (t) => {
  const prisma = createPrismaClient();
  const server = createApp(prisma).listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const codigo = `TEST-${randomBytes(8).toString("hex").toUpperCase()}`;
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    try { await prisma.modeloCalzado.deleteMany({ where: { codigo } }); }
    finally { await prisma.$disconnect(); }
  });
  const post = (values) => fetch(`${base}/modelos`, {
    method: "POST", body: new URLSearchParams(values), redirect: "manual",
  });

  const created = await post({ codigo: codigo.toLowerCase(), nombre: "  Modelo de prueba  ", descripcion: "<script>alert(1)</script>" });
  assert.equal(created.status, 303);
  assert.equal(created.headers.get("location"), "/modelos?guardado=1");
  const saved = await prisma.modeloCalzado.findUnique({ where: { codigo } });
  assert.equal(saved.nombre, "Modelo de prueba");

  const page = await fetch(`${base}/modelos?guardado=1`);
  const html = await page.text();
  assert.equal(page.status, 200);
  assert.ok(html.includes(codigo));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>alert(1)</script>"));

  const duplicate = await post({ codigo, nombre: "Otro", descripcion: "Descripción" });
  assert.equal(duplicate.status, 409);
  assert.ok((await duplicate.text()).includes("Ya existe un modelo"));
  assert.equal(await prisma.modeloCalzado.count({ where: { codigo } }), 1);

  for (const values of [
    { codigo: "", nombre: "", descripcion: "" },
    { codigo: "COD CON ESPACIOS", nombre: "Nombre", descripcion: "Descripción" },
    { codigo, nombre: "a".repeat(101), descripcion: "Descripción" },
    { codigo, nombre: "Nombre", descripcion: "a".repeat(1001) },
  ]) {
    assert.equal((await post(values)).status, 422);
  }
  const malformed = await fetch(`${base}/modelos`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: '{"codigo":',
  });
  assert.equal(malformed.status, 400);
});
