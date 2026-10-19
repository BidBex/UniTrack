import React, { useState } from 'react';
import {
  Palette,
  Bell,
  Calendar,
  Palmtree,
  Download,
  Upload,
  RotateCcw,
  Check,
  Moon,
  Sun,
  Laptop,
  Volume2,
  VolumeX,
  Trash2,
  Clock,
  Sparkles,
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
  onImportJson,
  onResetToSampleData,
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
    setTimeout(() => setSemSaved(false), 3000);
  };

  const handleAddVac = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacName.trim() || !vacStart || !vacEnd) return;
    onAddVacation({
      name: vacName.trim(),
      startDate: vacStart,
      endDate: vacEnd,
      pauseWeekNumbering: vacPause,
    });
    setVacName('');
    setVacStart('');
    setVacEnd('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Settings Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Palette className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Settings & Customization
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Personalize interface colors, alert preferences, timetable vacations, and data backups.
        </p>
      </div>

      {/* 1. Interface Color & Appearance Section (Requested by user!) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Choose Interface Accent Color
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pick your university brand or preferred accent theme across buttons, badges, and headers.
          </p>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {ACCENT_COLORS.map((col) => {
            const isSelected = theme.accent === col.id;
            return (
              <button
                key={col.id}
                onClick={() => onUpdateTheme({ ...theme, accent: col.id })}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? `${col.border} border-2 bg-slate-50 dark:bg-slate-800/80 shadow-md scale-105`
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                <div className={`h-8 w-8 rounded-full ${col.preview} shadow-sm mb-2 flex items-center justify-center`}>
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
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-slate-800 dark:text-white shadow-xs'
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
                    ? 'border-indigo-500 bg-slate-800 text-white shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                <Moon className="h-4 w-4 text-indigo-400" />
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
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-slate-800 dark:text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                Comfortable
              </button>
              <button
                onClick={() => onUpdateTheme({ ...theme, density: 'compact' })}
                className={`flex-1 rounded-xl border p-2.5 text-xs font-bold transition ${
                  theme.density === 'compact'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-slate-800 dark:text-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                Compact Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Notifications & Audio Chime Settings */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Class Alerts & Sound Notifications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure reminder lead time before lectures start and browser notification permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Class Reminder Lead Time
            </label>
            <select
              value={settings.classAlertMinutes}
              onChange={(e) =>
                onUpdateSettings({ ...settings, classAlertMinutes: Number(e.target.value) })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
            >
              <option value={5}>5 minutes before</option>
              <option value={10}>10 minutes before</option>
              <option value={15}>15 minutes before (Default)</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Synthesized Audio Chimes
            </label>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`w-full flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                settings.soundEnabled
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {settings.soundEnabled ? 'Sound Chimes On' : 'Muted'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Test Alert System
            </label>
            <button
              type="button"
              onClick={onTestNotification}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              <Bell className="h-4 w-4" />
              Play Test Chime
            </button>
          </div>
        </div>
      </div>

      {/* 3. Semester Configuration & Vacations */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Academic Semester & Parity Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure semester duration and vacation freezes.
            </p>
          </div>
          {semSaved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <Check className="h-4 w-4" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSemester} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Title
              </label>
              <input
                type="text"
                value={semName}
                onChange={(e) => setSemName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date (First Day)
              </label>
              <input
                type="date"
                value={semStart}
                onChange={(e) => setSemStart(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
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
                min="6"
                max="24"
                value={semWeeks}
                onChange={(e) => setSemWeeks(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Week 1 Starting Parity
              </label>
              <select
                value={semParity}
                onChange={(e) => setSemParity(e.target.value as 'odd' | 'even')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
              >
                <option value="odd">Odd Week (Standard: W1 is Odd, W2 is Even)</option>
                <option value="even">Even Week (W1 is Even, W2 is Odd)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              Update Semester
            </button>
          </div>
        </form>

        {/* Vacations Sub-Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Vacations & Reading Weeks
          </h4>

          <div className="space-y-2">
            {semester.vacations.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">🌴 {v.name}</span>
                  <span className="text-slate-500 ml-2">({v.startDate} to {v.endDate})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteVacation(v.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Vacation Form */}
          <form onSubmit={handleAddVac} className="rounded-xl border border-dashed border-slate-200 p-3.5 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Vacation name..."
              value={vacName}
              onChange={(e) => setVacName(e.target.value)}
              className="flex-1 min-w-[140px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
            <input
              type="date"
              value={vacStart}
              onChange={(e) => setVacStart(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
            <input
              type="date"
              value={vacEnd}
              onChange={(e) => setVacEnd(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              + Add Break
            </button>
          </form>
        </div>
      </div>

      {/* 4. Data Backup & Reset */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
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
