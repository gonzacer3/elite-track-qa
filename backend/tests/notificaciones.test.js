const request = require("supertest");
const app = require("../server");
const pool = require("../db");

let tokenAdmin, tokenConsultor, tokenCliente;

beforeAll(async () => {
  const resAdmin = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "Admin1234!" });
  tokenAdmin = resAdmin.body.token;

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

describe("Notificaciones (RF03)", () => {
  test("Usuario autenticado puede ver notificaciones", async () => {
    const res = await request(app)
      .get("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenConsultor}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Sin token no puede ver notificaciones", async () => {
    const res = await request(app).get("/api/notificaciones");
    expect(res.statusCode).toBe(401);
  });

  test("Admin puede enviar notificación", async () => {
    const res = await request(app)
      .post("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ mensaje: "Hito próximo: revisión UAT", usuario_destino: "todos" });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test("Notificación sin mensaje devuelve 400", async () => {
    const res = await request(app)
      .post("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test("Cliente puede ver sus notificaciones", async () => {
    const res = await request(app)
      .get("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenCliente}`);
    expect(res.statusCode).toBe(200);
  });

  test("Hitos próximos devuelve array", async () => {
    const res = await request(app)
      .get("/api/notificaciones/hitos-proximos")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Hitos próximos sin token devuelve 401", async () => {
    const res = await request(app).get("/api/notificaciones/hitos-proximos");
    expect(res.statusCode).toBe(401);
  });

  test("Consultor puede enviar notificación a usuario específico", async () => {
    const res = await request(app)
      .post("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenConsultor}`)
      .send({ mensaje: "Evidencia lista para revisión", usuario_destino: "qa" });
    expect(res.statusCode).toBe(201);
  });

  test("Notificación sin usuario_destino va a 'todos'", async () => {
    const res = await request(app)
      .post("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ mensaje: "Mensaje sin destino específico" });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test("Sin token no puede enviar notificación — devuelve 401", async () => {
    const res = await request(app)
      .post("/api/notificaciones")
      .send({ mensaje: "Sin token" });
    expect(res.statusCode).toBe(401);
  });

  test("Sin token no puede ver hitos próximos — devuelve 401", async () => {
    const res = await request(app)
      .get("/api/notificaciones/hitos-proximos");
    expect(res.statusCode).toBe(401);
  });

  test("CP04: Sistema detecta hitos próximos a vencer (< 48hs)", async () => {
    // Insertar un hito que vence en 24hs
    await pool.query(`
      INSERT INTO hitos (titulo, descripcion, fecha_vencimiento, proyecto, notificado)
      VALUES ('Hito Test CP04', 'Test alerta', DATE_ADD(NOW(), INTERVAL 24 HOUR), 'EliteTrack QP', 0)
    `);

    const res = await request(app)
      .get("/api/notificaciones/hitos-proximos")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].titulo).toBeDefined();

    // Limpiar
    await pool.query("DELETE FROM hitos WHERE titulo = 'Hito Test CP04'");
  });

  test("Error de BD en GET /hitos-proximos devuelve 500", async () => {
    jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB error"));
    const res = await request(app)
      .get("/api/notificaciones/hitos-proximos")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(500);
    jest.restoreAllMocks();
  });

  test("Error de BD en GET /notificaciones devuelve 500", async () => {
    jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB error"));
    const res = await request(app)
      .get("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenConsultor}`);
    expect(res.statusCode).toBe(500);
    jest.restoreAllMocks();
  });

  test("Error de BD en POST /notificaciones devuelve 500", async () => {
    jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB error"));
    const res = await request(app)
      .post("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ mensaje: "Test error BD" });
    expect(res.statusCode).toBe(500);
    jest.restoreAllMocks();
  });


  test("GET /hitos devuelve todos los hitos", async () => {
    const res = await request(app)
      .get("/api/notificaciones/hitos")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /hitos sin token devuelve 401", async () => {
    const res = await request(app).get("/api/notificaciones/hitos");
    expect(res.statusCode).toBe(401);
  });

  test("POST /hitos crea un hito correctamente", async () => {
    const res = await request(app)
      .post("/api/notificaciones/hitos")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        titulo: "Hito Test",
        descripcion: "Test de creación",
        fecha_vencimiento: "2026-12-31",
        proyecto: "EliteTrack QP",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    await pool.query("DELETE FROM hitos WHERE titulo = 'Hito Test'");
  });

  test("POST /hitos sin título devuelve 400", async () => {
    const res = await request(app)
      .post("/api/notificaciones/hitos")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ fecha_vencimiento: "2026-12-31" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /hitos sin token devuelve 401", async () => {
    const res = await request(app)
      .post("/api/notificaciones/hitos")
      .send({ titulo: "Test", fecha_vencimiento: "2026-12-31" });
    expect(res.statusCode).toBe(401);
  });

  test("Cliente ve solo sus notificaciones", async () => {
    const res = await request(app)
      .get("/api/notificaciones")
      .set("Authorization", `Bearer ${tokenCliente}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});