const propertiesReader = require("properties-reader");
const path = require("path");
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

module.exports = {
  authenticate,
};
