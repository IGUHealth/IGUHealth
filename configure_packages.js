const path = require("node:path");
const fs = require("node:fs");

fs.readdirSync(path.join(__dirname, "packages"))
  .map((file) => path.join(__dirname, "packages", file, "package.json"))
  .filter((filename) => fs.existsSync(filename))
  .forEach((packageJSONFile) => {
    console.log("Configuring package.json", packageJSONFILE);
    let packageJSON = require(packageJSONFILE);
    packageJSON = {
      version: "0.0.4",
      scripts: {
        ...packageJSON.scripts,
        patch: "yarn version patch",
        minor: "yarn version minor",
        major: "yarn version major",
      },
    };
    console.log(packageJSON);
    fs.writeFileSync(packageJSONFILE, JSON.stringify(packageJSON, null, 2));
  });
