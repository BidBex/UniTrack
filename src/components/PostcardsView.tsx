import React, { useMemo, useState } from 'react';
import {
  StickyNote,
  Plus,
  Pin,
  Trash2,
  Edit2,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Tag,
  Palette,
} from 'lucide-react';
import { PostcardColor, PostcardNote } from '../domain/types.ts';
import { AddEditPostcardModal } from './AddEditPostcardModal.tsx';

interface PostcardsViewProps {
  postcards: PostcardNote[];
  onAddPostcard: (note: Omit<PostcardNote, 'id' | 'createdAt'>) => void;
  onUpdatePostcard: (note: PostcardNote) => void;
  onDeletePostcard: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleChecklist: (postcardId: string, itemId: string) => void;
}

export const PostcardsView: React.FC<PostcardsViewProps> = ({
  postcards,
  onAddPostcard,
  onUpdatePostcard,
  onDeletePostcard,
  onTogglePin,
  onToggleChecklist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<PostcardNote | null>(null);

  // Collect unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    postcards.forEach((n) => {
      if (n.tag) set.add(n.tag);
    });
    return Array.from(set);
  }, [postcards]);

  // Filtered and sorted: pinned first, then newest
  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return postcards
      .filter((n) => {
        if (selectedTag !== 'all' && n.tag !== selectedTag) return false;
        if (!q) return true;
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.tag && n.tag.toLowerCase().includes(q)) ||
          n.checklist?.some((c) => c.text.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [postcards, selectedTag, searchQuery]);

  const getColorClasses = (color: PostcardColor) => {
    switch (color) {
      case 'yellow':
        return {
          card: 'bg-amber-100/90 text-amber-950 border-amber-300 dark:bg-amber-950/70 dark:text-amber-100 dark:border-amber-800/80 shadow-amber-900/5',
          tape: 'bg-amber-200/80 dark:bg-amber-800/50',
          accent: 'text-amber-800 dark:text-amber-300',
        };
      case 'pink':
        return {
          card: 'bg-pink-100/90 text-pink-950 border-pink-300 dark:bg-pink-950/70 dark:text-pink-100 dark:border-pink-800/80 shadow-pink-900/5',
          tape: 'bg-pink-200/80 dark:bg-pink-800/50',
          accent: 'text-pink-800 dark:text-pink-300',
        };
      case 'green':
        return {
          card: 'bg-emerald-100/90 text-emerald-950 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-100 dark:border-emerald-800/80 shadow-emerald-900/5',
          tape: 'bg-emerald-200/80 dark:bg-emerald-800/50',
          accent: 'text-emerald-800 dark:text-emerald-300',
        };
      case 'blue':
        return {
          card: 'bg-sky-100/90 text-sky-950 border-sky-300 dark:bg-sky-950/70 dark:text-sky-100 dark:border-sky-800/80 shadow-sky-900/5',
          tape: 'bg-sky-200/80 dark:bg-sky-800/50',
          accent: 'text-sky-800 dark:text-sky-300',
        };
      case 'purple':
        return {
          card: 'bg-purple-100/90 text-purple-950 border-purple-300 dark:bg-purple-950/70 dark:text-purple-100 dark:border-purple-800/80 shadow-purple-900/5',
          tape: 'bg-purple-200/80 dark:bg-purple-800/50',
          accent: 'text-purple-800 dark:text-purple-300',
        };
      case 'orange':
        return {
          card: 'bg-orange-100/90 text-orange-950 border-orange-300 dark:bg-orange-950/70 dark:text-orange-100 dark:border-orange-800/80 shadow-orange-900/5',
          tape: 'bg-orange-200/80 dark:bg-orange-800/50',
          accent: 'text-orange-800 dark:text-orange-300',
        };
      default:
        return {
          card: 'bg-amber-100/90 text-amber-950 border-amber-300 dark:bg-amber-950/70 dark:text-amber-100 dark:border-amber-800/80',
          tape: 'bg-amber-200/80',
          accent: 'text-amber-800',
        };
    }
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEdit = (note: PostcardNote) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSave = (
    data: Omit<PostcardNote, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (id && editingNote) {
      onUpdatePostcard({ ...editingNote, ...data });
    } else {
      onAddPostcard(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <StickyNote className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Campus Postcards & Sticky Notes Board
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Pin office hours, study checklists, discord links, and quick study reminders on your virtual corkboard.
          </p>
        </div>

        {/* Filter and Add Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search postcards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 sm:w-56 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Postcard</span>
          </button>
        </div>
      </div>

      {/* Category Tags Pills */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <button
            onClick={() => setSelectedTag('all')}
            className={`rounded-lg px-3 py-1 font-medium transition ${
              selectedTag === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            All Notes ({postcards.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                selectedTag === tag
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Postcards Grid / Corkboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-800">
            <StickyNote className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Your postcard board is clear!
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Add your first sticky note, formula reminder, or office hour card.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600"
            >
              + Stick a Note
            </button>
          </div>
        ) : (
          filteredNotes.map((note, index) => {
            const styling = getColorClasses(note.color);
            // Slight natural rotation for authentic post-it aesthetic
            const rotations = ['rotate-[-0.6deg]', 'rotate-[0.5deg]', 'rotate-[-0.8deg]', 'rotate-[0.7deg]'];
            const rotClass = rotations[index % rotations.length];

            return (
              <div
                key={note.id}
                className={`relative group rounded-2xl border p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-200 flex flex-col justify-between ${styling.card} ${rotClass}`}
              >
                {/* Tape / Pin decoration at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  {note.isPinned ? (
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md cursor-pointer hover:scale-110 transition"
                      onClick={() => onTogglePin(note.id)}
                      title="Unpin note"
                    >
                      <Pin className="h-3.5 w-3.5 fill-current" />
                    </div>
                  ) : (
                    <div
                      className={`h-4 w-16 rounded-xs opacity-75 shadow-xs border border-white/20 cursor-pointer ${styling.tape}`}
                      onClick={() => onTogglePin(note.id)}
                      title="Click to pin note"
                    />
                  )}
                </div>

                <div>
                  {/* Card Header: Tag & Actions */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                      {note.tag ? `#${note.tag}` : 'Note'}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onTogglePin(note.id)}
                        className={`p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-xs ${
                          note.isPinned ? 'text-red-500 font-bold' : 'opacity-70'
                        }`}
                        title={note.isPinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100"
                        title="Edit note"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDeletePostcard(note.id)}
                        className="p-1 rounded-md hover:bg-red-500/20 text-red-600 dark:text-red-400 opacity-70 hover:opacity-100"
                        title="Delete note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <h3 className="text-sm font-extrabold leading-snug tracking-tight mb-2">
                    {note.title}
                  </h3>

                  {note.content && (
                    <p className="text-xs whitespace-pre-wrap leading-relaxed opacity-90 mb-3 font-normal">
                      {note.content}
                    </p>
                  )}

                  {/* Checklist if present */}
                  {note.checklist && note.checklist.length > 0 && (
                    <div className="space-y-1.5 mt-2 pt-2 border-t border-black/10 dark:border-white/10 text-xs">
                      {note.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onToggleChecklist(note.id, item.id)}
                          className="flex items-start gap-2 cursor-pointer select-none group/item"
                        >
                          {item.done ? (
                            <CheckSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="h-3.5 w-3.5 opacity-50 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`${
                              item.done ? 'line-through opacity-50' : 'opacity-90'
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer date */}
                <div className="mt-4 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] opacity-60">
                  <span>
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {note.isPinned && <span className="font-bold text-red-600 dark:text-red-400">Pinned</span>}
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddEditPostcardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialNote={editingNote}
      />
    </div>
  );
};
