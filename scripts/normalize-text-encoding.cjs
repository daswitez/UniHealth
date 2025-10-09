const { readdirSync, readFileSync, statSync, writeFileSync } = require("node:fs");
const { join, extname, basename } = require("node:path");

const ROOT = process.cwd();
const ALLOWED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".html",
  ".css",
  ".md",
  ".txt"
]);

const MARKERS = ["Ã", "Â", "ð", "â", "�"];
const SKIP_DIRECTORIES = new Set(["node_modules", "dist", "build", ".git"]);

const CP1252_REVERSE = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f]
]);

function decodeCp1252String(input) {
  const bytes = [];
  for (const char of input) {
    const codePoint = char.codePointAt(0);

    if (codePoint <= 0xff) {
      bytes.push(codePoint);
      continue;
    }

    const mapped = CP1252_REVERSE.get(codePoint);
    if (mapped === undefined) {
      return null;
    }

    bytes.push(mapped);
  }

  return Buffer.from(bytes).toString("utf8");
}

function shouldProcess(filePath) {
  return ALLOWED_EXTENSIONS.has(extname(filePath).toLowerCase());
}

function needsFix(content) {
  return MARKERS.some((marker) => content.includes(marker));
}

function fixFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  if (!needsFix(raw)) {
    return false;
  }

  const repaired = decodeCp1252String(raw);
  if (!repaired) {
    return false;
  }

  const sanitized = repaired.replace(/^\uFEFF/, "").replace(/^\uFFFD/, "");

  if (sanitized === raw) {
    return false;
  }

  writeFileSync(filePath, sanitized, "utf8");
  return true;
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const entryPath = join(dir, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      if (SKIP_DIRECTORIES.has(basename(entryPath))) {
        continue;
      }
      walk(entryPath);
      continue;
    }

    if (stats.isFile() && shouldProcess(entryPath)) {
      if (fixFile(entryPath)) {
        console.log(`Normalized: ${entryPath.replace(ROOT + "\\", "")}`);
      }
    }
  }
}

walk(ROOT);
