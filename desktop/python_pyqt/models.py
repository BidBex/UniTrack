"""
UniTrack Desktop (PyQt6) - Clean Architecture Domain Models
Fully decoupled data structures compatible with UniTrack JSON schema.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional
import json

@dataclass
class VacationPeriod:
    id: str
    name: str
    startDate: str
    endDate: str
    pauseWeekNumbering: bool = True

@dataclass
class SemesterConfig:
    name: str
    startDate: str
    totalWeeks: int = 14
    initialWeekParity: str = "odd"
    vacations: List[VacationPeriod] = field(default_factory=list)

@dataclass
class ClassEvent:
    id: str
    title: str
    code: str
    type: str # 'lecture' | 'laboratory' | 'seminary' | 'workshop'
    day: str # 'Monday' ... 'Sunday'
    startTime: str # 'HH:MM'
    endTime: str # 'HH:MM'
    room: str
    recurrence: str # 'all' | 'odd' | 'even'
    color: str = "#4f46e5"
    professor: Optional[str] = None
    notes: Optional[str] = None

@dataclass
class CountdownItem:
    id: str
    title: str
    category: str # 'exam' | 'assignment' | 'project'
    startDate: str
    dueDate: str
    completed: bool = False
    courseCode: Optional[str] = None
    weightPercent: Optional[int] = None
    locationOrLink: Optional[str] = None
    notes: Optional[str] = None

@dataclass
class AppData:
    version: str = "1.0.0"
    appName: str = "UniTrack University Calendar"
    lastUpdated: str = ""
    semester: SemesterConfig = field(default_factory=lambda: SemesterConfig(name="Autumn 2026", startDate="2026-10-05"))
    classes: List[ClassEvent] = field(default_factory=list)
    countdowns: List[CountdownItem] = field(default_factory=list)

    @classmethod
    def from_json(cls, json_str: str) -> "AppData":
        data = json.loads(json_str)
        sem_data = data.get("semester", {})
        vacations = [VacationPeriod(**v) for v in sem_data.get("vacations", [])]
        semester = SemesterConfig(
            name=sem_data.get("name", "Autumn 2026"),
            startDate=sem_data.get("startDate", "2026-10-05"),
            totalWeeks=sem_data.get("totalWeeks", 14),
            initialWeekParity=sem_data.get("initialWeekParity", "odd"),
            vacations=vacations
        )
        classes = [ClassEvent(**c) for c in data.get("classes", [])]
        countdowns = [CountdownItem(**cd) for cd in data.get("countdowns", [])]
        return cls(
            version=data.get("version", "1.0.0"),
            appName=data.get("appName", "UniTrack"),
            lastUpdated=data.get("lastUpdated", ""),
            semester=semester,
            classes=classes,
            countdowns=countdowns
        )

    def to_json(self) -> str:
        return json.dumps(asdict(self), indent=2)
