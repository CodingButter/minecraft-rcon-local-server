const localtunnel = require("localtunnel");
const getSubdomain = require("./getsubdomain");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { authenticate } = require("./propertiesapi");
var status = "not running";
var tunnel;
const { startServer, getConsoleData } = require("./startserver");
const init = async () => {
  const port = process.argv[2] || 3501;
  const subdomain = await getSubdomain();
  console.log(subdomain);
  tunnel = await localtunnel({ port, subdomain });
  tunnel.on("close", (resp) => {
    console.log("tunnel closed");
  });
  console.log(tunnel.url);
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(authenticate);
  app.post("/start", (req, res) => {
    if (status != "starting" && status != "ready") {
      status = "starting";
      startServer().then(() => {
        status = "ready";
      });
      res.json({ status: "starting" });
    } else {
      res.json({ status: "starting" });
    }
  });
  app.post("/status", (req, res) => {
    res.json({ status });
  });
  app.post("/console", (req, res) => {
    res.json({ data: getConsoleData() });
  });

  app.listen(port, () => {
    console.log("connect through tunnel");
  });
};

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
  tunnel.close();
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
