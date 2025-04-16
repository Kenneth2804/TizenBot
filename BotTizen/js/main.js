window.onload = function () {
  const CHECK_INTERVAL = 300000;

  function fetchConfig() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "config.json", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject("JSON mal formado");
          }
        }
      };
      xhr.send();
    });
  }

  function reportChange(type, value) {
    fetch(window.config.reportURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: "TIZEN-TV",
        issue: type,
        currentValue: value
      })
    });
  }

  function checkChanges() {
    try {

      tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function (wifi) {
        const currentURL = wifi.ipAddress;
        if (currentURL !== window.config.serverURL) {
          reportChange("serverURL", currentURL);
        }
      });

      tizen.systeminfo.getPropertyValue("SYSTEM", function (sys) {
        if (sys.timezone !== window.config.timezone) {
          reportChange("timezone", sys.timezone);
  
          try {
            tizen.time.setTimezone(window.config.timezone);
            console.log("Zona horaria restaurada a:", window.config.timezone);
          } catch (e) {
            console.log("Error al cambiar zona horaria:", e.message);
          }
        }
      });
    } catch (e) {
      console.log("Error verificando config:", e.message);
    }
  }
  

  fetchConfig().then((conf) => {
    window.config = conf;
    checkChanges();
    setInterval(checkChanges, CHECK_INTERVAL);
  });
};
