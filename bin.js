const localtunnel = require("localtunnel");
const getSubdomain = require("./getsubdomain");

const { authenticate } = require("./propertiesapi");
const { exec } = require("child_process");

const { startServer } = require("./startserver");

const port = process.argv[2] || 3500;
const io = require("socket.io")(port);

const init = async () => {
  const subdomain = await getSubdomain();
  const tunnel = await localtunnel({ port, subdomain });
  io.on("connection", (socket) => {
    console.log("clientConnected");
  });
};
