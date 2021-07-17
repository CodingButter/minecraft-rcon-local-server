const createTunnels = require("./TunnelManager");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");

const bodyParser = require("body-parser");
const {
  getPluginPort,
  authenticate,
  getLevelData,
  getPlayerData,
} = require("./propertiesapi");
var status = "not running";
var tunnels;
const { startServer, getConsoleData, getStatus } = require("./startserver");
const init = async () => {
  const app = express();
  tunnels = await createTunnels();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(authenticate);
  app.post("/start", (req, res) => {
    if (status != "starting" && status != "ready") {
      status = "starting";
      startServer()
        .then(() => {
          status = "ready";
        })
        .catch((err) => {
          status = "crashed";
          console.log(err);
        });
      res.json({ status: "starting" });
    } else {
      res.json({ status: "starting" });
    }
  });
  app.post("/status", (req, res) => {
    res.json({ status: getStatus() });
  });
  app.post("/console", (req, res) => {
    res.json({ data: getConsoleData() });
  });
  app.post("/playerdata/:uuid", async (req, res) => {
    const data = await getPlayerData(req.params.uuid);
    res.json(data);
  });
  app.listen(getPluginPort(), () => {
    console.log("connect through rcon tunnel");
  });
};

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
  tunnels && tunnels.close();
  if (options.cleanup) console.log("clean");
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));

init();
