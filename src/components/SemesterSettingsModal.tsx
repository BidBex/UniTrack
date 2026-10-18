import React, { useState } from 'react';
import {
  Calendar,
  Palmtree,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SemesterConfig, VacationPeriod } from '../domain/types.ts';

interface SemesterSettingsModalProps {
  semester: SemesterConfig;
  onUpdateSemester: (config: SemesterConfig) => void;
  onAddVacation: (vac: Omit<VacationPeriod, 'id'>) => void;
  onDeleteVacation: (id: string) => void;
  onResetToSampleData: () => void;
}

export const SemesterSettingsModal: React.FC<SemesterSettingsModalProps> = ({
  semester,
  onUpdateSemester,
  onAddVacation,
  onDeleteVacation,
  onResetToSampleData,
}) => {
  const [name, setName] = useState(semester.name);
  const [startDate, setStartDate] = useState(semester.startDate);
  const [totalWeeks, setTotalWeeks] = useState(semester.totalWeeks || 14);
  const [initialParity, setInitialParity] = useState<'odd' | 'even'>(
    semester.initialWeekParity || 'odd'
  );

  // New vacation form state
  const [vacName, setVacName] = useState('');
  const [vacStart, setVacStart] = useState('');
  const [vacEnd, setVacEnd] = useState('');
  const [pauseNumbering, setPauseNumbering] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSemester({
      ...semester,
      name,
      startDate,
      totalWeeks: Number(totalWeeks),
      initialWeekParity: initialParity,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacName.trim() || !vacStart || !vacEnd) return;

    onAddVacation({
      name: vacName.trim(),
      startDate: vacStart,
      endDate: vacEnd,
      pauseWeekNumbering: pauseNumbering,
    });

    setVacName('');
    setVacStart('');
    setVacEnd('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Semester Configuration */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Semester Academic Configuration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set semester starting date, total weeks, and week 1 parity.
            </p>
          </div>
          {savedMessage && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Check className="h-3.5 w-3.5" />
              Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveGeneral} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Start Date (First Monday)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:bg-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Academic Weeks (e.g. 14, 16)
              </label>
              <input
                type="number"
                min="6"
                max="24"
                value={totalWeeks}
                onChange={(e) => setTotalWeeks(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:bg-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Week 1 Starting Parity
              </label>
              <select
                value={initialParity}
                onChange={(e) => setInitialParity(e.target.value as 'odd' | 'even')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:bg-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="odd">Odd Week (Week 1 is Odd, Week 2 is Even)</option>
                <option value="even">Even Week (Week 1 is Even, Week 2 is Odd)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              Update Semester Settings
            </button>
          </div>
        </form>
      </div>

      {/* Vacations & Holidays Management */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palmtree className="h-5 w-5 text-emerald-600" />
            Vacations, Holidays & Reading Weeks
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            During vacations, classes are marked as paused. You can also configure whether the academic week counter freezes during the break.
          </p>
        </div>

        {/* Existing Vacations List */}
        <div className="mt-5 space-y-3">
          {semester.vacations.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">No vacation periods added yet.</p>
          ) : (
            semester.vacations.map((vac) => (
              <div
                key={vac.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    🌴 {vac.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {vac.startDate} to {vac.endDate} •{' '}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {vac.pauseWeekNumbering ? 'Pauses Academic Week Counter' : 'Counting continues'}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => onDeleteVacation(vac.id)}
                  className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/40"
                  title="Remove vacation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Vacation Form */}
        <form onSubmit={handleAddVacation} className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            + Add Vacation Period
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Vacation Name
              </label>
              <input
                type="text"
                placeholder="e.g. Winter Break"
                value={vacName}
                onChange={(e) => setVacName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={vacStart}
                onChange={(e) => setVacStart(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={vacEnd}
                onChange={(e) => setVacEnd(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={pauseNumbering}
                onChange={(e) => setPauseNumbering(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span>Freeze academic week numbering during this vacation</span>
            </label>

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
            >
              Add Vacation
            </button>
          </div>
        </form>
      </div>

      {/* Preset Data Restore */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Restore Sample Curriculum & Deadlines
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Resets timetable to the complete Computer Science & Engineering demo with lectures, labs, and seminaries.
          </p>
        </div>
        <button
          onClick={onResetToSampleData}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Demo Data</span>
        </button>
      </div>
    </div>
  );
};
