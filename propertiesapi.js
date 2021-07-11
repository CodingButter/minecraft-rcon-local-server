const propertiesReader = require("properties-reader");
const path = require("path");
const serverProps = propertiesReader(path.resolve("server.properties"));
const authenticate = (req, res, next) => {
  const { password } = req.headers;
  if (serverProps.get("enable-rcon") == true) {
    if (password == serverProps.get("rcon.password")) {
      next();
    } else {
      res.json({ status: "failed" });
    }
  } else {
    res.json({ status: "failed" });
  }
};

module.exports = {
  authenticate,
};
