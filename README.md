# 🎓 UniTrack - Academic Week Calendar & Exam Countdowns

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Android APK](https://img.shields.io/badge/Android-WebAPK%20%7C%20APK-3ddc84?logo=android&logoColor=white)](https://developer.android.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20MVVM-indigo)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)

> A modern, responsive academic scheduling system and exam countdown tracker designed for university students. Computes odd/even week numbers, tracks vacation periods, features drag-and-drop timetable reordering, real-time search text highlighting, visual progress bar countdowns, sticky note postcards, ambient university themes, and seamless installation on Android phones via direct GitHub APK download or 1-click WebAPK.

---

## 📱 Android Compatibility & Download on Phone via GitHub

UniTrack is engineered for mobile students with full offline capability and native-like standalone windowing on Android.

### Option 1: Download `.apk` Directly from GitHub Releases
1. On your Android phone, open the repository's **Releases** page:
   ```
   https://github.com/<your-username>/unitrack/releases
   ```
2. Under the latest release tag (e.g. `v2.1.0`), tap **`UniTrack-Release.apk`** to download it.
3. Open your phone's **Downloads** or tap the completed download notification.
4. If prompted with *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source** to ON.
5. Tap **Install** and open UniTrack directly from your app drawer!

### Option 2: 1-Click Android WebAPK (PWA) Install
1. Open UniTrack in **Google Chrome** or **Samsung Internet** on your Android phone.
2. Tap the in-app **"Android & Mobile"** button in the top navigation bar, or open Chrome's menu (`⋮`) in the top-right corner.
3. Select **"Add to Home screen"** or **"Install app"**.
4. UniTrack installs as a standalone WebAPK with its own launcher icon, full-screen viewport without browser URL bars, and 100% offline service worker caching!

### Option 3: Scan QR Code with Phone Camera
Open UniTrack on your laptop or desktop, click **"Android & Mobile"**, select the **"Scan QR on Phone"** tab, and point your Android camera or Google Lens to immediately open the app on your mobile device.

### 🤖 Automated GitHub Actions APK Build
This repository includes `.github/workflows/build-android-apk.yml`, which automatically packages the Progressive Web App into a signed Android APK using Bubblewrap CLI whenever you tag a new release or push to `main`.

---

## ✨ Key Features

### 📅 1. Odd/Even Week Parity & Vacation Engine
- Calculates the current academic week number ($1 \dots 14+$) based on semester start date.
- Accurately tracks alternating **Odd / Even** rotation for university lectures and laboratories.
- Midterm reading weeks and vacation periods automatically pause or continue academic week numbering based on settings.

### 📊 2. Visual Semester Progress Bar in TimetableHeader
- Real-time progress bar displaying semester elapsed percentage (e.g. `12.6% Complete`).
- Tracks total semester days, elapsed days, and days remaining (e.g. `Day 15 of 119 days • 104 days remaining`).
- Displays vacation breaks directly along the visual progress track with palm tree markers.
- Formatted milestone dates: **Term Start**, **Current Academic Week**, and **Term End**.

### 🔄 3. Drag-and-Drop Schedule Reordering
- Easily reorder classes by dragging class cards across different day columns in the timetable grid.
- Includes a mobile-friendly 1-click day switcher menu for quick reordering on touchscreens.

### 🔍 4. Real-Time Search & Text Highlighting
- Filter classes by course code, title, professor, room, or notes.
- Matched text is visually illuminated using `<HighlightedText>` in rich gold marks.
- Matching class cards receive an illuminated amber highlight ring and a `✨ Match` badge.
- Non-matching classes are subtly dimmed so relevant classes pop out at a single glance.

### ⏳ 5. Exam Countdowns with Visual Progress Bars
- Real-time countdowns for exams, project deadlines, presentations, and assignments.
- Dynamic color-coded urgency indicators: **Critical (< 24h)**, **Upcoming (< 3d)**, and **On Track**.
- Visual progress bar measuring elapsed time vs. remaining time down to the second.

### 📌 6. Campus Postcards & Sticky Notes Board
- General notes tab featuring a virtual corkboard with colorful pastel postcards.
- Pin notes to the top of your board, organize with tags (`#Advising`, `#Exams`, `#Study Group`, `#Library`), and track multi-item checklists.

### 🎨 7. University Ambient Ambiance & Global Themes
- Choose between 7 university color presets in Settings:
  - 🎓 **Academic Indigo** (Default)
  - 🔷 **Sapphire Blue**
  - 🌿 **Cambridge Emerald**
  - 👑 **Imperial Purple**
  - 🌹 **Harvard Rose**
  - 🍯 **Warm Amber**
  - ⚡ **Cyber Cyan**
- Choosing an accent dynamically transforms the entire app's atmosphere: background ambient luminous glow, navbar, logo gradient, badges, buttons, borders, and Android status bar.

### 🔔 8. Web Audio Chimes & Class Reminder Alerts
- Configurable sound chime and browser notification alerts 5, 10, 15, or 30 minutes before classes begin.
- Built-in sound test button directly inside the responsive notification dropdown.

---

## 🏛️ Clean Architecture & MVVM Pattern

The codebase is strictly separated into independent, testable layers:

```
├── .github/
│   └── workflows/
│       └── build-android-apk.yml    # CI/CD to package & release Android APK
├── desktop/
│   ├── python_pyqt/                 # Standalone PyQt6 desktop application
│   └── cpp_qt/                      # Standalone Qt6/C++ desktop application
├── public/
│   ├── icon.svg                     # Vector app icon
│   ├── pwa-192x192.png              # Android launcher icon (192x192)
│   └── pwa-512x512.png              # Android splash icon (512x512)
├── src/
│   ├── data/
│   │   └── initialData.ts           # Realistic seed schedule & countdowns
│   ├── domain/                      # PURE DOMAIN LAYER (Zero React dependencies)
│   │   ├── types.ts                 # Clean TypeScript schemas & interfaces
│   │   ├── calendarLogic.ts         # Parity, vacation pause & timeline logic
│   │   ├── calendarLogic.test.ts    # Unit tests (node:test & node:assert)
│   │   └── countdownLogic.ts        # Progress bar math & urgency metrics
│   ├── viewmodels/                  # VIEWMODEL LAYER (State & business orchestration)
│   │   ├── useCalendarViewModel.ts  # Timetable state, filters & JSON serialization
│   │   ├── useCountdownsViewModel.ts# Live countdown ticker & metrics
│   │   ├── useNotificationsViewModel.ts# Web Audio synthesis & toast queue
│   │   └── usePWAInstall.ts         # Android WebAPK & PWA install prompts
│   ├── components/                  # VIEW LAYER (UI components)
│   │   ├── Navbar.tsx               # Flex-wrap responsive top navigation
│   │   ├── UniTrackLogo.tsx         # Upper-left brand mark with theme glow
│   │   ├── TimetableHeader.tsx      # Semester progress bar & week navigation
│   │   ├── TimetableGrid.tsx        # Drag-and-drop grid with search highlighting
│   │   ├── HighlightedText.tsx      # Text query highlighting component
│   │   ├── CountdownsView.tsx       # Deadlines with animated progress bars
│   │   ├── PostcardsView.tsx        # Sticky notes corkboard with checklists
│   │   ├── WidgetView.tsx           # Interactive phone widget simulator
│   │   ├── SettingsTab.tsx          # Theme switcher, semester dates & Android hub
│   │   └── AndroidDownloadModal.tsx # GitHub APK guide & phone QR code
│   ├── App.tsx                      # Root application entry
│   └── index.css                    # Ambient lighting CSS variables & Tailwind
├── index.html                       # HTML entry point with mobile viewport tags
├── vite.config.ts                   # Vite + VitePWA service worker config
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (v20+ recommended)
- `npm` or `bun`

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/unitrack.git

# Navigate into the project directory
cd unitrack

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Unit Tests
```bash
# Run domain logic tests using Node's native test runner
npm test
# or
node --test src/domain/calendarLogic.test.ts
```

### Production Build
```bash
npm run build
```
The compiled, production-ready static assets and service workers will be output to the `dist/` directory.

### 🔧 Troubleshooting GitHub Actions: "Dependencies lock file is not found"

If your GitHub Actions runner reports:
`Error: Dependencies lock file is not found in /home/runner/work/UniTrack/UniTrack. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock`

This happens when `package-lock.json` was omitted during `git push` or when `actions/setup-node` is configured with `cache: 'npm'` in a custom workflow on GitHub.

**Quick Fix:**
1. Ensure `package-lock.json` is committed to git:
   ```bash
   git add package-lock.json
   git commit -m "chore: add package-lock.json for GitHub Actions CI"
   git push
   ```
2. In your workflow files (`.github/workflows/*.yml`), ensure `actions/setup-node` does not specify `cache: 'npm'` without the lockfile, or use the pre-configured `.github/workflows/ci.yml` and `.github/workflows/build-android-apk.yml` included in this repository which automatically handle dependencies via:
   ```bash
   if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi
   ```

---

## 💾 JSON Data Backup & Export Schema

UniTrack stores all data locally in the browser (`LocalStorage` / `IndexedDB`) and supports zero-dependency JSON export and import:

```json
{
  "version": "2.1.0",
  "appName": "UniTrack",
  "lastUpdated": "2026-10-19T09:30:00.000Z",
  "semester": {
    "name": "Autumn Semester 2026/2027",
    "startDate": "2026-10-05",
    "totalWeeks": 14,
    "initialWeekParity": "odd",
    "vacations": [
      {
        "id": "vac-1",
        "name": "Autumn Midterm Reading Week",
        "startDate": "2026-11-02",
        "endDate": "2026-11-08",
        "pauseWeekNumbering": true
      }
    ]
  },
  "classes": [...],
  "countdowns": [...],
  "postcards": [...],
  "settings": {
    "enabled": true,
    "classAlertMinutes": 15,
    "soundEnabled": true
  },
  "theme": {
    "accent": "indigo",
    "density": "comfortable"
  }
}
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
