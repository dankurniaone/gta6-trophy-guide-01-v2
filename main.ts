// Leonida Legend — GTA VI trophy guide & tracker (Node 22, standard library only).
//
// The guide itself is app/: plain static files a browser opens at
// app/index.html, with the trophy list and guides in app/data/trophies.json.
// It loads nothing over the network and works with the network off.
//
// This program hands the guide in. It copies app/ and screenshots/ from the
// repository into the output directory and writes dossier.json there — the
// summary the judge reads (screenshots, first-load bytes, and the source
// outline) — using the kit's vendored make.fun library. Leave
// vendor/makefun-frontend.ts exactly as the kit ships it: the scorer rebuilds
// the dossier with its own copy and requires a byte-for-byte match.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Fail fast on bad trophy data instead of handing the grader a broken
// guide: the list must hold exactly 55 trophies, each with a name, grade,
// guide and at least one source. A bad file is a build error, not a
// silent dossier.
const trophiesPath = join(repoRoot, "app", "data", "trophies.json");
const trophiesDoc = JSON.parse(readFileSync(trophiesPath, "utf8"));
const trophies = trophiesDoc.trophies ?? trophiesDoc;
if (!Array.isArray(trophies) || trophies.length !== 55) {
  throw new Error(
    `trophies.json must list exactly 55 trophies, found ${Array.isArray(trophies) ? trophies.length : "not an array"}`,
  );
}
for (const t of trophies) {
  for (const field of ["name", "description", "grade", "guide"]) {
    if (typeof t[field] !== "string" || t[field].trim() === "") {
      throw new Error(`trophy ${t.id ?? "?"} is missing a usable ${field}`);
    }
  }
  if (!Array.isArray(t.sources) || t.sources.length === 0) {
    throw new Error(`trophy ${t.id ?? "?"} (${t.name}) names no sources`);
  }
}
console.log(`Validated ${trophies.length} trophies with guides and sources.`);

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

copyTree(join(repoRoot, "app"), join(outputDir, "app"));

const shotsDir = join(repoRoot, "screenshots");
if (existsSync(shotsDir)) {
  copyTree(shotsDir, join(outputDir, "screenshots"));
} else {
  mkdirSync(join(outputDir, "screenshots"), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the bytes; the rest refuse
// an entry the scorer would refuse (more than 4 screenshots or one over
// 256 KiB; more than 993 files and directories in app/, or 48 MiB of app
// files: app/ counts beside /output's own 1000-entry cap, its screenshots/
// and dossier.json).
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});

writeFileSync(join(outputDir, "dossier.json"), dossier);
const shotCount = existsSync(shotsDir) ? readdirSync(shotsDir).length : 0;
console.log(
  `Wrote dossier.json to ${outputDir} (${trophies.length} trophies, ${shotCount} screenshots)`,
);
