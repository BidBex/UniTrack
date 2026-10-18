"""
UniTrack Desktop (PyQt6) - ViewModel Layer
Decoupled business logic implementing MVVM pattern.
"""

from datetime import datetime, date, timedelta
from typing import List, Dict, Tuple, Optional
from models import AppData, ClassEvent, CountdownItem, VacationPeriod

class CalendarViewModel:
    def __init__(self, data: Optional[AppData] = None):
        self.data = data or AppData()
        self.selected_week = 1
        self.parity_filter = "auto" # 'auto', 'odd', 'even', 'all'
        self.day_filter = "all"

    def get_academic_week_info(self, target_date: Optional[date] = None) -> Dict:
        target = target_date or date.today()
        sem_start = datetime.strptime(self.data.semester.startDate, "%Y-%m-%d").date()
        diff_days = (target - sem_start).days

        # Vacation check
        active_vacation = None
        for vac in self.data.semester.vacations:
            v_start = datetime.strptime(vac.startDate, "%Y-%m-%d").date()
            v_end = datetime.strptime(vac.endDate, "%Y-%m-%d").date()
            if v_start <= target <= v_end:
                active_vacation = vac
                break

        if diff_days < 0:
            return {
                "weekNumber": 1,
                "parity": self.data.semester.initialWeekParity,
                "isVacation": False,
                "label": f"Pre-Semester (Starts {self.data.semester.startDate})"
            }

        # Count paused vacation days
        paused_days = 0
        for vac in self.data.semester.vacations:
            if not vac.pauseWeekNumbering:
                continue
            v_start = datetime.strptime(vac.startDate, "%Y-%m-%d").date()
            v_end = datetime.strptime(vac.endDate, "%Y-%m-%d").date()
            eff_start = max(sem_start, v_start)
            eff_end = min(target, v_end)
            if eff_end >= eff_start:
                paused_days += (eff_end - eff_start).days + 1

        effective_days = max(0, diff_days - paused_days)
        raw_week = (effective_days // 7) + 1
        week_num = min(max(1, raw_week), self.data.semester.totalWeeks)

        initial_is_odd = self.data.semester.initialWeekParity == "odd"
        is_odd = (week_num % 2 != 0) if initial_is_odd else (week_num % 2 == 0)
        parity = "odd" if is_odd else "even"

        label = f"Week {week_num} ({parity.capitalize()} Week)"
        if active_vacation:
            label = f"🌴 {active_vacation.name} (Week {week_num})"

        return {
            "weekNumber": week_num,
            "parity": parity,
            "isVacation": bool(active_vacation),
            "vacationName": active_vacation.name if active_vacation else None,
            "label": label
        }

    def filter_classes_for_day(self, day: str, week_num: int, parity: str) -> List[ClassEvent]:
        matching = []
        for c in self.data.classes:
            if c.day != day:
                continue
            if c.recurrence == "all" or c.recurrence == parity:
                matching.append(c)
        return sorted(matching, key=lambda x: x.startTime)

    def calculate_countdown_progress(self, item: CountdownItem) -> Dict:
        if item.completed:
            return {
                "progressPercent": 100.0,
                "remainingStr": "Completed",
                "isOverdue": False,
                "urgency": "done"
            }

        now = datetime.now()
        due = datetime.fromisoformat(item.dueDate)
        try:
            start = datetime.fromisoformat(item.startDate) if item.startDate else (due - timedelta(days=14))
        except Exception:
            start = due - timedelta(days=14)

        total_sec = max(1.0, (due - start).total_seconds())
        remaining_sec = (due - now).total_seconds()
        elapsed_sec = max(0.0, (now - start).total_seconds())

        is_overdue = remaining_sec <= 0
        progress = 100.0 if is_overdue else min(100.0, max(0.0, (elapsed_sec / total_sec) * 100.0))

        if is_overdue:
            days = abs(int(remaining_sec // 86400))
            hours = abs(int((remaining_sec % 86400) // 3600))
            remaining_str = f"Overdue by {days}d {hours}h"
            urgency = "critical"
        else:
            days = int(remaining_sec // 86400)
            hours = int((remaining_sec % 86400) // 3600)
            mins = int((remaining_sec % 3600) // 60)
            remaining_str = f"{days}d {hours}h {mins}m"
            urgency = "critical" if remaining_sec < 86400 else ("warning" if remaining_sec < 259200 else "normal")

        return {
            "progressPercent": round(progress, 1),
            "remainingStr": remaining_str,
            "isOverdue": is_overdue,
            "urgency": urgency
        }
