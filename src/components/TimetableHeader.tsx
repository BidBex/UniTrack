import React from 'react';
import {
  Calendar,
  Filter,
  Plus,
  Search,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FlaskConical,
  Users,
  Compass,
} from 'lucide-react';
import {
  AcademicWeekInfo,
  ClassType,
  DayOfWeek,
  SemesterConfig,
} from '../domain/types.ts';
import { DAYS_OF_WEEK } from '../domain/calendarLogic.ts';

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
}) => {
  const totalWeeks = semester.totalWeeks || 14;
  const weeksList = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* Top Banner: Next Upcoming Class or Vacation Warning */}
      {currentWeekInfo.isVacation ? (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 text-emerald-950 shadow-sm dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 dark:text-emerald-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌴</span>
            <div>
              <h3 className="text-sm font-semibold">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-violet-50/50 to-white p-3.5 shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 dark:text-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {nextUpcoming.isToday ? 'Next Class Today' : `Next Class (${nextUpcoming.day})`}
                </span>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
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
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Class</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Weekly Timetable
            </h4>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No classes currently in progress
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Class</span>
          </button>
        </div>
      )}

      {/* Week Selector Ribbon */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Academic Week
            </h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Week {selectedWeek} ({selectedWeekParity.toUpperCase()})
            </span>
            {selectedWeek === currentWeekInfo.weekNumber && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                Current Week
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedWeek !== currentWeekInfo.weekNumber && (
              <button
                onClick={() => setSelectedWeek(currentWeekInfo.weekNumber)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-3 w-3" />
                Jump to Current (Week {currentWeekInfo.weekNumber})
              </button>
            )}

            {/* Parity Mode Override */}
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800 text-xs">
              <button
                onClick={() => setParityOverride('auto')}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  parityOverride === 'auto'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Automatically alternate based on selected week"
              >
                Auto ({selectedWeekParity})
              </button>
              <button
                onClick={() => setParityOverride('odd')}
                className={`rounded-md px-2 py-1 font-medium transition ${
                  parityOverride === 'odd'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Odd Only
              </button>
              <button
                onClick={() => setParityOverride('even')}
                className={`rounded-md px-2 py-1 font-medium transition ${
                  parityOverride === 'even'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Even Only
              </button>
              <button
                onClick={() => setParityOverride('all')}
                className={`rounded-md px-2 py-1 font-medium transition ${
                  parityOverride === 'all'
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
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
                className={`group relative flex min-w-[58px] flex-col items-center justify-center rounded-xl py-1.5 px-2 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : isCurrent
                    ? 'border-2 border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-200'
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
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
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
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
                className={`rounded-lg px-2.5 py-1 font-medium transition ${
                  selectedDayFilter === day
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden sm:inline">Type:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value as ClassType | 'all')}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                className="w-36 sm:w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
