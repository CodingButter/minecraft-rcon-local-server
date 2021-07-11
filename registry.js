const fs = require("fs");
const { exec } = require("child_process");
const regedit = require("regedit");
regedit.setExternalVBSLocation("resources/regedit/vbs");
const path = require("path");

const addRegistery = () => {
  const EXE_PATH = path.resolve("rconplugin.exe");
  if (!fs.existsSync("removeRconFromStartup.bat")) {
    fs.writeFileSync(
      "removeRconFromStartup.bat",
      `@echo off && reg delete HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Run /v "Minecraft Rcon" /f && pause`
    );
    console.error("If this is Your First Time Restart App as Admin");
    process.exit();
  }
  regedit.list(
    "HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Run",
    (error, results) => {
      console.log(JSON.stringify(results));
      if (
        !results[
          "HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Run"
        ].values["Minecraft Rcon"]
      ) {
        regedit.putValue(
          {
            "HKLM\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Run":
              {
                "Minecraft Rcon": {
                  value: EXE_PATH,
                  type: "REG_SZ",
                },
              },
          },
          console.log
        );
      }
    }
  );
};
module.exports = addRegistery;
