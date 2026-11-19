# gta6-trophy-guide-01-v2

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/dankurniaone/gta6-trophy-guide-01-v2/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/dankurniaone/gta6-trophy-guide-01-v2/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Legend** — the complete GTA VI trophy guide and tracker for PlayStation 5: all 55 official trophies (1 Platinum, 2 Gold, 6 Silver, 46 Bronze) with a guide in the author's own words for each, a 6-stage roadmap to the Platinum, the one trophy that can actually be missed, and a checklist that saves your progress in your browser. Works fully offline — no network requests, no account, no tracking.

## Run it

```sh
python3 -m http.server --directory app 8080
```

Then open <http://localhost:8080>. Or open `app/index.html` directly in a browser.

## What it does

- **Every trophy, guided.** Each of the 55 trophies carries PlayStation's official name, description and grade, plus a guide written for this entry that names its sources beside it (Exophase, PSNProfiles, PowerPyx, GTABase, Output Lag, GTA Zone and more). Where no unlock method has been publicly confirmed yet, the guide says so honestly instead of inventing one.
- **Roadmap to the Platinum.** Six stages in play order: story first, then strangers, activities, collectibles, heists and free-roam, and finally 100% Completion cleanup. PowerPyx rates the Platinum 4/10 at about 200 hours — long, not hard.
- **The one missable trophy, flagged.** Positive Mental Attitude (meditate at 18 spots) is the only trophy that can be missed — Lucia's balcony meditation in Chapter 1 disappears after that chapter, and the game has no mission replay. The guide warns you before you start and tells you how to protect yourself (a manual save at the start of every chapter).
- **Tracker.** Tick trophies off as you earn them; progress is saved in localStorage and survives a reload. Filter by kind (Story / Missable / Collectibles / Activities / Platinum), grade, status, or search by name, mission or activity. Sort by roadmap order, name A–Z, or grade (Platinum first). Each roadmap stage shows how many of its trophies you have earned, so you always know which stage to work on next. Export your progress to a file and import it back.
- **Spoiler-free mode.** Hides story trophy names, descriptions and guides until you have earned them.

## Files

- `app/index.html`, `app/app.js`, `app/style.css` — the guide and tracker (plain static files, no build step, no external resources).
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, guide, kind, roadmap stage, missable flag, and sources.
- `screenshots/` — four real renders of the app in a browser (cover, roadmap, the missable trophy, spoiler mode).
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json` for the grader.

## Sources

Trophy list (names, descriptions, grades): Exophase and PSNProfiles, frozen 2026-11-18. Method sources are linked beside each trophy. No Rockstar Games logo, artwork or game screenshot is used anywhere.

---

<sub>Entered on [make.fun](https://make.fun/?ref=adyjn11j&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
