import React, { useMemo } from 'react';
import {
  Calendar,
  Plus,
  Search,
  RotateCcw,
  Clock,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  Palmtree,
  CalendarDays,
} from 'lucide-react';
import {
  AcademicWeekInfo,
  ClassType,
  DayOfWeek,
  SemesterConfig,
} from '../domain/types.ts';
import {
  DAYS_OF_WEEK,
  calculateSemesterTimeline,
} from '../domain/calendarLogic.ts';

interface TimetableHeaderProps {
  semester: SemesterConfig;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  selectedWeekParity: 'odd' | 'even';
  parityOverride: 'auto' | 'odd' | 'even' | 'all';
  setParityOverride: (p: 'auto' | 'odd' | 'even' | 'all') => void;
  effectiveParity: 'odd' | 'even' | 'all';
  selectedDayFilter: DayOfWeek | 'all';
  setSelectedDayFilter: (day: DayOfWeek | 'all') => void;
  selectedTypeFilter: ClassType | 'all';
  setSelectedTypeFilter: (t: ClassType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentWeekInfo: AcademicWeekInfo;
  onOpenAddModal: () => void;
  nextUpcoming: {
    classEvent: { title: string; code: string; room: string; startTime: string };
    startsInMinutes: number;
    isToday: boolean;
    day: DayOfWeek;
  } | null;
  currentDate?: Date;
}

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({
  semester,
  selectedWeek,
  setSelectedWeek,
  selectedWeekParity,
  parityOverride,
  setParityOverride,
  effectiveParity,
  selectedDayFilter,
  setSelectedDayFilter,
  selectedTypeFilter,
  setSelectedTypeFilter,
  searchQuery,
  setSearchQuery,
  currentWeekInfo,
  onOpenAddModal,
  nextUpcoming,
  currentDate,
}) => {
  const totalWeeks = semester.totalWeeks || 14;
  const weeksList = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  // Compute visual semester timeline progress
  const timeline = useMemo(
    () => calculateSemesterTimeline(semester, currentDate || new Date()),
    [semester, currentDate]
  );

  return (
    <div className="space-y-4">
      {/* Top Banner: Next Upcoming Class or Vacation Warning */}
      {currentWeekInfo.isVacation ? (
        <div className="flex items-center justify-between rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 text-emerald-950 shadow-xs dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 dark:text-emerald-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌴</span>
            <div>
              <h3 className="text-sm font-bold">
                {currentWeekInfo.currentVacation?.name || 'Academic Recess'}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Regular lectures and laboratories are paused. Enjoy your break or study for upcoming exams!
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-200/80 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            Vacation Period
          </span>
        </div>
      ) : nextUpcoming ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-slate-200/90 bg-white/95 p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl btn-theme-primary text-white shadow-xs">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-theme">
                  {nextUpcoming.isToday ? 'Next Class Today' : `Next Class (${nextUpcoming.day})`}
                </span>
                <span className="rounded-full badge-theme-soft px-2 py-0.5 text-[10px] font-bold">
                  starts in {nextUpcoming.startsInMinutes} min
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                [{nextUpcoming.classEvent.code}] {nextUpcoming.classEvent.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                At {nextUpcoming.classEvent.startTime} • {nextUpcoming.classEvent.room}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 rounded-xl btn-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Class</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-3xl border border-slate-200/90 bg-white/95 p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Weekly Timetable
            </h4>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No classes currently in progress
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl btn-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Class</span>
          </button>
        </div>
      )}

      {/* Visual Semester Progress Bar Card (Requested Feature) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/95 space-y-3.5">
        {/* Header row: Title, current status, percentage badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl badge-theme-soft text-theme shadow-2xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Semester Timeline Progress
                </h3>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                  • {semester.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {timeline.isPreSemester ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    Term starts in {timeline.daysUntilStart} days ({timeline.startDateFormatted})
                  </span>
                ) : timeline.isPostSemester ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Semester completed • All {semester.totalWeeks} academic weeks concluded
                  </span>
                ) : (
                  <span>
                    Day <strong className="text-slate-800 dark:text-slate-200">{timeline.daysPassed}</strong> of{' '}
                    {timeline.totalDays} days • <strong className="text-theme">{timeline.daysRemaining} days remaining</strong>
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="rounded-full badge-theme-soft px-3 py-1 text-xs font-extrabold text-theme flex items-center gap-1.5 shadow-2xs">
              <TrendingUp className="h-3.5 w-3.5" />
              {timeline.progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Visual Progress Bar Track with Smooth Theme Gradient and Vacation Markers */}
        <div className="space-y-1">
          <div className="relative h-3 sm:h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 p-0.5">
            {/* Vacation Break Highlight Intervals along track */}
            {timeline.vacationMarkers.map((vac) => (
              <div
                key={vac.id}
                className="absolute top-0 bottom-0 bg-emerald-400/40 dark:bg-emerald-500/35 border-x border-emerald-500/50 z-10"
                style={{
                  left: `${vac.startPercent}%`,
                  width: `${vac.endPercent - vac.startPercent}%`,
                }}
                title={`🌴 ${vac.name}: ${vac.startDateFormatted} to ${vac.endDateFormatted}`}
              />
            ))}

            {/* Filled Progress Bar with theme gradient */}
            <div
              className="h-full rounded-full btn-theme-primary transition-all duration-700 ease-out shadow-xs relative z-20"
              style={{ width: `${timeline.progressPercent}%` }}
            >
              {/* Animated luminous gloss highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse" />
            </div>
          </div>

          {/* Vacation Markers Labels below track if any */}
          {timeline.vacationMarkers.length > 0 && (
            <div className="relative h-4 mt-0.5 pointer-events-none hidden sm:block">
              {timeline.vacationMarkers.map((vac) => (
                <div
                  key={vac.id}
                  className="absolute -top-0.5 transform -translate-x-1/2 flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400"
                  style={{ left: `${(vac.startPercent + vac.endPercent) / 2}%` }}
                >
                  <Palmtree className="h-2.5 w-2.5 shrink-0" />
                  <span>{vac.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Labels Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 font-medium">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Term Start:</span>
            <span>{timeline.startDateFormatted}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-bold text-theme">
            <CalendarDays className="h-3 w-3" />
            <span>Week {currentWeekInfo.weekNumber} of {currentWeekInfo.totalWeeks}</span>
            <span className="opacity-40">•</span>
            <span className="capitalize">{currentWeekInfo.parity} Week</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Term End:</span>
            <span>{timeline.endDateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Week Selector Ribbon */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Academic Week Navigation
            </h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Week {selectedWeek} ({selectedWeekParity.toUpperCase()})
            </span>
            {selectedWeek === currentWeekInfo.weekNumber && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                Current Week
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedWeek !== currentWeekInfo.weekNumber && (
              <button
                onClick={() => setSelectedWeek(currentWeekInfo.weekNumber)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-semibold text-theme hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition"
              >
                <RotateCcw className="h-3 w-3" />
                Jump to Current (W{currentWeekInfo.weekNumber})
              </button>
            )}

            {/* Parity Mode Override */}
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 text-xs">
              <button
                onClick={() => setParityOverride('auto')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                  parityOverride === 'auto'
                    ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Automatically alternate based on selected week"
              >
                Auto ({selectedWeekParity})
              </button>
              <button
                onClick={() => setParityOverride('odd')}
                className={`rounded-lg px-2 py-1 font-semibold transition ${
                  parityOverride === 'odd'
                    ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Odd Only
              </button>
              <button
                onClick={() => setParityOverride('even')}
                className={`rounded-lg px-2 py-1 font-semibold transition ${
                  parityOverride === 'even'
                    ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Even Only
              </button>
              <button
                onClick={() => setParityOverride('all')}
                className={`rounded-lg px-2 py-1 font-semibold transition ${
                  parityOverride === 'all'
                    ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Week Buttons Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
            disabled={selectedWeek <= 1}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {weeksList.map((week) => {
            const isSelected = week === selectedWeek;
            const isCurrent = week === currentWeekInfo.weekNumber;
            const isOdd = week % 2 !== 0;

            return (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`group relative flex min-w-[58px] flex-col items-center justify-center rounded-2xl py-1.5 px-2 text-xs font-semibold transition ${
                  isSelected
                    ? 'btn-theme-primary text-white shadow-sm scale-105'
                    : isCurrent
                    ? 'border-2 border-theme-accent badge-theme-soft text-theme'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">
                  {isOdd ? 'Odd' : 'Even'}
                </span>
                <span className="text-sm font-bold">W{week}</span>
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setSelectedWeek(Math.min(totalWeeks, selectedWeek + 1))}
            disabled={selectedWeek >= totalWeeks}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Secondary Filter Bar: Day pills, Type pills, Search */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Day Selector */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedDayFilter('all')}
              className={`rounded-xl px-2.5 py-1 font-semibold transition ${
                selectedDayFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              All Days
            </button>
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(day)}
                className={`rounded-xl px-2.5 py-1 font-semibold transition ${
                  selectedDayFilter === day
                    ? 'btn-theme-primary text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Type Filter & Search Query */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden sm:inline">Type:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value as ClassType | 'all')}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All Types</option>
              <option value="lecture">Lectures Only</option>
              <option value="laboratory">Laboratories Only</option>
              <option value="seminary">Seminaries Only</option>
              <option value="workshop">Workshops Only</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search classes, rooms, profs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 sm:w-60 rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-theme-accent focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
