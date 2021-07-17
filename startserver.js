const fs = require("fs");
const path = require("path");
var { spawn } = require("child_process");
serverBat = path.resolve("Start.bat");

var status = "not running";
var consoleData = [];
const startServer = async () => {
  console.log("starting servers");
  status = "starting";
  return new Promise((resolve, reject) => {
    var child = spawn(serverBat, {
      shell: false,
      detached: false,
    });
    child.unref();
    child.stderr.on("data", function (data) {
      console.error("STDERR:", data.toString());
      child.kill();
      status = "not running";
    });
    child.stdout.on("data", function (data) {
      consoleData.push(data.toString().trim());
      if (consoleData.length > 200) consoleData.shift();
      console.log(data.toString().trim());
      if (data.toString().includes("minecraft:overworld finished.")) {
        status = "ready";
        resolve(status);
      }
    });
    child.on("close", function (exitCode) {
      status = "not running";
      console.log("server crashed");
    });
  });
};

const getConsoleData = () => {
  return consoleData;
};

const getStatus = () => {
  return status;
};

module.exports = {
  startServer,
  getConsoleData,
  getStatus,
};
