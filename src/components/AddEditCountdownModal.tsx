import React, { useState } from 'react';
import { X, Clock, Calendar, CheckSquare, Award, Link2 } from 'lucide-react';
import { CountdownCategory, CountdownItem } from '../domain/types.ts';

interface AddEditCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<CountdownItem, 'id' | 'completed'>, id?: string) => void;
  initialItem?: CountdownItem | null;
}

export const AddEditCountdownModal: React.FC<AddEditCountdownModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
}) => {
  if (!isOpen) return null;

  // Defaults
  const defaultDueDate = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16);
  const defaultStartDate = new Date().toISOString().slice(0, 16);

  const [title, setTitle] = useState(initialItem?.title || '');
  const [category, setCategory] = useState<CountdownCategory>(
    initialItem?.category || 'exam'
  );
  const [courseCode, setCourseCode] = useState(initialItem?.courseCode || '');
  const [startDate, setStartDate] = useState(initialItem?.startDate || defaultStartDate);
  const [dueDate, setDueDate] = useState(initialItem?.dueDate || defaultDueDate);
  const [weightPercent, setWeightPercent] = useState<number | ''>(
    initialItem?.weightPercent ?? ''
  );
  const [locationOrLink, setLocationOrLink] = useState(
    initialItem?.locationOrLink || ''
  );
  const [notes, setNotes] = useState(initialItem?.notes || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    onSave(
      {
        title: title.trim(),
        category,
        courseCode: courseCode.trim().toUpperCase() || undefined,
        startDate,
        dueDate,
        weightPercent: weightPercent === '' ? undefined : Number(weightPercent),
        locationOrLink: locationOrLink.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      initialItem?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initialItem ? 'Edit Exam / Deadline' : 'Add University Countdown'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track exams, homeworks, and project due dates with progress bars
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title / Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Data Structures Midterm Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CountdownCategory)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="exam">Exam (Midterm / Final)</option>
                <option value="assignment">Assignment / Homework</option>
                <option value="project">Project / Laboratory Work</option>
                <option value="presentation">Presentation / Defense</option>
                <option value="deadline">Administrative Deadline</option>
                <option value="other">Other Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. CS201"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs uppercase text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start / Announced Date (For Progress Bar)
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date & Time *
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grade Weight % (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 35 (%)"
                value={weightPercent}
                onChange={(e) =>
                  setWeightPercent(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location or Submission Link
              </label>
              <input
                type="text"
                placeholder="Amphitheater 1 / Moodle URL"
                value={locationOrLink}
                onChange={(e) => setLocationOrLink(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes / Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Allowed 1 sheet cheat sheet, calculator, and blue pen."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

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
              {initialItem ? 'Save Changes' : 'Start Countdown'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
