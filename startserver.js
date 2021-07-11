const fs = require("fs");
const path = require("path");
var spawn = require("child_process").spawn;
serverBat = path.resolve(
  process.argv[3] || process.env.serverBat || "Start.bat"
);

const startServer = async () => {
  const batchData = fs.readFileSync(serverBat, "utf8");
  const commands = batchData
    .split(/\r\n|\n\r|\n|\r/)
    .filter((line) => line.trim("\t").trim() != "")
    .join(" && ");

  console.log({ commands });
  var child = spawn(batchData, {
    shell: true,
  });
  child.stderr.on("data", function (data) {
    console.error("STDERR:", data.toString());
  });
  child.stdout.on("data", function (data) {
    console.log("STDOUT:", data.toString());
  });
  child.on("exit", function (exitCode) {
    console.log("Child exited with code: " + exitCode);
  });
  return true;
};

module.exports = {
  startServer,
};
