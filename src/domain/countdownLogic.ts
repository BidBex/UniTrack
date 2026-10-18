/**
 * Pure Domain Logic for Visual Progress Bar Countdowns & Deadlines
 */

import type { CountdownItem, CountdownProgress } from './types.ts';

/**
 * Calculates countdown metrics and visual progress percentage
 */
export function calculateCountdownProgress(
  item: CountdownItem,
  currentDate: Date = new Date()
): CountdownProgress {
  if (item.completed) {
    return {
      progressPercent: 100,
      totalDurationMs: 0,
      elapsedMs: 0,
      remainingMs: 0,
      isOverdue: false,
      isCompleted: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
      humanFormatted: 'Completed',
      urgency: 'done',
    };
  }

  const now = currentDate.getTime();
  const due = new Date(item.dueDate).getTime();

  // If no start date specified or invalid, assume 14 days prior to due date for visual progress
  let start = item.startDate ? new Date(item.startDate).getTime() : 0;
  if (!start || isNaN(start) || start >= due) {
    start = due - 14 * 24 * 60 * 60 * 1000;
  }

  const totalDuration = Math.max(1000, due - start);
  const remaining = due - now;
  const elapsed = Math.max(0, now - start);

  const isOverdue = remaining <= 0;

  // Progress bar percentage: 0% at start, 100% when due
  let progressPercent: number;
  if (isOverdue) {
    progressPercent = 100;
  } else {
    progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  const absRemaining = Math.max(0, remaining);
  const totalSeconds = Math.floor(absRemaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let humanFormatted = '';
  if (isOverdue) {
    const overdueSeconds = Math.floor(Math.abs(remaining) / 1000);
    const oDays = Math.floor(overdueSeconds / 86400);
    const oHours = Math.floor((overdueSeconds % 86400) / 3600);
    humanFormatted = oDays > 0 ? `Overdue by ${oDays}d ${oHours}h` : `Overdue by ${oHours}h`;
  } else if (days > 0) {
    humanFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    humanFormatted = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    humanFormatted = `${minutes}m ${seconds}s`;
  }

  let urgency: 'critical' | 'warning' | 'normal' | 'done' = 'normal';
  if (isOverdue || remaining < 24 * 60 * 60 * 1000) {
    urgency = 'critical';
  } else if (remaining < 3 * 24 * 60 * 60 * 1000) {
    urgency = 'warning';
  }

  return {
    progressPercent: Math.round(progressPercent * 10) / 10,
    totalDurationMs: totalDuration,
    elapsedMs: elapsed,
    remainingMs: remaining,
    isOverdue,
    isCompleted: false,
    daysRemaining: days,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    secondsRemaining: seconds,
    humanFormatted,
    urgency,
  };
}

/**
 * Sorts countdowns by urgency: critical/overdue first, then soonest deadline
 */
export function sortCountdowns(items: CountdownItem[], currentDate: Date = new Date()): CountdownItem[] {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const aDue = new Date(a.dueDate).getTime();
    const bDue = new Date(b.dueDate).getTime();
    return aDue - bDue;
  });
}
