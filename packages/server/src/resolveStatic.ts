import { createRequire } from "module";
import fs from "node:fs";

export default function resolveStatic(src: string): string {
  const require = createRequire(import.meta.url);
  const content = fs.readFileSync(require.resolve(src)).toString();

  return content;
}
