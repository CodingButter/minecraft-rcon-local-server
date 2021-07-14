const propertiesReader = require("properties-reader");
const path = require("path");
const fs = require("fs");
const nbt = require("nbt");
const serverProps = propertiesReader(path.resolve("server.properties"));
const authenticate = (req, res, next) => {
  const { authentication } = req.headers;
  //res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  if (serverProps.get("enable-rcon") == true) {
    if (authentication == serverProps.get("rcon.password")) {
      next();
    } else {
      res.json({ status: "incorrect password" });
    }
  } else {
    res.json({ status: "rcon not enabled" });
  }
};
const getLevelData = async () => {
  const levelName = serverProps.get("level-name");
  return new Promise((resolve, reject) => {
    var data = fs.readFileSync(path.resolve(`${levelName}/level.dat`));
    nbt.parse(data, function (error, data) {
      if (error) {
        reject(error);
      }

      fs.writeFileSync(
        "modelist.json",
        JSON.stringify(data.value.Data.value.SpawnX.value)
      );
      console.log(data.value);
      resolve(data.value);
    });
  });
};
const getSeed = async () => {};

module.exports = {
  authenticate,
  getLevelData,
  getSeed,
};
