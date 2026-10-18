import { useEffect, useMemo, useState } from 'react';
import { CountdownCategory, CountdownItem } from '../domain/types.ts';
import { calculateCountdownProgress, sortCountdowns } from '../domain/countdownLogic.ts';

export function useCountdownsViewModel(
  countdowns: CountdownItem[],
  setCountdowns: React.Dispatch<React.SetStateAction<CountdownItem[]>>
) {
  // Live ticking date/time (ticks every 1s for accurate seconds countdown)
  const [currentTick, setCurrentTick] = useState<Date>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<CountdownCategory | 'all' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTick(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute progress for all countdown items
  const itemsWithProgress = useMemo(() => {
    return countdowns.map((item) => {
      const progress = calculateCountdownProgress(item, currentTick);
      return {
        item,
        progress,
      };
    });
  }, [countdowns, currentTick]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = itemsWithProgress;

    if (categoryFilter === 'completed') {
      result = result.filter((x) => x.item.completed);
    } else if (categoryFilter !== 'all') {
      result = result.filter((x) => !x.item.completed && x.item.category === categoryFilter);
    } else {
      // Show all uncompleted first, completed at the bottom
    }

    if (query) {
      result = result.filter(
        (x) =>
          x.item.title.toLowerCase().includes(query) ||
          (x.item.courseCode && x.item.courseCode.toLowerCase().includes(query)) ||
          (x.item.notes && x.item.notes.toLowerCase().includes(query))
      );
    }

    // Sort: uncompleted soonest first, then completed
    return [...result].sort((a, b) => {
      if (a.item.completed !== b.item.completed) {
        return a.item.completed ? 1 : -1;
      }
      return a.progress.remainingMs - b.progress.remainingMs;
    });
  }, [itemsWithProgress, categoryFilter, searchQuery]);

  // Counts summary
  const summary = useMemo(() => {
    const active = itemsWithProgress.filter((x) => !x.item.completed);
    const critical = active.filter((x) => x.progress.urgency === 'critical').length;
    const warning = active.filter((x) => x.progress.urgency === 'warning').length;
    const completed = itemsWithProgress.filter((x) => x.item.completed).length;
    return {
      total: countdowns.length,
      active: active.length,
      critical,
      warning,
      completed,
    };
  }, [itemsWithProgress, countdowns.length]);

  const addCountdown = (newItem: Omit<CountdownItem, 'id' | 'completed'>) => {
    const id = 'cd-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setCountdowns((prev) => [...prev, { ...newItem, id, completed: false }]);
  };

  const updateCountdown = (updated: CountdownItem) => {
    setCountdowns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCountdown = (id: string) => {
    setCountdowns((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setCountdowns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  return {
    currentTick,
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
  };
}
