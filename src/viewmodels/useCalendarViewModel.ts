import { useEffect, useMemo, useState } from 'react';
import {
  AppDataSchema,
  ClassEvent,
  ClassType,
  CountdownItem,
  DayOfWeek,
  NotificationSettings,
  SemesterConfig,
  VacationPeriod,
  WeekRecurrence,
} from '../domain/types.ts';
import {
  DAYS_OF_WEEK,
  filterClassesForDay,
  getAcademicWeekInfo,
  getNextUpcomingClass,
} from '../domain/calendarLogic.ts';
import { INITIAL_APP_DATA } from '../data/initialData.ts';

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
      settings,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // storage full or disabled
    }
  }, [semester, classes, countdowns, settings]);

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
      settings,
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
      if (parsed.settings) {
        setSettings(parsed.settings);
      }

      return {
        success: true,
        message: `Imported ${parsed.classes.length} classes and ${parsed.countdowns?.length || 0} countdowns successfully!`,
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
    setSettings(INITIAL_APP_DATA.settings);
  };

  return {
    semester,
    classes,
    countdowns,
    setCountdowns,
    settings,
    setSettings,
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
    addVacation,
    deleteVacation,
    updateSemester,
    exportToJson,
    importFromJson,
    resetToSampleData,
  };
}
