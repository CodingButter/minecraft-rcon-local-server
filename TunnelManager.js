const localtunnel = require("localtunnel");
const getSubdomain = require("./getsubdomain");
const { getPluginPort } = require("./propertiesapi");

const createTunnel = async (prefix, ipLetters, port) => {
  const subdomain = `${prefix}${ipLetters}`;
  console.log(`Establishing ${prefix} tunnel`);
  const tunnel = await localtunnel({
    port,
    subdomain,
  });
  console.log(`start ${prefix} tunnel at ${tunnel.url}`);
  tunnel.on("close", (resp) => {
    console.log(`${prefix} tunnel closed`);
  });
  tunnel.on("error", async (error) => {
    await createTunnel(prefix, ipLetters, port);
  });
  return tunnel;
};

const createTunnels = async () => {
  const ipLetters = await getSubdomain();

  const pluginTunnel = await createTunnel("plugin", ipLetters, getPluginPort());
  return {
    close: () => {
      pluginTunnel.close();
    },
  };
};

module.exports = createTunnels;
