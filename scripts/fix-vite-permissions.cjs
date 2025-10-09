const { chmodSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const targets = [
  join(process.cwd(), "node_modules", ".bin", "vite"),
  join(process.cwd(), "node_modules", "vite", "bin", "vite.js"),
];

for (const target of targets) {
  if (!existsSync(target)) {
    continue;
  }

  try {
    chmodSync(target, 0o755);
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      console.warn(
        `[fix-vite-permissions] Unable to update permissions for ${target}: ${error.message}`
      );
    }
  }
}
