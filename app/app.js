// Leonida Legend — GTA VI trophy guide & tracker.
// Plain static app: loads data/trophies.json, keeps your ticks in localStorage,
// never talks to the network. All rendering is built with DOM calls so no
// trophy text is ever injected as HTML.

const STORE_KEY = "leonida-legend-earned-v1";
const SPOILER_KEY = "leonida-legend-spoiler-v1";

const listEl = document.getElementById("trophyList");
const emptyEl = document.getElementById("emptyState");
const searchEl = document.getElementById("search");
const kindEl = document.getElementById("kindFilter");
const gradeEl = document.getElementById("gradeFilter");
const statusEl = document.getElementById("statusFilter");
const spoilerEl = document.getElementById("spoiler");
const resultEl = document.getElementById("resultCount");
const sortEl = document.getElementById("sortOrder");

const GRADE_RANK = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

const STAGES = [
  { n: 1, title: "Story — Chapters 1–4 and the finale",
    text: "Play the story straight through. All 12 story trophies unlock here. Do Lucia's balcony meditation during Chapter 1 — it is the one missable spot. Keep a manual save at the start of every chapter." },
  { n: 2, title: "Strangers — side mission strands",
    text: "Finish every stranger's strand (Andy, Kenton, Billy, Randy, Tyrone, Bret). Each ends with a final mission and its own trophy; finishing all eight strands earns Strangers & Freaks." },
  { n: 3, title: "Activities — races, ranges, fishing, arcade",
    text: "Races, the shooting range, fishing, the arcade, drone races, stunts, challenges and bowling. Try each activity type once for Master of None, then chase the golds and win counts." },
  { n: 4, title: "Collectibles — cards, WAiNK, vehicles, properties",
    text: "Collectible Card sets, WAiNK spots, vehicle discoveries, garage properties and Scooter Bros registrations. Explore methodically and check the in-game collection views." },
  { n: 5, title: "Heists & free-roam — robberies, combat, exploration",
    text: "Bank vaults, armored trucks, jewelry stores, shop robberies, gang operations, Combat Focus, the Rhino, and exploring all of Leonida. Most unlock in Chapters 3–4 and after." },
  { n: 6, title: "Cleanup — 100% and the Platinum",
    text: "Finish the 35-task 100% Completion checklist (Progress > Stats), which earns A Long Road. When the other 54 are done, Vice Got a Price! — the Platinum — pops on its own." },
];

const KIND_LABEL = {
  story: "Story", activities: "Activities", collectibles: "Collectibles",
  platinum: "Platinum",
};

let trophies = [];
let earned = new Set(readJSON(STORE_KEY, []));
let spoiler = localStorage.getItem(SPOILER_KEY) === "1";

function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function saveEarned() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned]));
}

function saveSpoiler() {
  localStorage.setItem(SPOILER_KEY, spoiler ? "1" : "0");
}

function gradeBadge(grade) {
  const span = document.createElement("span");
  span.className = "grade grade-" + grade;
  span.textContent = grade;
  return span;
}

function tag(text, cls) {
  const span = document.createElement("span");
  span.className = "tag " + (cls || "");
  span.textContent = text;
  return span;
}

function renderRoadmap() {
  const ol = document.getElementById("roadmapList");
  ol.replaceChildren();
  for (const s of STAGES) {
    const stageTrophies = trophies.filter((t) => t.stage === s.n);
    const done = stageTrophies.filter((t) => earned.has(t.name)).length;
    const li = document.createElement("li");
    const h = document.createElement("h3");
    h.textContent = "Stage " + s.n + " · " + s.title + " (" + stageTrophies.length + ")";
    const doneLine = document.createElement("p");
    doneLine.className = "stage-progress";
    doneLine.textContent =
      done === stageTrophies.length && stageTrophies.length > 0
        ? "Stage complete — all " + stageTrophies.length + " earned."
        : done + " of " + stageTrophies.length + " earned in this stage.";
    const p = document.createElement("p");
    p.textContent = s.text;
    li.append(h, doneLine, p);
    ol.append(li);
  }
}

function storyHidden(t) {
  return spoiler && t.kind === "story" && !earned.has(t.name);
}

function matchesFilters(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = (t.name + " " + t.description + " " + t.guide).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (kindEl.value === "missable") {
    if (!t.missable) return false;
  } else if (kindEl.value !== "all" && t.kind !== kindEl.value) {
    return false;
  }
  if (gradeEl.value !== "all" && t.grade !== gradeEl.value) return false;
  if (statusEl.value === "earned" && !earned.has(t.name)) return false;
  if (statusEl.value === "todo" && earned.has(t.name)) return false;
  return true;
}

function sortTrophies(list) {
  const mode = sortEl ? sortEl.value : "stage";
  const copy = [...list];
  if (mode === "name") {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (mode === "grade") {
    copy.sort(
      (a, b) =>
        GRADE_RANK[a.grade] - GRADE_RANK[b.grade] ||
        a.name.localeCompare(b.name),
    );
  } else {
    copy.sort((a, b) => a.stage - b.stage || a.id - b.id);
  }
  return copy;
}

function renderList() {
  listEl.replaceChildren();
  const shown = sortTrophies(trophies.filter(matchesFilters));
  for (const t of shown) {
    const li = document.createElement("li");
    li.className = "card" + (earned.has(t.name) ? " earned" : "");
    li.dataset.stage = String(t.stage);

    const head = document.createElement("div");
    head.className = "card-head";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = earned.has(t.name);
    box.setAttribute("aria-label", "Mark " + t.name + " earned");
    box.addEventListener("change", () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveEarned();
      renderAll();
    });

    const titleBox = document.createElement("div");
    titleBox.className = "title-box";
    const name = document.createElement("h3");
    name.textContent = storyHidden(t) ? "Hidden story trophy" : t.name;
    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = storyHidden(t)
      ? "Spoiler-free mode is on — earn this trophy to reveal its name and description."
      : t.description;
    titleBox.append(name, desc);

    const badges = document.createElement("div");
    badges.className = "badges";
    badges.append(gradeBadge(t.grade));
    badges.append(tag(KIND_LABEL[t.kind] || t.kind, "kind"));
    if (t.missable) badges.append(tag("MISSABLE", "missable"));
    badges.append(tag("Stage " + t.stage, "stage"));

    head.append(box, titleBox, badges);
    li.append(head);

    const guide = document.createElement("p");
    guide.className = "guide";
    guide.textContent = storyHidden(t)
      ? "Guide hidden until earned (spoiler-free mode)."
      : t.guide;
    li.append(guide);

    const src = document.createElement("p");
    src.className = "sources";
    const srcLabel = document.createElement("span");
    srcLabel.textContent = "Sources: ";
    src.append(srcLabel);
    t.sources.forEach((s, i) => {
      if (i > 0) src.append(document.createTextNode(" · "));
      if (s.url) {
        const a = document.createElement("a");
        a.href = s.url;
        a.textContent = s.name;
        a.rel = "noopener";
        a.target = "_blank";
        src.append(a);
      } else {
        const span = document.createElement("span");
        span.textContent = s.name;
        src.append(span);
      }
    });
    li.append(src);

    listEl.append(li);
  }
  emptyEl.hidden = shown.length !== 0;
  resultEl.textContent = "Showing " + shown.length + " of " + trophies.length + " trophies.";
}

function renderProgress() {
  const n = earned.size;
  const total = trophies.length || 55;
  const pct = Math.round((n / total) * 100);
  document.getElementById("earnedCount").textContent = String(n);
  document.getElementById("barFill").style.width = pct + "%";
  document.getElementById("progressText").textContent =
    pct + "% to the Platinum" + (n === total ? " — Leonida Legend!" : "");
  const counts = {};
  for (const t of trophies) {
    counts[t.grade] = (counts[t.grade] || 0) + (earned.has(t.name) ? 1 : 0);
  }
  const totals = {};
  for (const t of trophies) totals[t.grade] = (totals[t.grade] || 0) + 1;
  document.getElementById("gradeCounts").textContent =
    ["platinum", "gold", "silver", "bronze"]
      .map((g) => g + " " + (counts[g] || 0) + "/" + (totals[g] || 0))
      .join(" · ");
}

function renderAll() {
  renderRoadmap();
  renderList();
  renderProgress();
}

function download(filename, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

document.getElementById("exportBtn").addEventListener("click", () => {
  download("leonida-legend-progress.json", JSON.stringify([...earned], null, 2));
});

document.getElementById("importFile").addEventListener("change", async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    const names = JSON.parse(await file.text());
    if (!Array.isArray(names)) throw new Error("not an array");
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    saveEarned();
    renderAll();
  } catch {
    alert("That file is not a Leonida Legend progress export.");
  }
  e.target.value = "";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Clear all earned trophies? This cannot be undone.")) return;
  earned = new Set();
  saveEarned();
  renderAll();
});

for (const el of [searchEl, kindEl, gradeEl, statusEl, sortEl]) {
  if (!el) continue;
  el.addEventListener("input", renderList);
  el.addEventListener("change", renderList);
}

spoilerEl.checked = spoiler;
spoilerEl.addEventListener("change", () => {
  spoiler = spoilerEl.checked;
  saveSpoiler();
  renderList();
});

const doc = await (await fetch("data/trophies.json")).json();
trophies = doc.trophies || doc;
renderAll();
