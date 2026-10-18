import React, { useState } from 'react';
import {
  Smartphone,
  Clock,
  Calendar,
  MapPin,
  Flame,
  CheckCircle2,
  Maximize2,
  Copy,
  Check,
  Palmtree,
  Sparkles,
} from 'lucide-react';
import { AcademicWeekInfo, ClassEvent, CountdownItem, DayOfWeek } from '../domain/types.ts';
import { calculateCountdownProgress } from '../domain/countdownLogic.ts';

interface WidgetViewProps {
  currentWeekInfo: AcademicWeekInfo;
  nextUpcoming: {
    classEvent: ClassEvent;
    startsInMinutes: number;
    isToday: boolean;
    day: DayOfWeek;
  } | null;
  todayClasses: ClassEvent[];
  countdowns: CountdownItem[];
  onOpenClassModal: () => void;
}

export const WidgetView: React.FC<WidgetViewProps> = ({
  currentWeekInfo,
  nextUpcoming,
  todayClasses,
  countdowns,
  onOpenClassModal,
}) => {
  const [widgetSize, setWidgetSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [widgetTheme, setWidgetTheme] = useState<'indigo' | 'dark' | 'glass'>('indigo');
  const [copied, setCopied] = useState(false);
  const [isMiniMode, setIsMiniMode] = useState(false);

  // Next imminent deadline
  const activeCountdowns = countdowns
    .filter((c) => !c.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const imminentDeadline = activeCountdowns[0];
  const deadlineProgress = imminentDeadline
    ? calculateCountdownProgress(imminentDeadline)
    : null;

  const getThemeClasses = () => {
    switch (widgetTheme) {
      case 'dark':
        return 'bg-slate-900 text-white border-slate-800 shadow-2xl';
      case 'glass':
        return 'bg-white/80 backdrop-blur-xl text-slate-900 border-white/40 shadow-xl dark:bg-slate-900/80 dark:text-white dark:border-slate-700/50';
      default:
        return 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border-indigo-800/50 shadow-2xl';
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      `<iframe src="${window.location.origin}?widget=1" width="360" height="200" frameborder="0"></iframe>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Smartphone className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Home Screen Widget Studio
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Interactive, live-updating glanceable university widgets for your phone home screen or desktop dashboard.
          </p>
        </div>

        {/* Size and Theme Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Size */}
          <div className="flex rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 text-xs font-medium">
            <button
              onClick={() => setWidgetSize('small')}
              className={`rounded-lg px-2.5 py-1 ${
                widgetSize === 'small'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Small (2x2)
            </button>
            <button
              onClick={() => setWidgetSize('medium')}
              className={`rounded-lg px-2.5 py-1 ${
                widgetSize === 'medium'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Medium (4x2)
            </button>
            <button
              onClick={() => setWidgetSize('large')}
              className={`rounded-lg px-2.5 py-1 ${
                widgetSize === 'large'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Large (4x4)
            </button>
          </div>

          {/* Theme */}
          <div className="flex rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 text-xs font-medium">
            <button
              onClick={() => setWidgetTheme('indigo')}
              className={`rounded-lg px-2 py-1 ${
                widgetTheme === 'indigo'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Navy
            </button>
            <button
              onClick={() => setWidgetTheme('dark')}
              className={`rounded-lg px-2 py-1 ${
                widgetTheme === 'dark'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              OLED Dark
            </button>
            <button
              onClick={() => setWidgetTheme('glass')}
              className={`rounded-lg px-2 py-1 ${
                widgetTheme === 'glass'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Glass
            </button>
          </div>
        </div>
      </div>

      {/* Live Phone Screen Mockup & Widget Display */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-100/70 p-6 sm:p-12 dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Live Interactive Widget Preview
        </p>

        {/* Small Widget (2x2) */}
        {widgetSize === 'small' && (
          <div
            className={`w-[180px] h-[180px] rounded-3xl p-4 flex flex-col justify-between border transition-all ${getThemeClasses()}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  UniTrack
                </span>
                <span className="rounded-full bg-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-200">
                  W{currentWeekInfo.weekNumber} • {currentWeekInfo.parity.slice(0, 3)}
                </span>
              </div>

              {nextUpcoming ? (
                <div className="mt-3">
                  <span className="rounded-sm bg-indigo-500/40 px-1 py-0.5 text-[9px] font-mono font-bold">
                    {nextUpcoming.classEvent.code}
                  </span>
                  <h4 className="mt-1 text-xs font-bold leading-tight line-clamp-2">
                    {nextUpcoming.classEvent.title}
                  </h4>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-xs font-bold">No classes now</p>
                  <p className="text-[10px] opacity-75 mt-0.5">Enjoy your day!</p>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-2 text-[10px] flex items-center justify-between opacity-80">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {nextUpcoming ? nextUpcoming.classEvent.startTime : 'Free'}
              </span>
              <span>{nextUpcoming ? nextUpcoming.classEvent.room : 'Campus'}</span>
            </div>
          </div>
        )}

        {/* Medium Widget (4x2) */}
        {widgetSize === 'medium' && (
          <div
            className={`w-full max-w-[380px] sm:max-w-[420px] rounded-3xl p-5 border transition-all ${getThemeClasses()}`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-tight">
                  {currentWeekInfo.isVacation
                    ? currentWeekInfo.currentVacation?.name || 'Vacation'
                    : `Week ${currentWeekInfo.weekNumber} (${currentWeekInfo.parityLabel})`}
                </span>
              </div>
              <span className="text-[11px] opacity-75">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Next Class Content */}
            <div className="mt-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                  {nextUpcoming?.isToday ? 'Next Lecture Today' : 'Upcoming Event'}
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5 line-clamp-1">
                  {nextUpcoming
                    ? `[${nextUpcoming.classEvent.code}] ${nextUpcoming.classEvent.title}`
                    : 'No classes in session'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-indigo-400" />
                    {nextUpcoming ? `${nextUpcoming.classEvent.startTime} - ${nextUpcoming.classEvent.endTime}` : '--:--'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-indigo-400" />
                    {nextUpcoming ? nextUpcoming.classEvent.room : 'Campus'}
                  </span>
                </p>
              </div>

              {nextUpcoming && (
                <div className="rounded-2xl bg-indigo-500/20 border border-indigo-400/30 p-2.5 text-center">
                  <span className="block text-[10px] uppercase font-bold text-indigo-300">
                    Starts in
                  </span>
                  <span className="text-sm font-black text-white">
                    {nextUpcoming.startsInMinutes}m
                  </span>
                </div>
              )}
            </div>

            {/* Imminent Exam Footer */}
            {imminentDeadline && (
              <div className="mt-3.5 rounded-xl bg-white/5 border border-white/10 p-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {imminentDeadline.title}
                  </span>
                  <span className="font-mono text-white">
                    {deadlineProgress?.humanFormatted}
                  </span>
                </div>
                {/* Visual mini bar */}
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-red-400 rounded-full"
                    style={{ width: `${deadlineProgress?.progressPercent || 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Large Widget (4x4) */}
        {widgetSize === 'large' && (
          <div
            className={`w-full max-w-[420px] rounded-3xl p-6 border transition-all ${getThemeClasses()}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Academic Schedule
                </span>
                <h3 className="text-base font-bold">
                  Week {currentWeekInfo.weekNumber} • {currentWeekInfo.parityLabel}
                </h3>
              </div>
              <span className="rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-bold text-indigo-200">
                {todayClasses.length} today
              </span>
            </div>

            {/* Today's Schedule List */}
            <div className="mt-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Today's Timeline
              </span>
              {todayClasses.length === 0 ? (
                <p className="text-xs opacity-75 py-2">No scheduled classes today.</p>
              ) : (
                todayClasses.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] text-indigo-300">
                        {c.startTime}
                      </span>
                      <span className="truncate max-w-[180px] font-semibold">{c.title}</span>
                    </div>
                    <span className="text-[10px] opacity-75">{c.room}</span>
                  </div>
                ))
              )}
            </div>

            {/* Urgent Deadline section */}
            {imminentDeadline && (
              <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5" />
                    Next Deadline: {imminentDeadline.title}
                  </span>
                  <span className="font-mono text-white text-[11px]">
                    {deadlineProgress?.humanFormatted}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-red-400 rounded-full"
                    style={{ width: `${deadlineProgress?.progressPercent || 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guide: How to use on iOS and Android */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-indigo-600" />
            Adding to Phone Home Screen (PWA)
          </h4>
          <ol className="mt-3 list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>Open this app in Chrome (Android) or Safari (iOS).</li>
            <li>Tap <strong>Install App</strong> or <strong>Share &gt; Add to Home Screen</strong>.</li>
            <li>The icon launches in full-screen standalone app mode without browser bars.</li>
            <li>All schedule data and offline study mode remain cached locally!</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Desktop Widget & Embedded View
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Keep this mini widget open as a separate small window while working on assignments or studying.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => window.open(window.location.href, '_blank', 'width=440,height=320')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Pop-Out Mini Widget Window</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
