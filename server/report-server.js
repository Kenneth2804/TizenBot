const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.REPORT_PORT || 8080;

app.use(bodyParser.json());

app.post("/report", (req, res) => {
  const { deviceId, issue, currentValue } = req.body;
  const log = `[${new Date().toISOString()}] Alerta desde ${deviceId}: ${issue} = ${currentValue}\n`;
  console.log(log);
  fs.appendFileSync("report_logs.txt", log);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`📡 Servidor de reportes activo en puerto ${PORT}`);
});
