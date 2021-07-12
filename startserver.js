const fs = require("fs");
const path = require("path");
var spawn = require("child_process").spawn;
serverBat = path.resolve(
  process.argv[3] || process.env.serverBat || "Start.bat"
);

const startServer = async (socket) => {
  const batchData = fs.readFileSync(serverBat, "utf8");

  var child = spawn(serverBat, {
    shell: true,
  });
  child.stderr.on("data", function (data) {
    console.error("STDERR:", data.toString());
  });
  child.stdout.on("data", function (data) {
    console.log("STDOUT:", data.toString());
  });
  child.on("close", function (exitCode) {
    console.log("Child exited with code: " + exitCode);
  });
  return true;
};

module.exports = {
  startServer,
};
