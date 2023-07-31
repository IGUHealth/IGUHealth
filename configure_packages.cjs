const path = require("node:path");
const fs = require("node:fs");

fs.readdirSync(path.join(__dirname, "packages"))
  .map((file) => path.join(__dirname, "packages", file, "package.json"))
  .filter((filename) => fs.existsSync(filename))
  .forEach((packageJSONFILE) => {
    console.log("Configuring package.json", packageJSONFILE);
    let packageJSON = require(packageJSONFILE);
    packageJSON = {
      ...packageJSON,
      version: packageJSON.version ? packageJSON.version : "0.0.1",
      scripts: {
        ...packageJSON.scripts,
        patch: "yarn version patch",
        minor: "yarn version minor",
        major: "yarn version major",
        publish: "yarn build && yarn npm publish --access public",
      },
      files: packageJSONFILE.files ? packageJSONFILE.files : ["lib/**"],
    };
    console.log(packageJSON);
    fs.writeFileSync(packageJSONFILE, JSON.stringify(packageJSON, null, 2));
  });
