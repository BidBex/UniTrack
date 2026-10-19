import React, { useState } from 'react';
import {
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  Trash2,
  Edit2,
  Flame,
  Check,
} from 'lucide-react';
import { CountdownCategory, CountdownItem } from '../domain/types.ts';
import { useCountdownsViewModel } from '../viewmodels/useCountdownsViewModel.ts';
import { AddEditCountdownModal } from './AddEditCountdownModal.tsx';

interface CountdownsViewProps {
  countdowns: CountdownItem[];
  setCountdowns: React.Dispatch<React.SetStateAction<CountdownItem[]>>;
}

export const CountdownsView: React.FC<CountdownsViewProps> = ({
  countdowns,
  setCountdowns,
}) => {
  const {
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    filteredItems,
    summary,
    addCountdown,
    updateCountdown,
    deleteCountdown,
    toggleCompleted,
  } = useCountdownsViewModel(countdowns, setCountdowns);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CountdownItem | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: CountdownItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (
    data: Omit<CountdownItem, 'id' | 'completed'>,
    id?: string
  ) => {
    if (id && editingItem) {
      updateCountdown({ ...editingItem, ...data });
    } else {
      addCountdown(data);
    }
  };

  const getUrgencyBadge = (urgency: 'critical' | 'warning' | 'normal' | 'done') => {
    switch (urgency) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/80 dark:text-red-300 animate-pulse">
            <Flame className="h-3 w-3" />
            Critical &lt; 24h
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
            <AlertTriangle className="h-3 w-3" />
            Due in &lt; 3 Days
          </span>
        );
      case 'done':
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            On Track
          </span>
        );
    }
  };

  const getProgressBarColor = (
    urgency: 'critical' | 'warning' | 'normal' | 'done',
    isOverdue: boolean
  ) => {
    if (isOverdue) return 'bg-red-500';
    switch (urgency) {
      case 'critical':
        return 'bg-gradient-to-r from-red-500 to-rose-600';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'done':
        return 'bg-emerald-500';
      default:
        return 'bg-theme';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-theme" />
            Total Deadlines
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {summary.total}
            </span>
            <span className="text-xs font-bold text-theme">
              {summary.active} active
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-4 shadow-xs dark:border-red-900/40 dark:bg-red-950/20">
          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            Urgent (&lt; 24h)
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-red-700 dark:text-red-300">
              {summary.critical}
            </span>
            <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
              Needs priority
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Upcoming (&lt; 3d)
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-800 dark:text-amber-300">
              {summary.warning}
            </span>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              This week
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300">
              {summary.completed}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              Submitted
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {(
            [
              ['all', 'All Active'],
              ['exam', 'Exams'],
              ['assignment', 'Assignments'],
              ['project', 'Projects'],
              ['completed', 'Completed'],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setCategoryFilter(val)}
              className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                categoryFilter === val
                  ? 'btn-theme-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search & Add Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search countdowns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 sm:w-56 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-theme-accent focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl btn-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Countdown</span>
          </button>
        </div>
      </div>

      {/* Countdowns Cards List with Visual Progress Bars */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-800">
            <Clock className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No countdowns match your filter
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Add your upcoming exams, project deadlines, or quizzes.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 rounded-xl btn-theme-primary px-4 py-2 text-xs font-bold text-white shadow-xs"
            >
              + Create First Countdown
            </button>
          </div>
        ) : (
          filteredItems.map(({ item, progress }) => {
            const dueDateFormatted = new Date(item.dueDate).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className={`group rounded-3xl border bg-white/95 p-5 shadow-xs transition-all hover:shadow-md dark:bg-slate-900/95 ${
                  progress.isOverdue
                    ? 'border-red-300 dark:border-red-900/60'
                    : progress.urgency === 'critical'
                    ? 'border-amber-300 dark:border-amber-900/60'
                    : item.completed
                    ? 'border-emerald-200 opacity-75 dark:border-emerald-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCompleted(item.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-xl border transition ${
                        item.completed
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 hover:border-theme-accent dark:border-slate-700'
                      }`}
                      title={item.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {item.completed && <Check className="h-4 w-4" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {item.courseCode && (
                          <span className="font-mono text-xs font-bold text-theme">
                            [{item.courseCode}]
                          </span>
                        )}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                          {item.category}
                        </span>
                        {item.weightPercent && (
                          <span className="rounded-full badge-theme-soft px-2 py-0.5 text-[10px] font-bold">
                            {item.weightPercent}% of grade
                          </span>
                        )}
                        {getUrgencyBadge(progress.urgency)}
                      </div>

                      <h3
                        className={`text-base font-bold text-slate-900 dark:text-white ${
                          item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-xl border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-theme dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                      title="Edit countdown"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCountdown(item.id)}
                      className="rounded-xl border border-slate-200 p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                      title="Delete countdown"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar Section (Visual Progress Bar) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Due: {dueDateFormatted}
                    </span>

                    {/* Live Dynamic Countdown Display */}
                    <span
                      className={`font-mono text-sm font-extrabold ${
                        progress.isOverdue
                          ? 'text-red-600 dark:text-red-400'
                          : progress.urgency === 'critical'
                          ? 'text-red-600 dark:text-red-400'
                          : progress.urgency === 'warning'
                          ? 'text-amber-600 dark:text-amber-400'
                          : progress.isCompleted
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-theme'
                      }`}
                    >
                      {progress.humanFormatted}
                    </span>
                  </div>

                  {/* Visual Progress Bar Track */}
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(
                        progress.urgency,
                        progress.isOverdue
                      )}`}
                      style={{ width: `${progress.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Elapsed: {Math.round(progress.progressPercent)}%</span>
                    <span>
                      {progress.isOverdue
                        ? 'Overdue'
                        : `${progress.daysRemaining}d ${progress.hoursRemaining}h remaining`}
                    </span>
                  </div>
                </div>

                {/* Notes if provided */}
                {item.notes && (
                  <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-800">
                    "{item.notes}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <AddEditCountdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialItem={editingItem}
      />
    </div>
  );
};
