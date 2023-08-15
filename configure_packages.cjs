const path = require("node:path");
const fs = require("node:fs");

fs.readdirSync(path.join(__dirname, "packages"))
  .map((file) => path.join(__dirname, "packages", file, "package.json"))
  .filter((filename) => fs.existsSync(filename))
  .forEach((packageJSONFILE) => {
    console.log("Configuring package.json", packageJSONFILE);
    let packageJSON = require(packageJSONFILE);
    if (packageJSON["scripts"]) {
      delete packageJSON["scripts"]["patch"];
      delete packageJSON["scripts"]["minor"];
      delete packageJSON["scripts"]["major"];
    }

    packageJSON = {
      ...packageJSON,
      version: packageJSON.version ? packageJSON.version : "0.0.1",
      files: packageJSON.files ? packageJSON.files : ["lib/**"],
    };

    fs.writeFileSync(packageJSONFILE, JSON.stringify(packageJSON, null, 2));
  });
