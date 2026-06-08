const request = require("supertest");
const app = require("../server");
const pool = require("../db");

let tokenQA, tokenConsultor, tokenCliente, tokenAdmin;

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

  const resAdmin = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "Admin1234!" });
  tokenAdmin = resAdmin.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe("Evidencias (RF02)", () => {
  let evidenciaId, evidenciaConsultorId;

  test("Consultor puede subir evidencia con proyecto y hito", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({
        titulo: "Evidencia Test Consultor",
        descripcion: "Descripción de prueba",
        proyecto: "EliteTrack QP",
        hito: "Hito 1 - Inicio",
        archivo_nombre: "test.pdf",
        archivo_tipo: "application/pdf"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    evidenciaId = res.body.id;
  });

  test("QA puede subir evidencia", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({
        titulo: "Evidencia QA Test",
        descripcion: "Test desde QA"
      });
    expect(res.statusCode).toBe(201);
  });

  test("Cliente no puede subir evidencia — 403", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({
        titulo: "Intento cliente",
        descripcion: "No debería poder"
      });
    expect(res.statusCode).toBe(403);
  });

  test("Evidencia sin título devuelve 400", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ descripcion: "Sin título" });
    expect(res.statusCode).toBe(400);
  });

  test("Evidencia sin descripción devuelve 400", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ titulo: "Solo título" });
    expect(res.statusCode).toBe(400);
  });

  test("QA listar sin filtro — muestra todas", async () => {
    await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ titulo: "Evidencia2 QA", descripcion: "Test" });

    const res = await request(app)
      .get("/api/evidencias")
      .set("Authorization", `Bearer ${tokenQA}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Cliente solo ve sus propias evidencias — filtro por usuario", async () => {
    await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({
        titulo: "Evidencia Consultor Privada",
        descripcion: "Solo Consultor"
      });

    const res = await request(app)
      .get("/api/evidencias")
      .set("Authorization", `Bearer ${tokenCliente}`);
    expect(res.statusCode).toBe(200);

    res.body.forEach((ev) => {
      expect(ev.usuario).toBe("cliente");
    });
  });

  test("Consultor puede listar todas", async () => {
    const res = await request(app)
      .get("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Admin puede listar todas", async () => {
    const res = await request(app)
      .get("/api/evidencias")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Sin token no puede listar — 401", async () => {
    const res = await request(app).get("/api/evidencias");
    expect(res.statusCode).toBe(401);
  });

  test("QA puede aprobar evidencia", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "aprobada" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("aprobada");
  });

  test("QA puede rechazar evidencia", async () => {
    const createRes = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({
        titulo: "Para rechazar",
        descripcion: "Test rechazo"
      });
    const newId = createRes.body.id;

    const res = await request(app)
      .patch(`/api/evidencias/${newId}/revisar`)
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "rechazada" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("rechazada");
  });

  test("Estado inválido devuelve 400", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "invalido" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("aprobada o rechazada");
  });

  test("Consultor no puede revisar — 403", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ estado: "aprobada" });
    expect(res.statusCode).toBe(403);
  });

  test("Cliente no puede revisar — 403", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .set("Authorization", `Bearer ${tokenCliente}`)
      .send({ estado: "aprobada" });
    expect(res.statusCode).toBe(403);
  });

  test("Evidencia inexistente — 404", async () => {
    const res = await request(app)
      .patch("/api/evidencias/99999999/revisar")
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "aprobada" });
    expect(res.statusCode).toBe(404);
  });

  test("Sin token en revisar — 401", async () => {
    const res = await request(app)
      .patch(`/api/evidencias/${evidenciaId}/revisar`)
      .send({ estado: "aprobada" });
    expect(res.statusCode).toBe(401);
  });

  test("Archivo pequeño es aceptado", async () => {
    const res = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({
        titulo: "Con archivo",
        descripcion: "Test",
        archivo: "aW1hZ2VkYXRhOkltYWdlIg==",
        archivo_nombre: "test.pdf",
        archivo_tipo: "application/pdf"
      });
    expect(res.statusCode).toBe(201);
  });

  test("Auditoría registra subida de evidencia", async () => {
    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenQA}`);
    expect(res.statusCode).toBe(200);
    const hasSubio = res.body.some(a => a.accion.includes("SUBIO_EVIDENCIA"));
    expect(hasSubio).toBe(true);
  });

  test("Auditoría registra revisión de evidencia", async () => {
    const createRes = await request(app)
      .post("/api/evidencias")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({
        titulo: "Para auditoria",
        descripcion: "Test"
      });

    await request(app)
      .patch(`/api/evidencias/${createRes.body.id}/revisar`)
      .set("Authorization", `Bearer ${tokenQA}`)
      .send({ estado: "aprobada" });

    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenQA}`);
    expect(res.statusCode).toBe(200);
    const hasReviso = res.body.some(a => a.accion.includes("REVISO_EVIDENCIA"));
    expect(hasReviso).toBe(true);
  });
});