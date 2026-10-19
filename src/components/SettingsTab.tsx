import React, { useState } from 'react';
import {
  Palette,
  Bell,
  Calendar,
  Palmtree,
  Download,
  RotateCcw,
  Check,
  Moon,
  Sun,
  Volume2,
  Trash2,
  Clock,
  Sparkles,
  Smartphone,
  Github,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import {
  AccentTheme,
  NotificationSettings,
  SemesterConfig,
  ThemeCustomization,
  VacationPeriod,
} from '../domain/types.ts';

interface SettingsTabProps {
  theme: ThemeCustomization;
  onUpdateTheme: (theme: ThemeCustomization) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  settings: NotificationSettings;
  onUpdateSettings: (s: NotificationSettings) => void;
  onRequestNotificationPermission: () => Promise<boolean>;
  onTestNotification: () => void;
  semester: SemesterConfig;
  onUpdateSemester: (config: SemesterConfig) => void;
  onAddVacation: (vac: Omit<VacationPeriod, 'id'>) => void;
  onDeleteVacation: (id: string) => void;
  onExportJson: () => void;
  onImportJson: (json: string) => { success: boolean; message: string };
  onResetToSampleData: () => void;
  onOpenAndroidModal: () => void;
}

const ACCENT_COLORS: {
  id: AccentTheme;
  name: string;
  preview: string;
  badge: string;
  border: string;
}[] = [
  {
    id: 'indigo',
    name: 'Academic Indigo',
    preview: 'bg-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    border: 'border-indigo-500',
  },
  {
    id: 'blue',
    name: 'Sapphire Blue',
    preview: 'bg-blue-600',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    border: 'border-blue-500',
  },
  {
    id: 'emerald',
    name: 'Cambridge Emerald',
    preview: 'bg-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    border: 'border-emerald-500',
  },
  {
    id: 'purple',
    name: 'Imperial Purple',
    preview: 'bg-purple-600',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    border: 'border-purple-500',
  },
  {
    id: 'rose',
    name: 'Harvard Rose',
    preview: 'bg-rose-600',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    border: 'border-rose-500',
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    preview: 'bg-amber-600',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    border: 'border-amber-500',
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    preview: 'bg-cyan-600',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
    border: 'border-cyan-500',
  },
];

export const SettingsTab: React.FC<SettingsTabProps> = ({
  theme,
  onUpdateTheme,
  isDarkMode,
  setIsDarkMode,
  settings,
  onUpdateSettings,
  onRequestNotificationPermission,
  onTestNotification,
  semester,
  onUpdateSemester,
  onAddVacation,
  onDeleteVacation,
  onExportJson,
  onResetToSampleData,
  onOpenAndroidModal,
}) => {
  // Semester form local state
  const [semName, setSemName] = useState(semester.name);
  const [semStart, setSemStart] = useState(semester.startDate);
  const [semWeeks, setSemWeeks] = useState(semester.totalWeeks || 14);
  const [semParity, setSemParity] = useState<'odd' | 'even'>(
    semester.initialWeekParity || 'odd'
  );
  const [semSaved, setSemSaved] = useState(false);

  // New Vacation local state
  const [vacName, setVacName] = useState('');
  const [vacStart, setVacStart] = useState('');
  const [vacEnd, setVacEnd] = useState('');
  const [vacPause, setVacPause] = useState(true);

  const handleSaveSemester = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSemester({
      ...semester,
      name: semName,
      startDate: semStart,
      totalWeeks: Number(semWeeks),
      initialWeekParity: semParity,
    });
    setSemSaved(true);
    setTimeout(() => setSemSaved(false), 2500);
  };

  const handleAddVac = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacName || !vacStart || !vacEnd) return;
    onAddVacation({
      name: vacName,
      startDate: vacStart,
      endDate: vacEnd,
      pauseWeekNumbering: vacPause,
    });
    setVacName('');
    setVacStart('');
    setVacEnd('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Interface Theme & Ambient Color System */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/95 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-theme" />
              Interface Color & Ambiental Ambiance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your university colors. The whole app adjusts its ambient lighting, cards, and accent buttons.
            </p>
          </div>
          <span className="rounded-full badge-theme-soft px-3 py-1 text-xs font-bold capitalize">
            {theme.accent} theme active
          </span>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {ACCENT_COLORS.map((col) => {
            const isSelected = theme.accent === col.id;
            return (
              <button
                key={col.id}
                onClick={() => onUpdateTheme({ ...theme, accent: col.id })}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-2 border-theme-accent bg-slate-50 dark:bg-slate-800/90 shadow-md scale-105'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-full ${col.preview} shadow-sm mb-2 flex items-center justify-center transition-transform hover:scale-110`}
                >
                  {isSelected && <Check className="h-4 w-4 text-white" />}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white text-center leading-tight">
                  {col.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dark Mode & Density Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Mode
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                  !isDarkMode
                    ? 'border-theme-accent badge-theme-soft text-theme shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                Light Mode
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                  isDarkMode
                    ? 'border-theme-accent bg-slate-800 text-white shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <Moon className="h-4 w-4 text-theme" />
                Dark Mode
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Timetable Density
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateTheme({ ...theme, density: 'comfortable' })}
                className={`flex-1 rounded-xl border p-2.5 text-xs font-bold transition ${
                  theme.density === 'comfortable'
                    ? 'border-theme-accent badge-theme-soft text-theme shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                Comfortable
              </button>
              <button
                onClick={() => onUpdateTheme({ ...theme, density: 'compact' })}
                className={`flex-1 rounded-xl border p-2.5 text-xs font-bold transition ${
                  theme.density === 'compact'
                    ? 'border-theme-accent badge-theme-soft text-theme shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                Compact Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Android & Mobile Hub (GitHub Download & APK) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/95 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl btn-theme-primary text-white shadow-md">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Android App & Mobile Download
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download UniTrack on your Android phone through GitHub Releases or install as WebAPK.
              </p>
            </div>
          </div>

          <span className="rounded-full badge-theme-soft px-3 py-1 text-xs font-bold">
            PWA & APK Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
              <Github className="h-4 w-4 text-theme" />
              Download APK from GitHub
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Get the standalone UniTrack.apk from repository releases to install directly on Android.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
              <Smartphone className="h-4 w-4 text-theme" />
              1-Click WebAPK Install
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Add directly to Android home screen for instant full-screen offline access.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
              <QrCode className="h-4 w-4 text-theme" />
              Scan Phone QR Code
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Point your phone camera to instantly open and save your schedules on mobile.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onOpenAndroidModal}
            className="flex items-center gap-2 rounded-xl btn-theme-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Smartphone className="h-4 w-4" />
            <span>Open Android App & GitHub Download Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Notifications & Audio Chime Settings */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/95 space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-theme" />
            Class Alerts & Sound Notifications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure audible chimes and browser push warnings before classes begin.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Enable Class Reminder Alerts
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Show alert banners and sound chimes when a class is starting soon.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alert Time Ahead
              </label>
              <select
                value={settings.classAlertMinutes}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    classAlertMinutes: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before (Recommended)</option>
                <option value={30}>30 minutes before</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sound Chime
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      soundEnabled: !settings.soundEnabled,
                    })
                  }
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-2 text-xs font-bold transition ${
                    settings.soundEnabled
                      ? 'border-theme-accent badge-theme-soft text-theme'
                      : 'border-slate-200 text-slate-500 dark:border-slate-700'
                  }`}
                >
                  <Volume2 className="h-4 w-4" />
                  {settings.soundEnabled ? 'Chime ON' : 'Chime Muted'}
                </button>
                <button
                  onClick={onTestNotification}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Test Audio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Semester Configuration */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/95 space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-theme" />
            Academic Semester Dates & Odd/Even Rotation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure the academic term, first week parity, and total weeks.
          </p>
        </div>

        <form onSubmit={handleSaveSemester} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Name
              </label>
              <input
                type="text"
                value={semName}
                onChange={(e) => setSemName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date (Monday of Week 1)
              </label>
              <input
                type="date"
                value={semStart}
                onChange={(e) => setSemStart(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Semester Weeks
              </label>
              <input
                type="number"
                min={8}
                max={20}
                value={semWeeks}
                onChange={(e) => setSemWeeks(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                First Week Parity
              </label>
              <select
                value={semParity}
                onChange={(e) => setSemParity(e.target.value as 'odd' | 'even')}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="odd">Odd Week (Standard)</option>
                <option value="even">Even Week</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl btn-theme-primary px-5 py-2 text-xs font-bold text-white shadow-sm"
            >
              <Check className="h-4 w-4" />
              Save Semester Config
            </button>
            {semSaved && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                Saved successfully!
              </span>
            )}
          </div>
        </form>

        {/* Vacations & Breaks Management */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Palmtree className="h-4 w-4 text-emerald-500" />
            Vacation Periods & Midterm Recesses
          </h4>

          <div className="space-y-2">
            {semester.vacations.map((vac) => (
              <div
                key={vac.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700/80 dark:bg-slate-800/60"
              >
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    {vac.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {vac.startDate} to {vac.endDate} • {vac.pauseWeekNumbering ? 'Pauses Academic Week Numbers' : 'Week Numbers Continue'}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteVacation(vac.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Delete vacation break"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Vacation Form */}
          <form onSubmit={handleAddVac} className="rounded-2xl border border-dashed border-slate-200 p-3.5 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Vacation name..."
              value={vacName}
              onChange={(e) => setVacName(e.target.value)}
              className="flex-1 min-w-[140px] rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
            <input
              type="date"
              value={vacStart}
              onChange={(e) => setVacStart(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
            <input
              type="date"
              value={vacEnd}
              onChange={(e) => setVacEnd(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
            <button
              type="submit"
              className="rounded-xl btn-theme-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              + Add Break
            </button>
          </form>
        </div>
      </div>

      {/* 5. Data Backup & Reset */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/95 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="h-5 w-5 text-theme" />
          Data Backup & Reset
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            Export Schedule JSON
          </button>

          <button
            onClick={onResetToSampleData}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Sample Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
