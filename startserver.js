const fs = require("fs");
const path = require("path");
const readLastLines = require("read-last-lines");
var { spawn, execFile, exec, execFileSync } = require("child_process");
fs.writeFileSync(path.resolve("console.log"), "");
serverBat = path.resolve(
  process.argv[3] || process.env.serverBat || "Start.bat"
);
const batchData = fs.readFileSync(serverBat, "utf8");
const batchFixed = batchData
  .split(/[\r\n]+/)
  .map((line) => {
    var fixedLine = line;
    if (
      line.includes(".jar") &&
      line.includes("java") &&
      !line.includes("console.log")
    ) {
      fixedLine = `${fixedLine}`;
    }
    return fixedLine.trim();
  })
  .filter((line) => line !== "")
  .join("\r\n");

fs.writeFileSync(serverBat, batchFixed);

var consoleData = [];
const startServer = async () => {
  console.log(batchFixed);
  // setInterval(async () => {
  //   const dataString = await readLastLines.read(
  //     path.resolve("console.log"),
  //     100
  //   );
  //   consoleData = dataString.split(/[\r\n]+/);
  // }, 5000);
  return new Promise((resolve, reject) => {
    var child = spawn(serverBat, {
      shell: false,
      detached: false,
      //stdio: ["ignore", 1, 2],
    });
    child.unref();
    child.stderr.on("data", function (data) {
      console.error("STDERR:", data.toString());
      resolve("not running");
    });
    child.stdout.on("data", function (data) {
      consoleData.push(data.toString().trim());
      if (consoleData.length > 200) consoleData.shift();
      console.log(data.toString().trim());
      if (data.toString().includes("minecraft:overworld finished.")) {
        resolve("ready");
      }
    });
    child.on("close", function (exitCode) {
      resolve("not running");
      console.log("server running: ");
    });
  });
};
const getConsoleData = () => {
  return consoleData;
};

module.exports = {
  startServer,
  getConsoleData,
};
