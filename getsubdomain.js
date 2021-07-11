const { ipToLetters } = require("./ipletters");
const publicIp = require("public-ip");

const getSubDomain = async () => {
  const ip = await publicIp.v4();
  console.log({ ip });
  return ipToLetters(ip);
};

module.exports = getSubDomain;
