import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  User,
  Edit2,
  Trash2,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Hammer,
  HelpCircle,
  Plus,
  GripVertical,
  ArrowRightLeft,
  Search,
  Sparkles,
} from 'lucide-react';
import { ClassEvent, ClassType, DayOfWeek } from '../domain/types.ts';
import { DAYS_OF_WEEK } from '../domain/calendarLogic.ts';
import { HighlightedText } from './HighlightedText.tsx';

interface TimetableGridProps {
  timetableByDay: Record<DayOfWeek, ClassEvent[]>;
  selectedDayFilter: DayOfWeek | 'all';
  searchQuery?: string;
  onEditClass: (cls: ClassEvent) => void;
  onDeleteClass: (id: string) => void;
  onAddClassForDay: (day: DayOfWeek) => void;
  onMoveClass: (classId: string, targetDay: DayOfWeek) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  timetableByDay,
  selectedDayFilter,
  searchQuery = '',
  onEditClass,
  onDeleteClass,
  onAddClassForDay,
  onMoveClass,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>('grid');
  const [draggedClassId, setDraggedClassId] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<DayOfWeek | null>(null);
  const [moveMenuClassId, setMoveMenuClassId] = useState<string | null>(null);

  // Days to show based on filter
  const activeDays =
    selectedDayFilter === 'all'
      ? DAYS_OF_WEEK.filter((d) => d !== 'Sunday' || (timetableByDay[d]?.length || 0) > 0)
      : [selectedDayFilter];

  const trimmedQuery = (searchQuery || '').trim().toLowerCase();
  const isSearchActive = trimmedQuery.length > 0;

  // Helper to check if a class matches search query
  const checkClassMatch = (cls: ClassEvent): boolean => {
    if (!isSearchActive) return false;
    return (
      cls.title.toLowerCase().includes(trimmedQuery) ||
      cls.code.toLowerCase().includes(trimmedQuery) ||
      cls.room.toLowerCase().includes(trimmedQuery) ||
      Boolean(cls.professor && cls.professor.toLowerCase().includes(trimmedQuery)) ||
      Boolean(cls.notes && cls.notes.toLowerCase().includes(trimmedQuery))
    );
  };

  // Total matching classes across active days
  const totalMatchingClasses = activeDays.reduce((acc, day) => {
    const list = timetableByDay[day] || [];
    return acc + list.filter(checkClassMatch).length;
  }, 0);

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

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, classId: string) => {
    e.dataTransfer.setData('text/plain', classId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedClassId(classId);
  };

  const handleDragEnd = () => {
    setDraggedClassId(null);
    setDragOverDay(null);
  };

  const handleDragOver = (e: React.DragEvent, day: DayOfWeek) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDay !== day) {
      setDragOverDay(day);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverDay(null);
  };

  const handleDrop = (e: React.DragEvent, targetDay: DayOfWeek) => {
    e.preventDefault();
    const classId = e.dataTransfer.getData('text/plain') || draggedClassId;
    if (classId) {
      onMoveClass(classId, targetDay);
    }
    setDraggedClassId(null);
    setDragOverDay(null);
  };

  return (
    <div className="space-y-4">
      {/* Search Highlighting Active Banner */}
      {isSearchActive && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50/90 px-4 py-2.5 text-amber-950 shadow-sm dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Search className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Highlighting classes matching{' '}
              <strong className="underline underline-offset-2">"{searchQuery}"</strong>:
            </span>
            <span className="rounded-full bg-amber-200/90 px-2 py-0.5 text-[11px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-100">
              {totalMatchingClasses} class{totalMatchingClasses !== 1 ? 'es' : ''} found
            </span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 hidden sm:inline">
            Matching text is highlighted in gold
          </span>
        </div>
      )}

      {/* View Switcher & Drag-and-drop info notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing schedule for {activeDays.length} day{activeDays.length > 1 ? 's' : ''}
          </p>
          <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium badge-theme-soft px-2.5 py-0.5 rounded-full">
            <GripVertical className="h-3 w-3" />
            Drag & drop cards across days to quickly reorder
          </span>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg px-3 py-1 font-semibold transition ${
              viewMode === 'grid'
                ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Weekly Columns
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`rounded-lg px-3 py-1 font-semibold transition ${
              viewMode === 'agenda'
                ? 'bg-white text-theme shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Agenda Feed
          </button>
        </div>
      </div>

      {/* Grid View with Drag and Drop Support */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {activeDays.map((day) => {
            const dayClasses = timetableByDay[day] || [];
            const isTargetDay = dragOverDay === day;

            return (
              <div
                key={day}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
                className={`flex flex-col rounded-3xl border p-3.5 shadow-xs transition-all ${
                  isTargetDay
                    ? 'border-2 border-dashed border-theme-accent bg-theme-light dark:bg-slate-800/80 scale-[1.01]'
                    : 'border-slate-200/90 bg-white/90 backdrop-blur-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {day}
                      </h3>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddClassForDay(day)}
                    className="flex h-7 w-7 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400 hover:border-theme-accent hover:text-theme transition dark:border-slate-700"
                    title={`Add class for ${day}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Day Classes List / Drop Area */}
                <div className="flex-1 space-y-3 min-h-[140px]">
                  {isTargetDay && (
                    <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-theme-accent badge-theme-soft p-3.5 text-center text-xs font-bold animate-pulse">
                      📥 Drop here to move to {day}
                    </div>
                  )}

                  {dayClasses.length === 0 && !isTargetDay ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-800/80">
                      <Clock className="h-6 w-6 text-slate-300 dark:text-slate-600 mb-1" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        No classes scheduled
                      </p>
                      <button
                        onClick={() => onAddClassForDay(day)}
                        className="mt-2 text-[11px] font-bold text-theme hover:underline"
                      >
                        + Add a class
                      </button>
                    </div>
                  ) : (
                    dayClasses.map((cls) => {
                      const typeBadge = getTypeBadge(cls.type);
                      const TypeIcon = typeBadge.icon;
                      const isDragging = draggedClassId === cls.id;
                      const isMatch = checkClassMatch(cls);

                      return (
                        <div
                          key={cls.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, cls.id)}
                          onDragEnd={handleDragEnd}
                          className={`group relative rounded-2xl border p-3 shadow-2xs transition-all cursor-grab active:cursor-grabbing ${
                            isDragging
                              ? 'opacity-40 scale-95 border-theme-accent bg-theme-light'
                              : isMatch
                              ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-50/90 shadow-md shadow-amber-500/20 dark:ring-amber-400 dark:border-amber-600 dark:bg-amber-950/50 scale-[1.01]'
                              : isSearchActive
                              ? 'opacity-45 grayscale-[25%] hover:opacity-100 hover:grayscale-0 border-slate-200/90 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40'
                              : 'border-slate-200/90 bg-slate-50/70 hover:border-theme-accent hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-theme-accent dark:hover:bg-slate-800'
                          }`}
                        >
                          {/* Accent left border */}
                          <div
                            className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full"
                            style={{ backgroundColor: cls.color || '#4f46e5' }}
                          />

                          {/* Match Highlight Pill */}
                          {isMatch && (
                            <div className="pl-2 mb-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/90 px-2 py-0.5 text-[9px] font-extrabold text-amber-950 dark:bg-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700">
                                <Sparkles className="h-2.5 w-2.5" />
                                Match
                              </span>
                            </div>
                          )}

                          {/* Top Row: Gripper, Time & Recurrence */}
                          <div className="flex items-center justify-between gap-1 pl-2 mb-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                              <span
                                className="cursor-grab text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                title="Drag across days to reorder"
                              >
                                <GripVertical className="h-3.5 w-3.5" />
                              </span>
                              <span>{cls.startTime} - {cls.endTime}</span>
                            </div>
                            {getRecurrenceBadge(cls.recurrence)}
                          </div>

                          {/* Title & Code with Highlighting */}
                          <div className="pl-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                                <HighlightedText text={cls.code} query={searchQuery || ''} />
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[10px] font-semibold ${typeBadge.bg}`}
                              >
                                <TypeIcon className="h-2.5 w-2.5" />
                                {typeBadge.label}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                              <HighlightedText text={cls.title} query={searchQuery || ''} />
                            </h4>
                          </div>

                          {/* Location & Professor with Highlighting */}
                          <div className="mt-2 space-y-1 pl-2 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-800">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                              <span className="truncate">
                                <HighlightedText text={cls.room} query={searchQuery || ''} />
                              </span>
                            </div>
                            {cls.professor && (
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3 shrink-0 text-slate-400" />
                                <span className="truncate">
                                  <HighlightedText text={cls.professor} query={searchQuery || ''} />
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Notes if present with Highlighting */}
                          {cls.notes && (
                            <p className="mt-2 pl-2 text-[10px] italic text-slate-500 dark:text-slate-400 border-t border-dotted border-slate-200 pt-1.5 dark:border-slate-800">
                              "<HighlightedText text={cls.notes} query={searchQuery || ''} />"
                            </p>
                          )}

                          {/* Hover Actions: Move Day, Edit & Delete */}
                          <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            {/* Accessible Quick Day Switcher Menu */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setMoveMenuClassId(
                                    moveMenuClassId === cls.id ? null : cls.id
                                  )
                                }
                                className="rounded-lg bg-white p-1 text-slate-500 shadow-xs hover:bg-slate-100 hover:text-theme dark:bg-slate-700 dark:text-slate-300"
                                title="Move to another day (Quick reorder)"
                              >
                                <ArrowRightLeft className="h-3 w-3" />
                              </button>

                              {moveMenuClassId === cls.id && (
                                <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-30">
                                  <p className="px-2 py-0.5 text-[9px] font-bold uppercase text-slate-400">
                                    Move to day:
                                  </p>
                                  {DAYS_OF_WEEK.map((d) => (
                                    <button
                                      key={d}
                                      onClick={() => {
                                        onMoveClass(cls.id, d);
                                        setMoveMenuClassId(null);
                                      }}
                                      className={`block w-full rounded-lg px-2 py-1 text-left text-xs transition ${
                                        d === cls.day
                                          ? 'font-bold text-theme bg-slate-100 dark:bg-slate-700'
                                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                                      }`}
                                    >
                                      {d}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => onEditClass(cls)}
                              className="rounded-lg bg-white p-1 text-slate-500 shadow-xs hover:bg-slate-100 hover:text-theme dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                              title="Edit class"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => onDeleteClass(cls.id)}
                              className="rounded-lg bg-white p-1 text-slate-500 shadow-xs hover:bg-red-50 hover:text-red-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
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
                className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/95"
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
                    const isMatch = checkClassMatch(cls);

                    return (
                      <div
                        key={cls.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                          isMatch
                            ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-50/90 shadow-md shadow-amber-500/20 dark:ring-amber-400 dark:border-amber-600 dark:bg-amber-950/50'
                            : isSearchActive
                            ? 'opacity-45 grayscale-[25%] hover:opacity-100 hover:grayscale-0 border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
                            : 'border-slate-200/80 bg-slate-50 hover:bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-xs"
                            style={{ backgroundColor: cls.color || '#4f46e5' }}
                          >
                            <TypeIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                                <HighlightedText text={cls.code} query={searchQuery || ''} />
                              </span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeBadge.bg}`}
                              >
                                {typeBadge.label}
                              </span>
                              {getRecurrenceBadge(cls.recurrence)}
                              {isMatch && (
                                <span className="rounded-full bg-amber-200/90 px-2 py-0.5 text-[9px] font-extrabold text-amber-950 dark:bg-amber-900 dark:text-amber-100">
                                  ✨ Match
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              <HighlightedText text={cls.title} query={searchQuery || ''} />
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {cls.startTime} - {cls.endTime} •{' '}
                              <HighlightedText text={cls.room} query={searchQuery || ''} />
                              {cls.professor && (
                                <>
                                  {' • '}
                                  <HighlightedText text={cls.professor} query={searchQuery || ''} />
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => onEditClass(cls)}
                            className="flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <Edit2 className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteClass(cls.id)}
                            className="flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-slate-700"
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
