import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  User,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Hammer,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { ClassEvent, ClassType, DayOfWeek } from '../domain/types.ts';
import { DAYS_OF_WEEK } from '../domain/calendarLogic.ts';

interface TimetableGridProps {
  timetableByDay: Record<DayOfWeek, ClassEvent[]>;
  selectedDayFilter: DayOfWeek | 'all';
  onEditClass: (cls: ClassEvent) => void;
  onDeleteClass: (id: string) => void;
  onAddClassForDay: (day: DayOfWeek) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  timetableByDay,
  selectedDayFilter,
  onEditClass,
  onDeleteClass,
  onAddClassForDay,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>('grid');

  // Days to show based on filter
  const activeDays =
    selectedDayFilter === 'all'
      ? DAYS_OF_WEEK.filter((d) => d !== 'Sunday' || (timetableByDay[d]?.length || 0) > 0)
      : [selectedDayFilter];

  const getTypeBadge = (type: ClassType) => {
    switch (type) {
      case 'lecture':
        return {
          label: 'Lecture',
          icon: BookOpen,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
        };
      case 'laboratory':
        return {
          label: 'Laboratory',
          icon: FlaskConical,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        };
      case 'seminary':
        return {
          label: 'Seminary',
          icon: GraduationCap,
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        };
      case 'workshop':
        return {
          label: 'Workshop',
          icon: Hammer,
          bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
        };
      default:
        return {
          label: 'Class',
          icon: HelpCircle,
          bg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        };
    }
  };

  const getRecurrenceBadge = (rec: 'all' | 'odd' | 'even') => {
    if (rec === 'odd') {
      return (
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-950/80 dark:text-violet-300">
          Odd Weeks Only
        </span>
      );
    }
    if (rec === 'even') {
      return (
        <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300">
          Even Weeks Only
        </span>
      );
    }
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        Every Week
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing classes for {activeDays.length} day{activeDays.length > 1 ? 's' : ''}
        </p>

        <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-md px-3 py-1 font-medium transition ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Weekly Columns
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`rounded-md px-3 py-1 font-medium transition ${
              viewMode === 'agenda'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Agenda Feed
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {activeDays.map((day) => {
            const dayClasses = timetableByDay[day] || [];
            return (
              <div
                key={day}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {day}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => onAddClassForDay(day)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition"
                    title={`Add class for ${day}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Day Classes List */}
                <div className="flex-1 space-y-3">
                  {dayClasses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-800/80">
                      <Clock className="h-6 w-6 text-slate-300 dark:text-slate-600 mb-1" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        No classes scheduled
                      </p>
                      <button
                        onClick={() => onAddClassForDay(day)}
                        className="mt-2 text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        + Add a class
                      </button>
                    </div>
                  ) : (
                    dayClasses.map((cls) => {
                      const typeBadge = getTypeBadge(cls.type);
                      const TypeIcon = typeBadge.icon;

                      return (
                        <div
                          key={cls.id}
                          className="group relative rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 shadow-xs hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-indigo-600 dark:hover:bg-slate-800 transition"
                        >
                          {/* Accent left border */}
                          <div
                            className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                            style={{ backgroundColor: cls.color || '#4f46e5' }}
                          />

                          {/* Top Row: Time & Recurrence */}
                          <div className="flex items-center justify-between gap-1 pl-2 mb-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span>{cls.startTime} - {cls.endTime}</span>
                            </div>
                            {getRecurrenceBadge(cls.recurrence)}
                          </div>

                          {/* Title & Code */}
                          <div className="pl-2">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                                {cls.code}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[10px] font-semibold ${typeBadge.bg}`}
                              >
                                <TypeIcon className="h-2.5 w-2.5" />
                                {typeBadge.label}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                              {cls.title}
                            </h4>
                          </div>

                          {/* Location & Professor */}
                          <div className="mt-2 space-y-1 pl-2 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-800">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                              <span className="truncate">{cls.room}</span>
                            </div>
                            {cls.professor && (
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3 shrink-0 text-slate-400" />
                                <span className="truncate">{cls.professor}</span>
                              </div>
                            )}
                          </div>

                          {/* Notes if present */}
                          {cls.notes && (
                            <p className="mt-2 pl-2 text-[10px] italic text-slate-500 dark:text-slate-400 border-t border-dotted border-slate-200 pt-1.5 dark:border-slate-800">
                              "{cls.notes}"
                            </p>
                          )}

                          {/* Hover Actions: Edit & Delete */}
                          <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={() => onEditClass(cls)}
                              className="rounded-md bg-white p-1 text-slate-500 shadow-xs hover:bg-slate-100 hover:text-indigo-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                              title="Edit class"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => onDeleteClass(cls.id)}
                              className="rounded-md bg-white p-1 text-slate-500 shadow-xs hover:bg-red-50 hover:text-red-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                              title="Delete class"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Agenda Feed View */
        <div className="space-y-4 max-w-4xl mx-auto">
          {activeDays.map((day) => {
            const dayClasses = timetableByDay[day] || [];
            if (dayClasses.length === 0) return null;

            return (
              <div
                key={day}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {day}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {dayClasses.length} events
                  </span>
                </div>

                <div className="space-y-3">
                  {dayClasses.map((cls) => {
                    const typeBadge = getTypeBadge(cls.type);
                    const TypeIcon = typeBadge.icon;

                    return (
                      <div
                        key={cls.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                            style={{ backgroundColor: cls.color || '#4f46e5' }}
                          >
                            <TypeIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                                {cls.code}
                              </span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeBadge.bg}`}
                              >
                                {typeBadge.label}
                              </span>
                              {getRecurrenceBadge(cls.recurrence)}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {cls.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {cls.startTime} - {cls.endTime} • {cls.room}
                              {cls.professor && ` • ${cls.professor}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => onEditClass(cls)}
                            className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Edit2 className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteClass(cls.id)}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
