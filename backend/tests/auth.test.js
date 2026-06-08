const request = require("supertest");
const app = require("../server");
const pool = require("../db");

afterAll(async () => {
  await pool.end();
});

describe("Auth / RBAC (RF01)", () => {
  let token;

  test("CP-SEC01: Login exitoso devuelve JWT con bcrypt", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "Admin1234!" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.role).toBe("Direccion");
    token = res.body.token;
  });

  test("CP-SEC02: Token JWT contiene rol y expira en 15 min", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "Admin1234!" });
    expect(res.statusCode).toBe(200);
    const jwt = require("jsonwebtoken");
    const decoded = jwt.decode(res.body.token);
    expect(decoded.role).toBe("Direccion");
    expect(decoded.exp - decoded.iat).toBe(900);
  });

  test("CP-SEC03: Acceso denegado por rol incorrecto devuelve 403", async () => {
    const loginCliente = await request(app)
      .post("/api/auth/login")
      .send({ username: "cliente", password: "Cliente1234!" });
    const tokenCliente = loginCliente.body.token;

    const res = await request(app)
      .get("/api/auditoria")
      .set("Authorization", `Bearer ${tokenCliente}`);
    expect(res.statusCode).toBe(403);
  });

  test("CP-SEC04: Login con contraseña incorrecta devuelve 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "wrongpassword" });
    expect(res.statusCode).toBe(401);
  });

  test("CP-SEC05: Token inválido devuelve 401", async () => {
    const res = await request(app)
      .get("/api/evidencias")
      .set("Authorization", "Bearer token_invalido_123");
    expect(res.statusCode).toBe(401);
  });

  test("CP-SEC06: Sin token devuelve 401", async () => {
    const res = await request(app).get("/api/evidencias");
    expect(res.statusCode).toBe(401);
  });

  test("Login sin usuario devuelve 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "Admin1234!" });
    expect(res.statusCode).toBe(400);
  });

  test("Login con usuario inexistente devuelve 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "noexiste", password: "1234" });
    expect(res.statusCode).toBe(401);
  });

  test("CP-SEC04: Cuenta bloqueada tras 5 intentos fallidos devuelve 423", async () => {
    // Resetear bloqueo previo
    await pool.query(
      "UPDATE users SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE username = ?",
      ["consultor"]
    );
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/auth/login")
        .send({ username: "consultor", password: "wrongpassword" });
    }
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "consultor", password: "wrongpassword" });
    expect(res.statusCode).toBe(423);
  });

  test("CP-SEC06: Login exitoso resetea el contador de intentos fallidos", async () => {
    await pool.query(
      "UPDATE users SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE username = ?",
      ["consultor"]
    );
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "consultor", password: "Consultor1234!" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("RNF02: Refresh token válido devuelve nuevo token", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "Admin1234!" });
    const token = loginRes.body.token;

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token).not.toBe(token);
  });

  test("RNF02: Refresh sin token devuelve 401", async () => {
    const res = await request(app).post("/api/auth/refresh");
    expect(res.statusCode).toBe(401);
  });
});