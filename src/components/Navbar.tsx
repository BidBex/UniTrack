import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Upload,
  Bell,
  BellRing,
  Moon,
  Sun,
  Smartphone,
  Laptop,
  Settings,
  Sparkles,
  Palmtree,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AcademicWeekInfo, NotificationSettings } from '../domain/types.ts';
import { usePWAInstall } from '../viewmodels/usePWAInstall.ts';

interface NavbarProps {
  currentWeekInfo: AcademicWeekInfo;
  activeTab: 'calendar' | 'countdowns' | 'widget' | 'desktop' | 'settings';
  setActiveTab: (tab: 'calendar' | 'countdowns' | 'widget' | 'desktop' | 'settings') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onExportJson: () => void;
  onImportJson: (json: string) => { success: boolean; message: string };
  settings: NotificationSettings;
  onUpdateSettings: (s: NotificationSettings) => void;
  onRequestNotificationPermission: () => Promise<boolean>;
  onTestNotification: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentWeekInfo,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onExportJson,
  onImportJson,
  settings,
  onUpdateSettings,
  onRequestNotificationPermission,
  onTestNotification,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = onImportJson(content);
      setImportStatus(res.message);
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Brand & Academic Week Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                  UniTrack
                </span>
                <span className="hidden sm:inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  MVVM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Academic Calendar & Exam Tracker
              </p>
            </div>
          </div>

          {/* Current Academic Week Pill */}
          <div className="ml-2 flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-800 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            {currentWeekInfo.isVacation ? (
              <>
                <Palmtree className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate max-w-[140px] sm:max-w-none">
                  {currentWeekInfo.currentVacation?.name || 'Vacation Week'}
                </span>
              </>
            ) : (
              <>
                <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Week {currentWeekInfo.weekNumber}</span>
                <span className="text-indigo-400 dark:text-indigo-500">•</span>
                <span className="capitalize">{currentWeekInfo.parity} Week</span>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'calendar'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Timetable
          </button>

          <button
            onClick={() => setActiveTab('countdowns')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'countdowns'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Countdowns & Exams
          </button>

          <button
            onClick={() => setActiveTab('widget')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'widget'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Home Widget
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'desktop'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            Desktop (Qt/Python)
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'settings'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Semester
          </button>
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
              title="Install progressive web app"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Install App</span>
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Install (iOS)</span>
            </button>
          )}

          {/* JSON Export */}
          <button
            onClick={onExportJson}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            title="Export local schedule JSON file"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* JSON Import */}
          <label
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            title="Import local schedule JSON file"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Import</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          {/* Notifications Toggle & Test */}
          <div className="relative group">
            <button
              onClick={onRequestNotificationPermission}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              title="Notification Settings & Class Alerts"
            >
              {settings.enabled ? (
                <BellRing className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Bell className="h-4 w-4 text-slate-400" />
              )}
            </button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
                Class & Exam Alerts
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                Sound chime and push alerts 15 minutes before classes.
              </p>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={onTestNotification}
                  className="rounded-lg bg-indigo-50 px-2.5 py-1 text-left text-xs font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                >
                  🔔 Test Alert Chime
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className="rounded-lg bg-slate-50 px-2.5 py-1 text-left text-xs text-slate-600 hover:bg-slate-100 dark:bg-slate-700/50 dark:text-slate-300"
                >
                  Sound: {settings.soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            title="Toggle Light / Dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tabs Row */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-200 px-3 py-1.5 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="h-3 w-3" />
            Timetable
          </button>
          <button
            onClick={() => setActiveTab('countdowns')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
              activeTab === 'countdowns'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clock className="h-3 w-3" />
            Countdowns
          </button>
          <button
            onClick={() => setActiveTab('widget')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
              activeTab === 'widget'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Smartphone className="h-3 w-3" />
            Widget
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
              activeTab === 'desktop'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Laptop className="h-3 w-3" />
            Desktop (Qt)
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Settings className="h-3 w-3" />
            Semester
          </button>
        </div>
      </div>

      {/* Import Notification Toast */}
      {importStatus && (
        <div className="bg-indigo-600 px-4 py-1.5 text-center text-xs font-medium text-white transition animate-in fade-in">
          {importStatus}
        </div>
      )}

      {/* iOS Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Install UniTrack on iPhone / iPad
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              1. Tap the <strong>Share</strong> button (box with upward arrow) at the bottom of Safari.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
              3. Tap <strong>Add</strong> in the top-right corner.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
