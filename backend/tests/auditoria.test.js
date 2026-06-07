const request = require("supertest");
const app = require("../server");
const pool = require("../db");

let tokenAdmin, tokenQA, tokenConsultor, tokenCliente;

beforeAll(async () => {
  const resAdmin = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "Admin1234!" });
  tokenAdmin = resAdmin.body.token;

  const resQA = await request(app)
    .post("/api/auth/login")
    .send({ username: "qa", password: "QA1234!" });
  tokenQA = resQA.body.token;

  const resConsultor = await request(app)
    .post("/api/auth/login")
    .send({ username: "consultor", password: "Consultor1234!" });
  tokenConsultor = resConsultor.body.token;

  const resCliente = await request(app)
    .post("/api/auth/login")
    .send({ username: "cliente", password: "Cliente1234!" });
  tokenCliente = resCliente.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("Auditoría (RF04)", () => {
  test("Direccion puede ver historial de auditoría", async () => {
    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("QA puede ver historial de auditoría", async () => {
    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenQA}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Consultor no puede ver auditoría — devuelve 403", async () => {
    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenConsultor}`);
    expect(res.statusCode).toBe(403);
  });

  test("Cliente no puede ver auditoría — devuelve 403", async () => {
    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenCliente}`);
    expect(res.statusCode).toBe(403);
  });

  test("Sin token no puede ver auditoría — devuelve 401", async () => {
    const res = await request(app).get("/api/auditoria");
    expect(res.statusCode).toBe(401);
  });

  test("Auditoría registra acciones automáticamente", async () => {
    // Hacer una acción
    await request(app)
      .post("/api/auth/login")
      .send({ username: "consultor", password: "Consultor1234!" });

    // Verificar que quedó registrada
    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    const acciones = res.body.map(a => a.accion);
    expect(acciones.some(a => a.includes("LOGIN"))).toBe(true);
  });

  test("Registros de auditoría tienen usuario y fecha", async () => {
    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    const registro = res.body[0];
    expect(registro.usuario).toBeDefined();
    expect(registro.accion).toBeDefined();
    expect(registro.fecha).toBeDefined();
  });

  test("Auditoría es inmutable — no existe endpoint DELETE", async () => {
    const res = await request(app)
      .delete("/api/auditoria/1")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(404);
  });

  test("Auditoría es inmutable — no existe endpoint PUT", async () => {
    const res = await request(app)
      .put("/api/auditoria/1")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(404);
  });

  test("Historial ordenado por fecha descendente", async () => {
    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    if (res.body.length > 1) {
      const fechas = res.body.map(r => new Date(r.fecha));
      expect(fechas[0] >= fechas[1]).toBe(true);
    }
  });
});