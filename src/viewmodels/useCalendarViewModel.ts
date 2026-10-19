import { useEffect, useMemo, useState } from 'react';
import {
  AccentTheme,
  AppDataSchema,
  ClassEvent,
  ClassType,
  CountdownItem,
  DayOfWeek,
  NotificationSettings,
  PostcardNote,
  SemesterConfig,
  ThemeCustomization,
  VacationPeriod,
  WeekRecurrence,
} from '../domain/types.ts';
import {
  DAYS_OF_WEEK,
  filterClassesForDay,
  getAcademicWeekInfo,
  getNextUpcomingClass,
  moveClassToDay,
} from '../domain/calendarLogic.ts';
import { INITIAL_APP_DATA, INITIAL_POSTCARDS, INITIAL_THEME } from '../data/initialData.ts';

const STORAGE_KEY = 'unitrack_app_data_v1';

export function useCalendarViewModel() {
  const [semester, setSemester] = useState<SemesterConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppDataSchema;
        if (parsed.semester) return parsed.semester;
      }
    } catch {
      // ignore
    }
    return INITIAL_APP_DATA.semester;
  });

  const [classes, setClasses] = useState<ClassEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppDataSchema;
        if (Array.isArray(parsed.classes)) return parsed.classes;
      }
    } catch {
      // ignore
    }
    return INITIAL_APP_DATA.classes;
  });

  const [countdowns, setCountdowns] = useState<CountdownItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppDataSchema;
        if (Array.isArray(parsed.countdowns)) return parsed.countdowns;
      }
    } catch {
      // ignore
    }
    return INITIAL_APP_DATA.countdowns;
  });

  const [postcards, setPostcards] = useState<PostcardNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppDataSchema;
        if (Array.isArray(parsed.postcards)) return parsed.postcards;
      }
    } catch {
      // ignore
    }
    return INITIAL_POSTCARDS;
  });

  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppDataSchema;
        if (parsed.settings) return parsed.settings;
      }
    } catch {
      // ignore
    }
    return INITIAL_APP_DATA.settings;
  });

  const [theme, setTheme] = useState<ThemeCustomization>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppDataSchema;
        if (parsed.theme) return parsed.theme;
      }
    } catch {
      // ignore
    }
    return INITIAL_THEME;
  });

  // Apply theme accent color dynamically to body / html
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-accent', theme.accent);
  }, [theme.accent]);

  // Current live date & time
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Clock tick every 10 seconds for academic week & upcoming class
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Compute live academic week info for current date
  const currentAcademicWeek = useMemo(() => {
    return getAcademicWeekInfo(currentDate, semester);
  }, [currentDate, semester]);

  // Selected week view (defaults to current academic week)
  const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    const initial = getAcademicWeekInfo(new Date(), semester);
    return initial.weekNumber;
  });

  // Keep selected week in sync if user hasn't overridden or when semester changes
  useEffect(() => {
    if (selectedWeek > semester.totalWeeks) {
      setSelectedWeek(semester.totalWeeks);
    }
  }, [semester.totalWeeks, selectedWeek]);

  // Compute parity for currently viewed week
  const selectedWeekParity: 'odd' | 'even' = useMemo(() => {
    const initialIsOdd = (semester.initialWeekParity || 'odd') === 'odd';
    const isOdd = initialIsOdd ? selectedWeek % 2 !== 0 : selectedWeek % 2 === 0;
    return isOdd ? 'odd' : 'even';
  }, [selectedWeek, semester.initialWeekParity]);

  // Filters
  const [parityOverride, setParityOverride] = useState<'auto' | 'odd' | 'even' | 'all'>('auto');
  const [selectedDayFilter, setSelectedDayFilter] = useState<DayOfWeek | 'all'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ClassType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Effective parity to render
  const effectiveParity: 'odd' | 'even' | 'all' =
    parityOverride === 'auto' ? selectedWeekParity : parityOverride;

  // Next upcoming class
  const nextUpcoming = useMemo(() => {
    return getNextUpcomingClass(classes, currentDate, semester);
  }, [classes, currentDate, semester]);

  // Filtered classes organized by day
  const timetableByDay = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result: Record<DayOfWeek, ClassEvent[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    for (const day of DAYS_OF_WEEK) {
      if (selectedDayFilter !== 'all' && selectedDayFilter !== day) {
        result[day] = [];
        continue;
      }

      let dayClasses = classes.filter((c) => c.day === day);

      // Parity filter
      if (effectiveParity !== 'all') {
        dayClasses = dayClasses.filter((c) => {
          if (c.recurrence === 'all') return true;
          return c.recurrence === effectiveParity;
        });
      }

      // Type filter
      if (selectedTypeFilter !== 'all') {
        dayClasses = dayClasses.filter((c) => c.type === selectedTypeFilter);
      }

      // Search query filter
      if (query) {
        dayClasses = dayClasses.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query) ||
            c.room.toLowerCase().includes(query) ||
            (c.professor && c.professor.toLowerCase().includes(query))
        );
      }

      result[day] = dayClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    return result;
  }, [classes, selectedDayFilter, effectiveParity, selectedTypeFilter, searchQuery]);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    const dataToSave: AppDataSchema = {
      version: '1.0.0',
      appName: 'UniTrack University Calendar',
      lastUpdated: new Date().toISOString(),
      semester,
      classes,
      countdowns,
      postcards,
      settings,
      theme,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // storage full or disabled
    }
  }, [semester, classes, countdowns, postcards, settings, theme]);

  // Class CRUD actions
  const addClass = (newClass: Omit<ClassEvent, 'id'>) => {
    const id = 'cls-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setClasses((prev) => [...prev, { ...newClass, id }]);
  };

  const updateClass = (updated: ClassEvent) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  // Drag and Drop move class to another day or update times
  const moveClass = (
    classId: string,
    targetDay: DayOfWeek,
    newStartTime?: string,
    newEndTime?: string
  ) => {
    setClasses((prev) =>
      moveClassToDay(prev, classId, targetDay, newStartTime, newEndTime)
    );
  };

  // Postcard Notes actions
  const addPostcard = (note: Omit<PostcardNote, 'id' | 'createdAt'>) => {
    const id = 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setPostcards((prev) => [
      {
        ...note,
        id,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updatePostcard = (updated: PostcardNote) => {
    setPostcards((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const deletePostcard = (id: string) => {
    setPostcards((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePostcardPin = (id: string) => {
    setPostcards((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const toggleChecklistItem = (postcardId: string, itemId: string) => {
    setPostcards((prev) =>
      prev.map((n) => {
        if (n.id !== postcardId || !n.checklist) return n;
        return {
          ...n,
          checklist: n.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          ),
        };
      })
    );
  };

  // Vacation CRUD actions
  const addVacation = (vac: Omit<VacationPeriod, 'id'>) => {
    const id = 'vac-' + Date.now();
    setSemester((prev) => ({
      ...prev,
      vacations: [...prev.vacations, { ...vac, id }],
    }));
  };

  const deleteVacation = (id: string) => {
    setSemester((prev) => ({
      ...prev,
      vacations: prev.vacations.filter((v) => v.id !== id),
    }));
  };

  const updateSemester = (updated: SemesterConfig) => {
    setSemester(updated);
  };

  // Export JSON
  const exportToJson = () => {
    const exportData: AppDataSchema = {
      version: '1.0.0',
      appName: 'UniTrack University Calendar',
      lastUpdated: new Date().toISOString(),
      semester,
      classes,
      countdowns,
      postcards,
      settings,
      theme,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `unitrack_schedule_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const importFromJson = (jsonContent: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonContent) as Partial<AppDataSchema>;
      if (!parsed.semester || !Array.isArray(parsed.classes)) {
        return {
          success: false,
          message: 'Invalid schedule file format. Missing semester or classes data.',
        };
      }

      setSemester(parsed.semester);
      setClasses(parsed.classes);
      if (Array.isArray(parsed.countdowns)) {
        setCountdowns(parsed.countdowns);
      }
      if (Array.isArray(parsed.postcards)) {
        setPostcards(parsed.postcards);
      }
      if (parsed.settings) {
        setSettings(parsed.settings);
      }
      if (parsed.theme) {
        setTheme(parsed.theme);
      }

      return {
        success: true,
        message: `Imported ${parsed.classes.length} classes, ${parsed.countdowns?.length || 0} countdowns, and ${parsed.postcards?.length || 0} notes!`,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Could not parse JSON file: ' + (err instanceof Error ? err.message : String(err)),
      };
    }
  };

  const resetToSampleData = () => {
    setSemester(INITIAL_APP_DATA.semester);
    setClasses(INITIAL_APP_DATA.classes);
    setCountdowns(INITIAL_APP_DATA.countdowns);
    setPostcards(INITIAL_POSTCARDS);
    setSettings(INITIAL_APP_DATA.settings);
    setTheme(INITIAL_THEME);
  };

  return {
    semester,
    classes,
    countdowns,
    setCountdowns,
    postcards,
    setPostcards,
    settings,
    setSettings,
    theme,
    setTheme,
    currentDate,
    currentAcademicWeek,
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
    timetableByDay,
    nextUpcoming,
    addClass,
    updateClass,
    deleteClass,
    moveClass,
    addPostcard,
    updatePostcard,
    deletePostcard,
    togglePostcardPin,
    toggleChecklistItem,
    addVacation,
    deleteVacation,
    updateSemester,
    exportToJson,
    importFromJson,
    resetToSampleData,
  };
}
