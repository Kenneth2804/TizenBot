const axios = require("axios");
require("dotenv").config();

let token = null;

async function login() {
  const res = await axios.post(`${process.env.MAGICINFO_URL}/MagicInfo/restapi/v2.0/auth`, {
    grantType: "password",
    username: process.env.MAGICINFO_USER,
    password: process.env.MAGICINFO_PASS
  });
  token = res.data.token;
}

async function getCurrentSetup(deviceId) {
  const res = await axios.post(
    `${process.env.MAGICINFO_URL}/MagicInfo/restapi/v2.0/rms/devices/current-setup-info`,
    { deviceIds: [deviceId] },
    { headers: { api_key: token } }
  );
  return res.data[0];
}

async function updateSetup(deviceId, config) {
  await axios.put(
    `${process.env.MAGICINFO_URL}/MagicInfo/restapi/v2.0/rms/devices/current-setup-info`,
    {
      deviceId,
      setupInfo: config
    },
    { headers: { api_key: token } }
  );
}

async function updateTime(deviceId, timeZone) {
  await axios.post(
    `${process.env.MAGICINFO_URL}/MagicInfo/restapi/v2.0/rms/devices/current-time-info`,
    {
      deviceId,
      timeZone,
      dateTime: new Date().toISOString()
    },
    { headers: { api_key: token } }
  );
}

module.exports = { login, getCurrentSetup, updateSetup, updateTime };
