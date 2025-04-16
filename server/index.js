const fs = require("fs");
const path = require("path");
const {
  login,
  getCurrentSetup,
  updateSetup,
  updateTime
} = require("./magicinfo");
require("dotenv").config();

async function run() {
  const config = JSON.parse(fs.readFileSync("config.json"));
  await login();

  for (const deviceId of config.devices) {
    try {
      const current = await getCurrentSetup(deviceId);
      const expected = config.expectedConfig;
      const needUpdate =
        current.serverURL !== expected.serverURL ||
        current.tlsPort !== expected.tlsPort ||
        current.useTLs !== expected.useTLs;

      if (needUpdate) {
        console.log(`Restaurando red en ${deviceId}`);
        await updateSetup(deviceId, expected);
      }

      if (current.timeZone !== expected.timezone) {
        console.log(`Corrigiendo zona horaria en ${deviceId}`);
        await updateTime(deviceId, expected.timezone);
      }
    } catch (err) {
      console.error(`Error en ${deviceId}:`, err.message);
    }
  }
}

setInterval(run, process.env.CHECK_INTERVAL);
run();
