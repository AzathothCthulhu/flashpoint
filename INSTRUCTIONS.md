# FLASHPOINT — Setup & Deployment Guide

## What is FLASHPOINT?

FLASHPOINT is a browser-based crisis simulation game for professional development workshops.
Participants play as the executive response team (CISO, CFO, Legal, Comms, CEO) of Meridian
Health navigating a 21-day healthcare data breach across three acts.

The application is a single HTML file with bundled CSS and JS. There is no server-side logic,
no database, and no network requests during gameplay. All state lives in the browser tab.

---

## Prerequisites

- **Node.js** 18 or later — https://nodejs.org
- **npm** 9+ (bundled with Node.js)
- A modern Chromium or Firefox browser (Chrome recommended for workshops)
- Minimum display: 1024 × 768 (1280 × 800 recommended for projector use)

---

## Option A — Run locally (single machine / projector)

### 1. Install dependencies

```bash
cd /path/to/Flashpoint
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Vite starts a local server at `http://localhost:5173`.
Open that URL in Chrome. Hot-module reload is active — any file change updates the browser
immediately without losing game state.

### 3. Build a production bundle (recommended for workshops)

```bash
npm run build
```

Output lands in `dist/`. The `dist/` folder is entirely self-contained — copy it anywhere.
To serve it locally from the `dist/` folder:

```bash
npm run preview
```

This serves at `http://localhost:4173`.

---

## Option B — Run on a local area network (multi-device)

This allows participants to follow along on their own laptops, or you to run the facilitator
view on one machine while the game display is on another.

> **Note:** FLASHPOINT is a single-player simulation by design. All five roles run in the
> same browser tab — there is no real-time synchronisation between devices. Use this option
> so participants can view the game state on their own screens, or for remote facilitation.

### 1. Build the production bundle

```bash
npm run build
```

### 2. Serve the `dist/` folder over your local network

Install a static file server if you don't have one:

```bash
npm install -g serve
```

Then serve the build, binding to all network interfaces:

```bash
serve dist --listen 0.0.0.0:8080
```

### 3. Find your machine's local IP address

**Windows:**
```cmd
ipconfig
```
Look for the IPv4 address under your active adapter (e.g. `192.168.1.42`).

**macOS/Linux:**
```bash
ifconfig | grep "inet "
```

### 4. Share the URL with participants

Participants on the same Wi-Fi or wired LAN open:
```
http://192.168.1.42:8080
```
(Replace with your actual IP.)

> **Firewall note:** If participants cannot connect, open port 8080 in Windows Defender
> Firewall → Advanced Settings → Inbound Rules → New Rule → Port 8080.

---

## Option C — Deploy to the cloud (online access)

### C1 — Vercel (simplest, free tier available)

Vercel detects Vite automatically.

1. Push the repo to GitHub (already done — https://github.com/AzathothCthulhu/flashpoint)
2. Go to https://vercel.com → New Project → Import from GitHub
3. Select the `flashpoint` repository
4. Vercel auto-detects Vite. Build command: `npm run build`, output: `dist`
5. Click **Deploy**

Your app is live at `https://flashpoint-[hash].vercel.app` within ~60 seconds.
Every push to `master` redeploys automatically.

**Custom domain:** In Vercel → Settings → Domains, add your domain and follow the DNS
instructions.

---

### C2 — Netlify (also free tier, drag-and-drop option)

**Option 1 — Drag and drop (fastest):**
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder onto the page
4. Live immediately at a `*.netlify.app` URL

**Option 2 — Connected to GitHub (auto-deploy on push):**
1. New site → Import from Git → GitHub → select `flashpoint`
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

---

### C3 — AWS S3 + CloudFront (enterprise/production)

For regulated environments or when you need SLAs, HTTPS, and access control.

#### Step 1: Create an S3 bucket

```bash
aws s3 mb s3://flashpoint-workshop --region ap-southeast-2
aws s3 website s3://flashpoint-workshop \
  --index-document index.html \
  --error-document index.html
```

#### Step 2: Upload the build

```bash
npm run build
aws s3 sync dist/ s3://flashpoint-workshop --delete \
  --cache-control "max-age=31536000,immutable" \
  --exclude "index.html"
aws s3 cp dist/index.html s3://flashpoint-workshop/index.html \
  --cache-control "no-cache"
```

#### Step 3: Create a CloudFront distribution

```bash
aws cloudfront create-distribution \
  --origin-domain-name flashpoint-workshop.s3-website-ap-southeast-2.amazonaws.com \
  --default-root-object index.html
```

The distribution URL (`*.cloudfront.net`) is your public URL within ~10 minutes.

---

### C4 — Docker (self-hosted / internal IT)

```dockerfile
# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

`nginx.conf`:
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
  gzip on;
  gzip_types text/css application/javascript;
}
```

Build and run:
```bash
docker build -t flashpoint .
docker run -p 8080:80 flashpoint
```

Access at `http://localhost:8080` or your server's IP.

---

## Session management

### Auto-save
The game automatically saves to browser `localStorage` after every state change.
On reload, it offers to restore the session. This survives tab refreshes but not
clearing browser data or switching browsers.

### Manual save / load
Use the **Facilitator panel** (⚙ button in the header, or `Shift+F`) to:
- Save current session to localStorage
- Load a previously saved session
- Clear saved data between workshop groups

### Between workshop groups
1. Open the Facilitator panel (`Shift+F`)
2. Click **✕ Clear** to delete the saved session
3. Click **↺ Reset** in the main header
4. Refresh the page (the restore prompt will not appear)

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `1` `2` `3` `4` `5` | Switch role (CISO / CFO / Legal / Comms / CEO) |
| `Space` | Advance day |
| `W` | Open War Room |
| `D` | Open Debrief |
| `Shift+F` | Toggle Facilitator panel |
| `Escape` | Close any open modal |

---

## Facilitator panel (`Shift+F`)

| Control | Description |
|---------|-------------|
| **→ Act 2** | Advance to Day 8 (skips Act 1) |
| **→ Act 3** | Advance to Day 15 |
| **→ Day 21** | Jump to scenario end |
| **Day # Go** | Advance to any specific day |
| **✓ All Ready** | Mark all 5 roles as ready instantly |
| **All A / B / C** | Commit all uncommitted gates as choice A, B, or C |
| **💾 Save** | Save current state to localStorage |
| **⬆ Load** | Restore previously saved state |
| **✕ Clear** | Delete saved state |

---

## Architecture overview (for developers)

```
src/
  engine/          Pure JS — no DOM dependency
    state.js       Singleton state + dispatch()
    eventBus.js    Pub/sub (engine → UI)
    pools.js       29 resource pool definitions + cascade rules
    gates.js       13 decision gates + 173 consequence rows
    fm.js          FM layer: AP budgets, domain actions, workstreams
    events.js      27 scenario events
    warroom.js     10 escalation rules
  components/      DOM components — subscribe to EventBus
    PoolBar.js     Left panel pool bars (GSAP animated)
    GateCard.js    Centre panel decision cards
    ActionPanel.js Role AP ring + action checklist + workstreams
    RoleTabs.js    Role switcher tabs
    EndingTracker.js  Ending probability bars
    LogPanel.js    Right panel — log + events tabs
    EventsTimeline.js Scenario events list
    Debrief.js     Post-scenario debrief modal
    WarRoom.js     War room overlay (live-updating)
    Atmosphere.js  Reactive visual effects (tension glow, toasts, etc.)
    Facilitator.js Facilitator controls panel
  styles/
    tokens.css     CSS custom properties (design tokens)
    reset.css      Base reset
    shell.css      Layout + header + buttons
    components.css Pool bars, gate cards, action panel
    stage2.css     Debrief modal, act banners, consequence reveal
    stage3.css     Multi-role: role context bar, AP badges, gate filter
    stage4.css     War room depth styles
    stage5.css     Atmospheric: tension glow, danger pulsing, toasts
    stage6.css     Facilitator panel, complete screen, print, tooltips
  main.js          Entry point — mounts shell, wires all components
```

The engine and UI are fully decoupled. The engine never touches the DOM.
Components never call `dispatch()` in response to engine events.
All communication flows through `EventBus`.

---

## Running the test suite

```bash
node src/engine/__tests__/simulation.test.js
```

69 tests covering pool bounds, day advance, FM layer, cascade rules, workstream
payoffs, and a full 21-day simulation. No test runner required — plain Node.js.

---

## Browser requirements

| Browser | Support |
|---------|---------|
| Chrome 111+ | ✅ Recommended |
| Edge 111+ | ✅ Supported |
| Firefox 113+ | ✅ Supported |
| Safari 16.2+ | ✅ Supported |
| Mobile browsers | ❌ Not supported (min 1024px width) |
