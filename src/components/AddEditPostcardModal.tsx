import React, { useState } from 'react';
import { X, StickyNote, Plus, Trash2, Pin } from 'lucide-react';
import { ChecklistItem, PostcardColor, PostcardNote } from '../domain/types.ts';

interface AddEditPostcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<PostcardNote, 'id' | 'createdAt'>, id?: string) => void;
  initialNote?: PostcardNote | null;
}

const POSTCARD_COLORS: { id: PostcardColor; label: string; bg: string; border: string }[] = [
  { id: 'yellow', label: 'Canary Yellow', bg: 'bg-amber-200', border: 'border-amber-400' },
  { id: 'pink', label: 'Pastel Rose', bg: 'bg-pink-200', border: 'border-pink-400' },
  { id: 'green', label: 'Mint Green', bg: 'bg-emerald-200', border: 'border-emerald-400' },
  { id: 'blue', label: 'Sky Blue', bg: 'bg-sky-200', border: 'border-sky-400' },
  { id: 'purple', label: 'Lavender', bg: 'bg-purple-200', border: 'border-purple-400' },
  { id: 'orange', label: 'Warm Peach', bg: 'bg-orange-200', border: 'border-orange-400' },
];

export const AddEditPostcardModal: React.FC<AddEditPostcardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNote,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [color, setColor] = useState<PostcardColor>(initialNote?.color || 'yellow');
  const [tag, setTag] = useState(initialNote?.tag || '');
  const [isPinned, setIsPinned] = useState(initialNote?.isPinned || false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    initialNote?.checklist || []
  );
  const [newChecklistText, setNewChecklistText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: 'chk-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
      text: newChecklistText.trim(),
      done: false,
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError('Please provide a title or content for your postcard note.');
      return;
    }

    onSave(
      {
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        color,
        isPinned,
        tag: tag.trim() || undefined,
        checklist: checklist.length > 0 ? checklist : undefined,
      },
      initialNote?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <StickyNote className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initialNote ? 'Edit Postcard Note' : 'New Postcard Note'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a colorful sticky note or checklist for quick recall
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
          <div className="mt-3 rounded-xl bg-red-50 p-2.5 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Note Title
            </label>
            <input
              type="text"
              placeholder="e.g. Formulas to Memorize, Office Hours..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Note Content
            </label>
            <textarea
              rows={3}
              placeholder="Write your study notes, reminders, or references here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Color Picker & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Postcard Paper Color
              </label>
              <div className="flex items-center gap-2">
                {POSTCARD_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`h-7 w-7 rounded-full transition transform ${c.bg} ${
                      color === c.id
                        ? 'ring-2 ring-slate-900 dark:ring-white scale-110 shadow-sm'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Advising, Library, Study..."
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Checklist Tasks (Optional)
            </label>
            <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1 text-xs dark:bg-slate-800"
                >
                  <span className="text-slate-700 dark:text-slate-300 truncate">
                    • {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-slate-400 hover:text-red-500 p-0.5"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add checklist item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Pin to Top Checkbox */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <Pin className="h-3.5 w-3.5 text-red-500" />
                Pin to top of postcard board
              </span>
            </label>
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
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              {initialNote ? 'Save Postcard' : 'Stick Postcard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
