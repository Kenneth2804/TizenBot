const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const dotenv = require("dotenv");
const magic = require("./magicinfo");

dotenv.config();

const app = express();
const PORT = process.env.REPORT_PORT || 8080;

app.use(bodyParser.json());

let loggedIn = false;

(async () => {
  try {
    await magic.login();
    loggedIn = true;
    console.log("Login en MagicINFO exitoso");
  } catch (err) {
    console.error("Error al iniciar sesión en MagicINFO:", err.message);
  }
})();

app.post("/report", async (req, res) => {
  const { deviceId, issue, currentValue } = req.body;
  const log = `[${new Date().toISOString()}] Alerta desde ${deviceId}: ${issue} = ${currentValue}\n`;

  console.log(log);
  fs.appendFileSync("report_logs.txt", log);

  if (issue === "timezone" && loggedIn) {
    try {
      await magic.updateTime(deviceId, process.env.EXPECTED_TIMEZONE || "America/Mexico_City");
      console.log(`Zona horaria de ${deviceId} restaurada vía MagicINFO`);
    } catch (err) {
      console.error("Error al restaurar timezone con MagicINFO:", err.message);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor de reportes activo en puerto ${PORT}`);
});
