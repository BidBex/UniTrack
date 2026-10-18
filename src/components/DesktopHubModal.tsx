import React, { useState } from 'react';
import {
  Laptop,
  Code2,
  GitBranch,
  Download,
  Copy,
  Check,
  Terminal,
  FileCode,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DesktopHubModalProps {
  onExportJson: () => void;
}

export const DesktopHubModal: React.FC<DesktopHubModalProps> = ({ onExportJson }) => {
  const [activeSubTab, setActiveSubTab] = useState<'python' | 'cpp' | 'git' | 'arch'>('python');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const gitCommands = `# 1. Initialize Git repository
git init

# 2. Stage all files (Web/PWA, C++ Qt, and Python PyQt desktop projects)
git add .

# 3. Commit the initial release with clean MVVM architecture
git commit -m "feat: initial UniTrack academic week calendar with MVVM, odd/even weeks, countdowns, and Qt desktop"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/unitrack.git

# 6. Push to GitHub
git push -u origin main`;

  const pythonInstructions = `# 1. Open terminal and navigate to the Python desktop project
cd desktop/python_pyqt

# 2. Install PyQt6
pip install PyQt6

# 3. Launch the Qt desktop application
python app.py

# 4. In the PyQt window, click 'Open JSON' and select your exported schedule!`;

  const cppInstructions = `# 1. Open terminal and navigate to the C++ Qt6 project
cd desktop/cpp_qt

# 2. Configure with CMake
cmake -B build -S .

# 3. Build executable
cmake --build build

# 4. Run native desktop app
./build/unitrack_desktop`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-200 border border-indigo-400/30">
                Cross-Platform Ecosystem
              </span>
              <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                MVVM Clean Architecture
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              UniTrack Desktop & GitHub Repository Suite
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
              Full desktop companions built with <strong>Python PyQt6</strong> and <strong>C++20 Qt6</strong>. Both desktop apps load and save the identical JSON schedule files exported from this web app!
            </p>
          </div>

          <button
            onClick={onExportJson}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-indigo-900 shadow-lg hover:bg-indigo-50 transition self-start sm:self-center shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Export schedule.json</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('python')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'python'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Code2 className="h-4 w-4" />
          Python (PyQt6)
        </button>

        <button
          onClick={() => setActiveSubTab('cpp')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'cpp'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="h-4 w-4" />
          C++ (Qt6)
        </button>

        <button
          onClick={() => setActiveSubTab('git')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'git'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <GitBranch className="h-4 w-4" />
          GitHub Repository Setup
        </button>

        <button
          onClick={() => setActiveSubTab('arch')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'arch'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          MVVM Architecture
        </button>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'python' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Python 3 + PyQt6 Desktop Application
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Located in <code className="font-mono text-indigo-600 dark:text-indigo-400">desktop/python_pyqt/</code>
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(pythonInstructions, 'py-install')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {copiedSection === 'py-install' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy Commands</span>
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre>{pythonInstructions}</pre>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">models.py</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Dataclasses matching UniTrack JSON schema with export/import.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">viewmodel.py</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Pure academic week calculator, odd/even parity & countdown calculus.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">app.py</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Qt6 GUI with QProgressBar countdowns and weekly timetable table.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'cpp' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  C++20 + Qt6 Native Desktop Application
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Located in <code className="font-mono text-indigo-600 dark:text-indigo-400">desktop/cpp_qt/</code>
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(cppInstructions, 'cpp-install')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {copiedSection === 'cpp-install' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy Commands</span>
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-xs text-cyan-400 overflow-x-auto">
              <pre>{cppInstructions}</pre>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">CMakeLists.txt</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Cross-platform build configuration targeting Qt6 Core, Gui & Widgets.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">CalendarViewModel.hpp</span>
                <p className="text-slate-500 dark:text-slate-400">
                  C++ ViewModel with QJsonDocument serialization & week parity.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">main.cpp</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Native Qt6 MainWindow with week badge and JSON load/save dialogs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'git' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Publish to Your GitHub Repository
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Follow these terminal instructions to commit and push this full repository.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git-cmds')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {copiedSection === 'git-cmds' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy Git Commands</span>
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-xs text-amber-400 overflow-x-auto">
              <pre>{gitCommands}</pre>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'arch' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Model-View-ViewModel (MVVM) Clean Architecture
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            The project strictly isolates pure calculation and business logic from presentation:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                1. Domain / Models Layer
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Pure TypeScript modules (<code className="font-mono">src/domain/</code>) and Python/C++ dataclasses. Zero UI code. Unit-tested with Node test runner.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                2. ViewModel Layer
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Hooks (<code className="font-mono">useCalendarViewModel</code>, <code className="font-mono">useCountdownsViewModel</code>) and Qt ViewModel classes. Manages filter states, countdown tickers, and persistence.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                3. Presentation / Views
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                React components with Tailwind CSS v4, and Qt Widgets (QProgressBar, QTableWidget). Subscribes to ViewModel state and triggers actions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
