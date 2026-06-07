const request = require("supertest");
const app = require("../server");
const pool = require("../db");

let tokenQA, tokenConsultor, tokenCliente;

beforeAll(async () => {
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

describe("Evidencias (RF02)", () => {
  let evidenciaId;

  test("Consultor puede subir evidencia", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ titulo: "Evidencia Test", descripcion: "Descripción de prueba" });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    evidenciaId = res.body.id;
  });

  test("QA puede subir evidencia", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ titulo: "Evidencia QA", descripcion: "Test desde QA" });
    expect(res.statusCode).toBe(201);
  });

  test("Cliente no puede subir evidencia — devuelve 403", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({ titulo: "Intento cliente", descripcion: "No debería poder" });
    expect(res.statusCode).toBe(403);
  });

  test("Evidencia sin título devuelve 400", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ descripcion: "Sin título" });
    expect(res.statusCode).toBe(400);
  });

  test("QA puede listar evidencias", async () => {
    const res = await request(app)
      .get("/api/evidencias")
      .set("Authorization", `Bearer ${tokenQA}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("QA puede aprobar evidencia", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "aprobada" });
    expect(res.statusCode).toBe(200);
  });

  test("QA puede rechazar evidencia", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "rechazada" });
    expect(res.statusCode).toBe(200);
  });

  test("Estado inválido devuelve 400", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "invalido" });
    expect(res.statusCode).toBe(400);
  });

  test("Consultor no puede revisar evidencias — devuelve 403", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ estado: "aprobada" });
    expect(res.statusCode).toBe(403);
  });

  test("Evidencia inexistente devuelve 404", async () => {
    const res = await request(app)
      .patch("/api/evidencias/99999/revisar")
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "aprobada" });
    expect(res.statusCode).toBe(404);
  });

  test("Sin token no puede listar evidencias", async () => {
    const res = await request(app).get("/api/evidencias");
    expect(res.statusCode).toBe(401);
  });

  test("Archivo dentro del límite de 20MB es aceptado", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ titulo: "Con archivo", descripcion: "Test archivo", archivo: "data_pequeña" });
    expect(res.statusCode).toBe(201);
  });
});
