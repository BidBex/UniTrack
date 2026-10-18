/**
 * Academic Calendar & Deadline Domain Types
 * Decoupled clean architecture definitions
 */

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ClassType =
  | 'lecture'
  | 'laboratory'
  | 'seminary'
  | 'workshop'
  | 'consultation'
  | 'exam';

export type WeekRecurrence = 'all' | 'odd' | 'even';

export interface ClassEvent {
  id: string;
  title: string;
  code: string; // e.g. "CS201", "MATH102"
  type: ClassType;
  day: DayOfWeek;
  startTime: string; // "HH:MM", e.g. "08:30"
  endTime: string; // "HH:MM", e.g. "10:00"
  professor?: string;
  room: string; // e.g. "Room 304, Tech Wing"
  recurrence: WeekRecurrence; // all, odd, or even
  color: string; // hex code or tailwind preset
  notes?: string;
}

export interface VacationPeriod {
  id: string;
  name: string; // e.g. "Winter Break", "Mid-term Recess"
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  pauseWeekNumbering: boolean; // if true, academic week number pauses
}

export interface SemesterConfig {
  name: string; // e.g. "Autumn Semester 2026/2027"
  startDate: string; // "YYYY-MM-DD"
  totalWeeks: number; // e.g. 14, 16
  initialWeekParity: 'odd' | 'even'; // Week 1 parity (standard: odd)
  vacations: VacationPeriod[];
}

export type CountdownCategory =
  | 'exam'
  | 'assignment'
  | 'project'
  | 'presentation'
  | 'deadline'
  | 'other';

export interface CountdownItem {
  id: string;
  title: string;
  category: CountdownCategory;
  courseCode?: string;
  startDate: string; // "YYYY-MM-DDTHH:MM" or ISO
  dueDate: string; // "YYYY-MM-DDTHH:MM" or ISO
  weightPercent?: number; // e.g. 40 (%)
  locationOrLink?: string;
  completed: boolean;
  notes?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  classAlertMinutes: number; // e.g. 15
  deadlineAlertDays: number[]; // e.g. [3, 1]
  soundEnabled: boolean;
}

export interface AcademicWeekInfo {
  isBeforeSemester: boolean;
  isAfterSemester: boolean;
  isVacation: boolean;
  currentVacation?: VacationPeriod;
  weekNumber: number; // 1-indexed (e.g. 1 to 14)
  parity: 'odd' | 'even';
  parityLabel: string; // "Odd Week" | "Even Week"
  formattedLabel: string; // "Week 4 (Even Week)"
  semesterProgressPercent: number; // 0 to 100
  totalWeeks: number;
}

export interface CountdownProgress {
  progressPercent: number; // 0 - 100
  totalDurationMs: number;
  elapsedMs: number;
  remainingMs: number;
  isOverdue: boolean;
  isCompleted: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  humanFormatted: string; // "3d 14h 22m 10s"
  urgency: 'critical' | 'warning' | 'normal' | 'done';
}

export interface AppDataSchema {
  version: string;
  appName: string;
  lastUpdated: string;
  semester: SemesterConfig;
  classes: ClassEvent[];
  countdowns: CountdownItem[];
  settings: NotificationSettings;
}
