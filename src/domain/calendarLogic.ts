/**
 * Pure Domain Logic for Academic Calendar & Week Parity
 * Fully decoupled from React and UI rendering for high testability.
 */

import type {
  AcademicWeekInfo,
  ClassEvent,
  DayOfWeek,
  SemesterConfig,
  VacationPeriod,
} from './types.ts';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Normalizes date to midnight local time for robust day/week arithmetic
 */
export function normalizeDate(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Checks if a target date falls inside [startDate, endDate] inclusive
 */
export function isDateInInterval(
  target: Date,
  startDateStr: string,
  endDateStr: string
): boolean {
  const t = normalizeDate(target).getTime();
  const start = normalizeDate(startDateStr).getTime();
  const end = normalizeDate(endDateStr).getTime();
  return t >= start && t <= end;
}

/**
 * Finds if current date is inside an active vacation period
 */
export function findActiveVacation(
  date: Date,
  vacations: VacationPeriod[]
): VacationPeriod | undefined {
  return vacations.find((v) => isDateInInterval(date, v.startDate, v.endDate));
}

/**
 * Counts how many vacation weeks (in 7-day increments) have paused academic numbering
 * between semesterStart and targetDate.
 */
export function countVacationPausedDays(
  semesterStart: Date,
  targetDate: Date,
  vacations: VacationPeriod[]
): number {
  const normStart = normalizeDate(semesterStart).getTime();
  const normTarget = normalizeDate(targetDate).getTime();
  if (normTarget <= normStart) return 0;

  let pausedDays = 0;
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (const vac of vacations) {
    if (!vac.pauseWeekNumbering) continue;
    const vacStart = normalizeDate(vac.startDate).getTime();
    const vacEnd = normalizeDate(vac.endDate).getTime();

    // Overlap with [normStart, normTarget]
    const effectiveStart = Math.max(normStart, vacStart);
    const effectiveEnd = Math.min(normTarget, vacEnd);

    if (effectiveEnd >= effectiveStart) {
      // number of days in this vacation interval
      const days = Math.round((effectiveEnd - effectiveStart) / oneDayMs) + 1;
      pausedDays += days;
    }
  }

  return pausedDays;
}

/**
 * Computes exact academic week number, odd/even parity, and vacation state.
 */
export function getAcademicWeekInfo(
  currentDate: Date,
  config: SemesterConfig
): AcademicWeekInfo {
  const current = normalizeDate(currentDate);
  const semStart = normalizeDate(config.startDate);
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Active vacation check
  const activeVacation = findActiveVacation(current, config.vacations || []);
  const isVacation = Boolean(activeVacation);

  const diffMs = current.getTime() - semStart.getTime();
  const diffDays = Math.floor(diffMs / oneDayMs);

  if (diffDays < 0) {
    // Before semester starts
    return {
      isBeforeSemester: true,
      isAfterSemester: false,
      isVacation: false,
      weekNumber: 1,
      parity: config.initialWeekParity || 'odd',
      parityLabel:
        config.initialWeekParity === 'even' ? 'Even Week' : 'Odd Week',
      formattedLabel: `Pre-Semester (Starts ${config.startDate})`,
      semesterProgressPercent: 0,
      totalWeeks: config.totalWeeks,
    };
  }

  // Adjust for paused vacation days
  const pausedDays = countVacationPausedDays(
    semStart,
    current,
    config.vacations || []
  );
  const effectiveDays = Math.max(0, diffDays - pausedDays);
  const rawWeekNumber = Math.floor(effectiveDays / 7) + 1;

  const totalWeeks = config.totalWeeks || 14;
  const isAfterSemester = rawWeekNumber > totalWeeks;
  const weekNumber = Math.min(Math.max(1, rawWeekNumber), totalWeeks);

  // Parity computation
  const initialIsOdd = (config.initialWeekParity || 'odd') === 'odd';
  // If initial is odd: week 1 = odd, week 2 = even, week 3 = odd
  // If initial is even: week 1 = even, week 2 = odd, week 3 = even
  const isOddWeek =
    initialIsOdd ? weekNumber % 2 !== 0 : weekNumber % 2 === 0;
  const parity: 'odd' | 'even' = isOddWeek ? 'odd' : 'even';
  const parityLabel = isOddWeek ? 'Odd Week' : 'Even Week';

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((rawWeekNumber - 1) / totalWeeks) * 100))
  );

  let formattedLabel = `Week ${weekNumber} (${parityLabel})`;
  if (isVacation && activeVacation) {
    formattedLabel = `🌴 ${activeVacation.name} (Week ${weekNumber})`;
  } else if (isAfterSemester) {
    formattedLabel = `Semester Concluded (${totalWeeks} Weeks)`;
  }

  return {
    isBeforeSemester: false,
    isAfterSemester,
    isVacation,
    currentVacation: activeVacation,
    weekNumber,
    parity,
    parityLabel,
    formattedLabel,
    semesterProgressPercent: progressPercent,
    totalWeeks,
  };
}

/**
 * Check if a class is scheduled for a given academic week number and parity
 */
export function isClassActiveInWeek(
  cls: ClassEvent,
  weekNumber: number,
  parity: 'odd' | 'even'
): boolean {
  if (cls.recurrence === 'all') return true;
  if (cls.recurrence === 'odd') return parity === 'odd';
  if (cls.recurrence === 'even') return parity === 'even';
  return true;
}

/**
 * Filter classes by day and week parity
 */
export function filterClassesForDay(
  classes: ClassEvent[],
  day: DayOfWeek,
  weekNumber: number,
  parity: 'odd' | 'even'
): ClassEvent[] {
  return classes
    .filter((c) => c.day === day && isClassActiveInWeek(c, weekNumber, parity))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

/**
 * Get DayOfWeek from a Date object
 */
export function getDayOfWeekFromDate(date: Date): DayOfWeek {
  const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday...
  const map: Record<number, DayOfWeek> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  return map[dayIndex];
}

/**
 * Converts "HH:MM" to minutes from start of day
 */
export function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Finds the immediate next upcoming class from current time
 */
export function getNextUpcomingClass(
  classes: ClassEvent[],
  currentDate: Date,
  config: SemesterConfig
): {
  classEvent: ClassEvent;
  startsInMinutes: number;
  isToday: boolean;
  day: DayOfWeek;
} | null {
  const weekInfo = getAcademicWeekInfo(currentDate, config);
  if (weekInfo.isVacation) {
    return null; // No classes during vacation
  }

  const currentDay = getDayOfWeekFromDate(currentDate);
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  // First check today's classes
  const todayClasses = filterClassesForDay(
    classes,
    currentDay,
    weekInfo.weekNumber,
    weekInfo.parity
  );

  for (const c of todayClasses) {
    const startMin = timeStringToMinutes(c.startTime);
    if (startMin > currentMinutes) {
      return {
        classEvent: c,
        startsInMinutes: startMin - currentMinutes,
        isToday: true,
        day: currentDay,
      };
    }
  }

  // If none remaining today, check upcoming days in order
  const currentDayIdx = DAYS_OF_WEEK.indexOf(currentDay);
  for (let offset = 1; offset <= 7; offset++) {
    const nextDayIdx = (currentDayIdx + offset) % 7;
    const nextDay = DAYS_OF_WEEK[nextDayIdx];

    // If offset crosses into next week, calculate next week parity
    const targetDate = new Date(currentDate.getTime() + offset * 86400000);
    const targetWeekInfo = getAcademicWeekInfo(targetDate, config);
    if (targetWeekInfo.isVacation) continue;

    const dayClasses = filterClassesForDay(
      classes,
      nextDay,
      targetWeekInfo.weekNumber,
      targetWeekInfo.parity
    );

    if (dayClasses.length > 0) {
      const firstClass = dayClasses[0];
      const startMin = timeStringToMinutes(firstClass.startTime);
      const totalMinutes =
        offset * 24 * 60 - currentMinutes + startMin;
      return {
        classEvent: firstClass,
        startsInMinutes: totalMinutes,
        isToday: false,
        day: nextDay,
      };
    }
  }

  return null;
}
