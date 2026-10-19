import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAcademicWeekInfo,
  isClassActiveInWeek,
  filterClassesForDay,
  countVacationPausedDays,
  getNextUpcomingClass,
  moveClassToDay,
  calculateSemesterTimeline,
} from './calendarLogic.ts';
import { calculateCountdownProgress } from './countdownLogic.ts';
import type { ClassEvent, CountdownItem, SemesterConfig } from './types.ts';

const mockSemester: SemesterConfig = {
  name: 'Autumn 2026',
  startDate: '2026-10-05', // Monday, Week 1
  totalWeeks: 14,
  initialWeekParity: 'odd',
  vacations: [
    {
      id: 'vac-1',
      name: 'Autumn Reading Break',
      startDate: '2026-10-26', // Week 4 Monday
      endDate: '2026-11-01',   // Week 4 Sunday (7 days)
      pauseWeekNumbering: true,
    },
  ],
};

test('Week 1 calculates as Odd week on start date', () => {
  const date = new Date('2026-10-05T10:00:00');
  const info = getAcademicWeekInfo(date, mockSemester);
  assert.equal(info.weekNumber, 1);
  assert.equal(info.parity, 'odd');
  assert.equal(info.isVacation, false);
});

test('Week 2 calculates as Even week 7 days later', () => {
  const date = new Date('2026-10-12T10:00:00');
  const info = getAcademicWeekInfo(date, mockSemester);
  assert.equal(info.weekNumber, 2);
  assert.equal(info.parity, 'even');
  assert.equal(info.isVacation, false);
});

test('Vacation week is properly detected', () => {
  const date = new Date('2026-10-28T10:00:00'); // Inside Autumn Reading Break
  const info = getAcademicWeekInfo(date, mockSemester);
  assert.equal(info.isVacation, true);
  assert.equal(info.currentVacation?.name, 'Autumn Reading Break');
});

test('Academic week pauses numbering across vacation', () => {
  // Before vacation: Week 3 (2026-10-19)
  const preVac = getAcademicWeekInfo(new Date('2026-10-19T10:00:00'), mockSemester);
  assert.equal(preVac.weekNumber, 3);
  assert.equal(preVac.parity, 'odd');

  // Immediately after 1-week paused vacation (2026-11-02, which is 4 weeks after start, but 1 week paused)
  const postVac = getAcademicWeekInfo(new Date('2026-11-02T10:00:00'), mockSemester);
  assert.equal(postVac.weekNumber, 4);
  assert.equal(postVac.parity, 'even');
  assert.equal(postVac.isVacation, false);
});

test('Class recurrence correctly filters by week parity', () => {
  const lectureEveryWeek: ClassEvent = {
    id: 'c1',
    title: 'Algorithms',
    code: 'CS201',
    type: 'lecture',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Amphitheater 1',
    recurrence: 'all',
    color: '#4f46e5',
  };

  const labOddWeeks: ClassEvent = {
    id: 'c2',
    title: 'Algorithms Lab',
    code: 'CS201L',
    type: 'laboratory',
    day: 'Monday',
    startTime: '11:00',
    endTime: '13:00',
    room: 'Lab 302',
    recurrence: 'odd',
    color: '#059669',
  };

  const seminarEvenWeeks: ClassEvent = {
    id: 'c3',
    title: 'Algorithms Seminar',
    code: 'CS201S',
    type: 'seminary',
    day: 'Monday',
    startTime: '11:00',
    endTime: '13:00',
    room: 'Seminar Room 12',
    recurrence: 'even',
    color: '#d97706',
  };

  // Odd week check:
  assert.equal(isClassActiveInWeek(lectureEveryWeek, 1, 'odd'), true);
  assert.equal(isClassActiveInWeek(labOddWeeks, 1, 'odd'), true);
  assert.equal(isClassActiveInWeek(seminarEvenWeeks, 1, 'odd'), false);

  // Even week check:
  assert.equal(isClassActiveInWeek(lectureEveryWeek, 2, 'even'), true);
  assert.equal(isClassActiveInWeek(labOddWeeks, 2, 'even'), false);
  assert.equal(isClassActiveInWeek(seminarEvenWeeks, 2, 'even'), true);

  // Day filtering:
  const oddDayClasses = filterClassesForDay([lectureEveryWeek, labOddWeeks, seminarEvenWeeks], 'Monday', 1, 'odd');
  assert.equal(oddDayClasses.length, 2);
  assert.equal(oddDayClasses[0].code, 'CS201');
  assert.equal(oddDayClasses[1].code, 'CS201L');
});

test('Countdown progress bar and status calculation', () => {
  const item: CountdownItem = {
    id: 'cd1',
    title: 'Data Structures Midterm Exam',
    category: 'exam',
    courseCode: 'CS201',
    startDate: '2026-10-01T00:00:00',
    dueDate: '2026-10-11T00:00:00', // 10 days total
    completed: false,
  };

  // Midpoint test: 2026-10-06 should be ~50%
  const midDate = new Date('2026-10-06T00:00:00');
  const progress = calculateCountdownProgress(item, midDate);
  assert.equal(progress.progressPercent, 50);
  assert.equal(progress.daysRemaining, 5);
  assert.equal(progress.isOverdue, false);

  // Overdue test:
  const afterDate = new Date('2026-10-12T00:00:00');
  const overdueProgress = calculateCountdownProgress(item, afterDate);
  assert.equal(overdueProgress.progressPercent, 100);
  assert.equal(overdueProgress.isOverdue, true);
  assert.equal(overdueProgress.urgency, 'critical');
});

test('moveClassToDay correctly updates target day of week', () => {
  const originalClasses: ClassEvent[] = [
    {
      id: 'c-test',
      title: 'Robotics',
      code: 'ROB101',
      type: 'lecture',
      day: 'Monday',
      startTime: '10:00',
      endTime: '12:00',
      room: 'Room 101',
      recurrence: 'all',
      color: '#4f46e5',
    },
  ];

  const moved = moveClassToDay(originalClasses, 'c-test', 'Thursday');
  assert.equal(moved[0].day, 'Thursday');
  assert.equal(moved[0].startTime, '10:00');
});

test('calculateSemesterTimeline computes progress percentage and dates accurately', () => {
  const config: SemesterConfig = {
    name: 'Autumn 2026',
    startDate: '2026-10-05',
    totalWeeks: 14,
    initialWeekParity: 'odd',
    vacations: [
      {
        id: 'vac-1',
        name: 'Winter Break',
        startDate: '2026-12-21',
        endDate: '2026-12-27',
        pauseWeekNumbering: true, // 7 days paused
      },
    ],
  };

  // Test start date: Day 1 of semester
  const startDay = new Date('2026-10-05T00:00:00');
  const startTimeline = calculateSemesterTimeline(config, startDay);
  assert.equal(startTimeline.isPreSemester, false);
  assert.equal(startTimeline.daysPassed, 1);
  assert.ok(startTimeline.progressPercent > 0);
  assert.equal(startTimeline.totalDays, 14 * 7 + 7); // 98 + 7 = 105 days

  // Test pre-semester date
  const preDay = new Date('2026-10-01T00:00:00');
  const preTimeline = calculateSemesterTimeline(config, preDay);
  assert.equal(preTimeline.isPreSemester, true);
  assert.equal(preTimeline.progressPercent, 0);
  assert.equal(preTimeline.daysUntilStart, 4);

  // Test vacation markers are mapped
  assert.equal(startTimeline.vacationMarkers.length, 1);
  assert.equal(startTimeline.vacationMarkers[0].name, 'Winter Break');
  assert.ok(startTimeline.vacationMarkers[0].startPercent > 0);
});

