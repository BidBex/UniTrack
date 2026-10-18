import React, { useState } from 'react';
import { X, BookOpen, Clock, MapPin, User, Palette, Calendar } from 'lucide-react';
import { ClassEvent, ClassType, DayOfWeek, WeekRecurrence } from '../domain/types.ts';
import { DAYS_OF_WEEK } from '../domain/calendarLogic.ts';

interface AddEditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cls: Omit<ClassEvent, 'id'>, id?: string) => void;
  initialClass?: ClassEvent | null;
  defaultDay?: DayOfWeek;
}

const COLOR_PRESETS = [
  '#4f46e5', // Indigo
  '#2563eb', // Blue
  '#059669', // Emerald
  '#0d9488', // Teal
  '#d97706', // Amber
  '#ea580c', // Orange
  '#e11d48', // Rose
  '#7c3aed', // Purple
  '#475569', // Slate
];

export const AddEditClassModal: React.FC<AddEditClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClass,
  defaultDay = 'Monday',
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialClass?.title || '');
  const [code, setCode] = useState(initialClass?.code || '');
  const [type, setType] = useState<ClassType>(initialClass?.type || 'lecture');
  const [day, setDay] = useState<DayOfWeek>(initialClass?.day || defaultDay);
  const [startTime, setStartTime] = useState(initialClass?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialClass?.endTime || '10:30');
  const [room, setRoom] = useState(initialClass?.room || '');
  const [professor, setProfessor] = useState(initialClass?.professor || '');
  const [recurrence, setRecurrence] = useState<WeekRecurrence>(
    initialClass?.recurrence || 'all'
  );
  const [color, setColor] = useState(initialClass?.color || '#4f46e5');
  const [notes, setNotes] = useState(initialClass?.notes || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Class title is required');
      return;
    }
    if (!code.trim()) {
      setError('Course code is required (e.g. CS201)');
      return;
    }
    if (!room.trim()) {
      setError('Room / Hall is required');
      return;
    }
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    onSave(
      {
        title: title.trim(),
        code: code.trim().toUpperCase(),
        type,
        day,
        startTime,
        endTime,
        room: room.trim(),
        professor: professor.trim() || undefined,
        recurrence,
        color,
        notes: notes.trim() || undefined,
      },
      initialClass?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initialClass ? 'Edit Scheduled Class' : 'Add New Class'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure time, room, and odd/even week recurrence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Operating Systems"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                placeholder="CS204"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs uppercase text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Type & Recurrence (Odd / Even / All) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ClassType)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="lecture">Lecture (Curs)</option>
                <option value="laboratory">Laboratory (Laborator)</option>
                <option value="seminary">Seminary (Seminar)</option>
                <option value="workshop">Workshop (Atelier)</option>
                <option value="consultation">Office Hours / Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Week Recurrence *
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as WeekRecurrence)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">Every Week (All Weeks)</option>
                <option value="odd">Odd Weeks Only (Saptamana Impara: 1, 3, 5...)</option>
                <option value="even">Even Weeks Only (Saptamana Para: 2, 4, 6...)</option>
              </select>
            </div>
          </div>

          {/* Day & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Day of Week
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Room & Professor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room / Hall / Building *
              </label>
              <input
                type="text"
                placeholder="Amphitheater 2, Linux Lab 301"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lecturer / Professor (Optional)
              </label>
              <input
                type="text"
                placeholder="Prof. Elena Vancea"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Color Tag & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Card Color Accent
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setColor(preset)}
                  className={`h-6 w-6 rounded-full transition transform ${
                    color === preset ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes / Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Bring laptop with Docker and GCC installed"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition"
            >
              {initialClass ? 'Save Changes' : 'Add to Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
