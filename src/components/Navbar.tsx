import React, { useEffect, useRef, useState } from 'react';
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
  Settings,
  Palmtree,
  StickyNote,
  Volume2,
} from 'lucide-react';
import { AcademicWeekInfo, NotificationSettings } from '../domain/types.ts';
import { usePWAInstall } from '../viewmodels/usePWAInstall.ts';
import { UniTrackLogo } from './UniTrackLogo.tsx';

interface NavbarProps {
  currentWeekInfo: AcademicWeekInfo;
  activeTab: 'calendar' | 'countdowns' | 'widget' | 'notes' | 'settings';
  setActiveTab: (tab: 'calendar' | 'countdowns' | 'widget' | 'notes' | 'settings') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onExportJson: () => void;
  onImportJson: (json: string) => { success: boolean; message: string };
  settings: NotificationSettings;
  onUpdateSettings: (s: NotificationSettings) => void;
  onRequestNotificationPermission: () => Promise<boolean>;
  onTestNotification: () => void;
  onOpenAndroidModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentWeekInfo,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onExportJson,
  onImportJson,
  onRequestNotificationPermission,
  onTestNotification,
  onOpenAndroidModal,
}) => {
  const { isInstalled } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close notification popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotificationMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleNotificationClick = async () => {
    // Request permission and toggle chime test menu for mobile tap support
    await onRequestNotificationPermission();
    setShowNotificationMenu((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-2 gap-x-2 px-2.5 py-2 sm:px-4 md:px-6">
        {/* Brand & Academic Week Indicator (flex-wrap friendly) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => setActiveTab('calendar')}
          >
            <UniTrackLogo size={32} className="sm:w-[36px] sm:h-[36px]" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm sm:text-base">
                  UniTrack
                </span>
                <span className="hidden sm:inline-block rounded-full badge-theme-soft px-1.5 py-0.2 text-[9px] font-bold">
                  v2.1
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block leading-none">
                Academic Calendar
              </p>
            </div>
          </div>

          {/* Academic Week Badge - scales smoothly on all viewport widths */}
          <div className="flex items-center gap-1 rounded-full border border-theme-soft badge-theme-soft px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold shrink-0">
            {currentWeekInfo.isVacation ? (
              <>
                <Palmtree className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate max-w-[80px] sm:max-w-none">
                  {currentWeekInfo.currentVacation?.name || 'Vacation'}
                </span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 text-theme shrink-0" />
                <span className="font-mono font-bold">
                  <span className="sm:hidden">W{currentWeekInfo.weekNumber}</span>
                  <span className="hidden sm:inline">Week {currentWeekInfo.weekNumber}</span>
                </span>
                <span className="hidden sm:inline opacity-50">•</span>
                <span className="hidden sm:inline capitalize">{currentWeekInfo.parity}</span>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation (Desktop only) */}
        <nav className="hidden lg:flex items-center gap-1 rounded-2xl bg-slate-100/90 p-1 dark:bg-slate-800/80 shadow-2xs">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'calendar'
                ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Timetable
          </button>

          <button
            onClick={() => setActiveTab('countdowns')}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'countdowns'
                ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Countdowns & Exams
          </button>

          <button
            onClick={() => setActiveTab('widget')}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'widget'
                ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Home Widget
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'notes'
                ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <StickyNote className="h-3.5 w-3.5" />
            Postcards
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </button>
        </nav>

        {/* Action Controls & Utilities - strictly bounded with flex-wrap and responsive padding */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Android Download & GitHub Button */}
          <button
            onClick={onOpenAndroidModal}
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl btn-theme-primary px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-bold text-white shadow-2xs transition hover:scale-105 active:scale-95 shrink-0"
            title="Download on Android phone or install PWA"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Android & Mobile</span>
            <span className="sm:hidden text-[11px]">App</span>
          </button>

          {/* JSON Export (Desktop only) */}
          <button
            onClick={onExportJson}
            className="hidden md:flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition shrink-0"
            title="Export local schedule JSON file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          {/* JSON Import (Desktop only) */}
          <label
            className="hidden md:flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition shrink-0"
            title="Import local schedule JSON file"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          {/* Notification Button & Responsive Bounded Dropdown */}
          <div ref={notifMenuRef} className="relative shrink-0">
            <button
              onClick={handleNotificationClick}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border transition shrink-0 ${
                showNotificationMenu
                  ? 'border-theme-accent badge-theme-soft text-theme shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Class reminder notifications & alerts"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-theme" />
            </button>

            {/* Notification popup positioned with strict boundaries so it never overflows */}
            {showNotificationMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 max-w-[calc(100vw-20px)] rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-1">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Notification Alerts
                </p>
                <button
                  onClick={() => {
                    onTestNotification();
                    setShowNotificationMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <Volume2 className="h-4 w-4 text-theme shrink-0" />
                  <span>Play Sound Chime</span>
                </button>
                <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 px-2">
                  Alerts are active for upcoming classes
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition shrink-0"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-theme" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar (Bottom Navigation) */}
      <div className="lg:hidden border-t border-slate-200 bg-white px-2 py-1.5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center rounded-xl py-1 text-[11px] font-medium transition ${
              activeTab === 'calendar'
                ? 'btn-theme-primary text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="h-4 w-4 mb-0.5" />
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('countdowns')}
            className={`flex flex-col items-center justify-center rounded-xl py-1 text-[11px] font-medium transition ${
              activeTab === 'countdowns'
                ? 'btn-theme-primary text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clock className="h-4 w-4 mb-0.5" />
            Exams
          </button>
          <button
            onClick={() => setActiveTab('widget')}
            className={`flex flex-col items-center justify-center rounded-xl py-1 text-[11px] font-medium transition ${
              activeTab === 'widget'
                ? 'btn-theme-primary text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Smartphone className="h-4 w-4 mb-0.5" />
            Widget
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex flex-col items-center justify-center rounded-xl py-1 text-[11px] font-medium transition ${
              activeTab === 'notes'
                ? 'btn-theme-primary text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <StickyNote className="h-4 w-4 mb-0.5" />
            Notes
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center rounded-xl py-1 text-[11px] font-medium transition ${
              activeTab === 'settings'
                ? 'btn-theme-primary text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Settings className="h-4 w-4 mb-0.5" />
            Settings
          </button>
        </div>
      </div>

      {/* Import Notification Toast */}
      {importStatus && (
        <div className="btn-theme-primary px-4 py-1.5 text-center text-xs font-semibold text-white transition animate-in fade-in">
          {importStatus}
        </div>
      )}

      {/* iOS Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Install UniTrack on iPhone / iPad
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              1. Tap the <strong>Share</strong> button (box with upward arrow) in Safari.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
              3. Tap <strong>Add</strong> in the top-right corner.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl btn-theme-primary py-2.5 text-xs font-bold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
