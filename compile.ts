import fs from "fs";
import path from "path";
import process from "process";
import { exec } from "child_process";

const packages = fs
  .readdirSync("./packages")
  .filter((f) => {
    const stat = fs.statSync(path.join("./packages", f));
    return stat.isDirectory();
  })
  .map((f) => path.join("./packages", f));

for (let childPackage of packages) {
  process.chdir(childPackage);
  exec("bun tsc", (err, stdout, stderr) => {
    if (err) {
      console.log("failed:", childPackage);
    }
  });
  process.chdir("../..");
}
