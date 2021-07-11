const localtunnel = require("localtunnel");
const getSubdomain = require("./getsubdomain");

const express = require("express");
const bodyParser = require("body-parser");
const { authenticate } = require("./propertiesapi");
const { exec } = require("child_process");

const { startServer } = require("./startserver");

const runServer = async () => {
  const port = process.argv[2] || 3500;
  const subdomain = await getSubdomain();
  const tunnel = await localtunnel({ port, subdomain });

  console.log(tunnel.url);
  const app = express();

  app.use(bodyParser.json());
  app.use(authenticate);
  app.post("/start", async (req, res) => {
    const socketTunnel = await startServer();
    res.json({ status: "starting" });
  });
  app.post("/update");
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
};

runServer();
