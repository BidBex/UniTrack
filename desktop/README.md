# UniTrack - University Academic Week Calendar & Exam Countdowns

A modern, cross-platform academic scheduling system designed for university students. UniTrack computes current academic week numbers, handles odd/even week alternations for lectures, labs, and seminaries, manages vacation pauses, visualizes deadline progress bars, delivers class start notifications, and supports local JSON export/import.

Implemented across both **Modern Web / PWA (TypeScript, React, Tailwind)** and **Native Desktop (Python PyQt6 & C++ Qt6)** using clean **MVVM (Model-View-ViewModel)** architectural patterns.

---

## Architecture Overview (Clean MVVM)

```
 UniTrack Architecture
 ├── Domain Layer (Models)
 │   ├── Types & Schemas (Semester, ClassEvent, Vacation, Countdown)
 │   ├── Pure Academic Week & Odd/Even Parity Logic
 │   └── Progress Bar & Countdown Calculus
 ├── ViewModel Layer (State & Logic Decoupled)
 │   ├── CalendarViewModel (Week state, Parity filtering, JSON Serialization)
 │   ├── CountdownsViewModel (Real-time ticker, Urgency metrics)
 │   └── NotificationsViewModel (Web Audio synthesizer, Browser push alerts)
 └── UI Layer (Presentation)
     ├── Web / PWA (React 19, Tailwind CSS v4, Lucide Icons)
     ├── Python Desktop UI (PyQt6 QMainWindow, QProgressBar, QTableWidget)
     └── C++ Desktop UI (Qt6 Widgets, CMake, QJsonDocument)
```

Both the Web App and Native Desktop applications share the identical JSON schema (`unitrack_schedule.json`), allowing you to edit your schedule on your phone/browser and immediately open it on your desktop!

---

## Adding to Your Public GitHub Repository

Follow these standard commands in your terminal to initialize and push this project to your GitHub repository:

```bash
# 1. Initialize git if not already initialized
git init

# 2. Stage all files (Web app, PWA, C++ Qt, and Python PyQt desktop companions)
git add .

# 3. Commit the clean architecture implementation
git commit -m "feat: complete UniTrack academic calendar with MVVM, odd/even weeks, countdowns, and Qt desktop"

# 4. Set your main branch
git branch -M main

# 5. Add your GitHub repository as the remote origin
# (Replace USERNAME and REPO_NAME with your GitHub username and repository)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 6. Push to your public repository
git push -u origin main
```

---

## Desktop Companion Apps (Qt & Python)

### 1. Python + PyQt6 Desktop App
Located in `desktop/python_pyqt/`:
```bash
# Navigate to directory
cd desktop/python_pyqt

# Install PyQt6
pip install PyQt6

# Run application
python app.py
```

### 2. C++20 + Qt6 Desktop App
Located in `desktop/cpp_qt/`:
```bash
# Navigate to directory
cd desktop/cpp_qt

# Configure with CMake
cmake -B build -S .

# Build
cmake --build build

# Run
./build/unitrack_desktop
```

---

## JSON Format Compatibility

The application exports and imports `unitrack_schedule.json`:
```json
{
  "version": "1.0.0",
  "appName": "UniTrack University Calendar",
  "semester": {
    "name": "Autumn Semester 2026/2027",
    "startDate": "2026-10-05",
    "totalWeeks": 14,
    "initialWeekParity": "odd",
    "vacations": [
      {
        "id": "vac-1",
        "name": "Autumn Midterm Break",
        "startDate": "2026-11-02",
        "endDate": "2026-11-08",
        "pauseWeekNumbering": true
      }
    ]
  },
  "classes": [
    {
      "id": "cls-1",
      "title": "Operating Systems & Concurrency",
      "code": "CS204",
      "type": "lecture",
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "10:30",
      "room": "Amphitheater 2",
      "recurrence": "all",
      "color": "#4f46e5"
    }
  ],
  "countdowns": [
    {
      "id": "cd-1",
      "title": "Data Structures Midterm Exam",
      "category": "exam",
      "courseCode": "CS201",
      "dueDate": "2026-10-25T10:00:00",
      "weightPercent": 35,
      "completed": false
    }
  ]
}
```
