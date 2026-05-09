const bcrypt = require("bcryptjs");

async function run() {
  const password = "1234"; // la contraseña que quieras usar
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log("Hash generado:", hash);
}

run();
