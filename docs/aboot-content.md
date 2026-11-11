# Goth OS — "Aboot" window: content snapshot (10 Nov 2026, before the Phase 1 rewrite)

> The Phase 1 rewrite has since been applied to the components. This file is kept as the hand-off
> reference for Phase 2 (trading system + Hammerpick cards); the live content is in the `.tsx` files.

Everything the Aboot app showed at the time, tab by tab, plus notes on the format each tab expects.
Source files: `src/components/apps/aboot/{About,Education,Skills,Projects,Aboot}.tsx`.

Window title: **Aboot**. Left-hand nav (top to bottom): **Aboot Me · Education · Skills · Projects · Resume**.

---

## 1. Aboot Me (`About.tsx`)

**Avatar:** bitmoji image in a white circle (`public/images/logos/bitmoji.png`).

**Headline (two lines, centred):**

> my name is **Kyle Gothman**,
> and I'm a **Software Engineer!**  ← "Software Engineer!" is pink

**Bullets** (each has an emoji bullet marker):

- 🏫 I'm a Software Engineering student at the University of Texas at Dallas, graduating Dec 2026. I've completed two internships at H-E-B Digital Technology, working on infrastructure automation, cloud storage provisioning, and security compliance tooling. ( Hit me up [kyle.gothman@gmail.com](mailto:kyle.gothman@gmail.com) )
- 👨🏻‍💻 I enjoy building software that solves real-world problems — from full-stack web apps to Kubernetes homelabs and DevOps pipelines.
- 🎲 When I'm not coding, I like to spend my time making music, gaming, or diving into topics like AI and machine learning.
- 🌟 I'm also interested in cloud infrastructure, automation, and open-source tooling!

*Format:* headline + 3–5 short bullets. Each bullet is one or two sentences. Bullet markers available: 🏫 `list-pc`, 👨🏻‍💻 `list-building`, 🎲 `list-time`, 🌟 `list-star`, ⇀ `list-arrow` (new emoji markers are easy to add).

---

## 2. Education (`Education.tsx`)

Section heading: **Education**

- **University of Texas at Dallas** — Richardson, TX
  *B.S. in Software Engineering* — Expected Dec 2026
  **Coursework** (rendered as pill badges): Data Structures & Algorithms · Computer Architecture · Databases · Statistics · Technical Communication · Machine Learning · Artificial Intelligence · Quantum Computing

*Format:* one or more entries, each with institution, location, degree (italic), date line, optional coursework pills.

---

## 3. Skills (`Skills.tsx`)

Section heading: **Technical Skills**

Intro bullets (⇀ markers):

- ⇀ I've worked with a wide variety of programming languages & frameworks.
- ⇀ My areas of expertise are **full-stack development, React.js, Python & cloud infrastructure!**  ← bold part is orange
- ⇀ Here are my most frequently used  ← *(sentence is left dangling — leftover from the original template; the two badge columns below are meant to complete it)*

Two badge columns (shields.io badges):

| Languages | Tools & Frameworks |
| --- | --- |
| Python, SQL, JavaScript, Java, TypeScript, C++ | Node.js, React, Docker, PyTorch, Git, Kubernetes, Ansible, PostgreSQL, MySQL, GCP, AWS |

*Format:* 2–3 intro bullets + two columns of badge names. Any technology with a shields.io/simple-icons logo works as a badge.

---

## 4. Projects (`Projects.tsx`)

Section heading: **Projects**

At the top: an embedded GitHub Sponsors card for `kylegothman`.

Each project card shows: name (displayed lower-case), a live GitHub star-count button for the repo, date, one or more description bullets, and small colour-coded domain tags. Cards link to the repo.

| # | Name | Date | Repo | Description | Tags |
| --- | --- | --- | --- | --- | --- |
| 1 | Goth-OS Portfolio | Apr 2023 | https://github.com/kylegothman/kgoth-os *(note: the live site deploys from `kylegothman/goth-os`)* | Personal portfolio website built using React & tailwind CSS | javascript, react, tailwindcss |
| 2 | Groove Box | Apr 2023 | https://github.com/kylegothman/groove-box | A 16 beat step sequencer built using the ToneJS library | javascript, sass |
| 3 | See-Food | Feb 2023 | https://github.com/kylegothman/see-food | A food recognition app that rewards you when you upload a picture of a hotdog. Backend is built with nodeJS and the frontend is built with React and Chakra-UI | javascript, nodeJS, postgreSQL, ai, chakra-ui |
| 4 | Background Generator | Dec 2022 | https://github.com/kylegothman/background-generator | A visual tool for creating gradient backgrounds | javascript, HTML5, CSS3 |
| 5 | Robinhood Day Trading Bot | Nov 2022 | https://github.com/kylegothman/robinhood-crypto-bot | A day trading crypto bot that uses Robinhood's API | python |

*Format per project:* `name`, `date` ("Mon YYYY"), `link` (GitHub URL — the star button is derived from the last path segment), `description` (array of short bullets, 1–3), `domains` (array of tags). Tags with a defined colour: javascript, postgresql, ai, firebase auth, chakra-ui, flutter, dart, react-native, html5, sass, tensorflow, django, python, codeforces-api, tailwindcss, react. Anything else renders grey (new colours are a one-line addition).

Not yet listed and probably should be: **3D Space Invaders** (https://github.com/kylegothman/3D-Space-Invaders) — being added to the desktop as a playable app.

---

## 5. Resume

Embeds the PDF at `public/files/KyleGothmanResume.pdf` (replaced 10 Nov 2026 with the current resume). No other text.

---

## Notes for the rewrite

- Tone of the existing copy is casual and first-person; the OS theme uses "Aboot" as a deliberate pun on "About".
- Things already flagged as stale/awkward: the dangling "Here are my most frequently used" line in Skills; the Goth-OS project link pointing at `kgoth-os`; the project list stops at Apr 2023 and doesn't mention either H-E-B internship, the homelab/Kubernetes work, or 3D Space Invaders.
- Please return the content in the same structure (headline, bullets, education entries, two skill columns, project table with the fields above) so it can be dropped straight into the components.
