import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

// Measure emitted assets, not source size. Run after a production build.
const directory = new URL("../build/client/assets/", import.meta.url);
const files = readdirSync(directory);
const report = {};
for (const [kind, pattern] of Object.entries({ javascript: /\.js$/, css: /\.css$/, fonts: /\.woff2?$/ })) {
  const assets = files.filter((file) => pattern.test(file));
  report[kind] = assets.reduce((total, file) => {
    const contents = readFileSync(new URL(file, directory));
    return { files: total.files + 1, bytes: total.bytes + contents.length, gzipBytes: total.gzipBytes + gzipSync(contents).length };
  }, { files: 0, bytes: 0, gzipBytes: 0 });
}
console.log(JSON.stringify(report, null, 2));
