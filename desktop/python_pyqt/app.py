"""
UniTrack - Academic Week Calendar & Exam Countdowns Desktop App
Cross-platform Desktop Application built with Python & PyQt6 (Clean MVVM Architecture)
"""

import sys
import os
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QTabWidget, QLabel, QPushButton, QTableWidget, QTableWidgetItem,
    QHeaderView, QProgressBar, QFileDialog, QMessageBox, QComboBox,
    QFrame, QSpinBox
)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QColor, QFont, QIcon
from models import AppData, ClassEvent, CountdownItem
from viewmodel import CalendarViewModel

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

class UniTrackDesktopWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("UniTrack - University Academic Calendar (PyQt6)")
        self.resize(1100, 720)
        
        # Initialize ViewModel
        self.vm = CalendarViewModel()
        
        # Setup central widget and tabs
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(16, 16, 16, 16)
        main_layout.setSpacing(12)

        # Header with week info & JSON toolbar
        header_frame = QFrame()
        header_frame.setStyleSheet("""
            QFrame {
                background: #1e1b4b;
                border-radius: 12px;
                padding: 12px;
            }
            QLabel {
                color: #ffffff;
            }
        """)
        header_layout = QHBoxLayout(header_frame)
        
        # Title & Academic Week indicator
        self.lbl_title = QLabel("🎓 <b>UniTrack</b> | Academic Calendar")
        self.lbl_title.setFont(QFont("Segoe UI", 13))
        
        self.lbl_week_badge = QLabel("Week 1 (Odd Week)")
        self.lbl_week_badge.setStyleSheet("""
            background: #4f46e5;
            color: white;
            font-weight: bold;
            padding: 6px 14px;
            border-radius: 8px;
        """)
        
        header_layout.addWidget(self.lbl_title)
        header_layout.addSpacing(16)
        header_layout.addWidget(self.lbl_week_badge)
        header_layout.addStretch()

        # JSON Save/Open Buttons
        btn_open = QPushButton("📂 Open JSON")
        btn_open.clicked.connect(self.load_json_file)
        btn_save = QPushButton("💾 Save JSON")
        btn_save.clicked.connect(self.save_json_file)

        header_layout.addWidget(btn_open)
        header_layout.addWidget(btn_save)
        main_layout.addWidget(header_frame)

        # Tabs: Timetable vs Countdowns
        self.tabs = QTabWidget()
        self.tab_calendar = QWidget()
        self.tab_countdowns = QWidget()

        self.setup_calendar_tab()
        self.setup_countdowns_tab()

        self.tabs.addTab(self.tab_calendar, "📅 Weekly Timetable")
        self.tabs.addTab(self.tab_countdowns, "⏳ Exams & Deadlines Progress")

        main_layout.addWidget(self.tabs)

        # Timer for live ticking
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.refresh_ui)
        self.timer.start(1000)

        self.refresh_ui()

    def setup_calendar_tab(self):
        layout = QVBoxLayout(self.tab_calendar)

        # Week selector bar
        controls_layout = QHBoxLayout()
        controls_layout.addWidget(QLabel("Select Academic Week:"))
        self.spin_week = QSpinBox()
        self.spin_week.setRange(1, 16)
        self.spin_week.setValue(1)
        self.spin_week.valueChanged.connect(self.on_week_changed)
        controls_layout.addWidget(self.spin_week)

        controls_layout.addWidget(QLabel("Parity Filter:"))
        self.combo_parity = QComboBox()
        self.combo_parity.addItems(["Auto (Match Week)", "Odd Weeks Only", "Even Weeks Only", "Show All"])
        self.combo_parity.currentIndexChanged.connect(self.on_week_changed)
        controls_layout.addWidget(self.combo_parity)

        controls_layout.addStretch()
        layout.addLayout(controls_layout)

        # Weekly timetable table
        self.table_classes = QTableWidget()
        self.table_classes.setColumnCount(6)
        self.table_classes.setHorizontalHeaderLabels(["Day", "Time", "Type", "Course Code", "Title", "Room & Professor"])
        self.table_classes.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        self.table_classes.setAlternatingRowColors(True)
        layout.addWidget(self.table_classes)

    def setup_countdowns_tab(self):
        layout = QVBoxLayout(self.tab_countdowns)
        self.table_countdowns = QTableWidget()
        self.table_countdowns.setColumnCount(5)
        self.table_countdowns.setHorizontalHeaderLabels(["Category", "Title", "Due Date", "Progress Bar", "Time Remaining"])
        self.table_countdowns.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        layout.addWidget(self.table_countdowns)

    def on_week_changed(self):
        self.vm.selected_week = self.spin_week.value()
        self.refresh_ui()

    def refresh_ui(self):
        info = self.vm.get_academic_week_info()
        self.lbl_week_badge.setText(info["label"])

        # Update timetable
        parity = "odd" if self.vm.selected_week % 2 != 0 else "even"
        combo_idx = self.combo_parity.currentIndex()
        if combo_idx == 1:
            parity = "odd"
        elif combo_idx == 2:
            parity = "even"
        elif combo_idx == 3:
            parity = "all"

        self.table_classes.setRowCount(0)
        row = 0
        for day in DAYS:
            day_classes = self.vm.filter_classes_for_day(day, self.vm.selected_week, parity)
            for c in day_classes:
                self.table_classes.insertRow(row)
                self.table_classes.setItem(row, 0, QTableWidgetItem(c.day))
                self.table_classes.setItem(row, 1, QTableWidgetItem(f"{c.startTime} - {c.endTime}"))
                self.table_classes.setItem(row, 2, QTableWidgetItem(c.type.upper()))
                self.table_classes.setItem(row, 3, QTableWidgetItem(c.code))
                self.table_classes.setItem(row, 4, QTableWidgetItem(c.title))
                prof = f" ({c.professor})" if c.professor else ""
                self.table_classes.setItem(row, 5, QTableWidgetItem(f"{c.room}{prof}"))
                row += 1

        # Update countdowns
        self.table_countdowns.setRowCount(0)
        c_row = 0
        for item in self.vm.data.countdowns:
            prog = self.vm.calculate_countdown_progress(item)
            self.table_countdowns.insertRow(c_row)
            self.table_countdowns.setItem(c_row, 0, QTableWidgetItem(item.category.upper()))
            self.table_countdowns.setItem(c_row, 1, QTableWidgetItem(f"{item.courseCode or ''} {item.title}".strip()))
            self.table_countdowns.setItem(c_row, 2, QTableWidgetItem(item.dueDate.replace("T", " ")))

            # Visual progress bar
            pbar = QProgressBar()
            pbar.setValue(int(prog["progressPercent"]))
            pbar.setFormat(f"{prog['progressPercent']}%")
            if prog["urgency"] == "critical":
                pbar.setStyleSheet("QProgressBar::chunk { background-color: #ef4444; }")
            elif prog["urgency"] == "warning":
                pbar.setStyleSheet("QProgressBar::chunk { background-color: #f59e0b; }")
            else:
                pbar.setStyleSheet("QProgressBar::chunk { background-color: #10b981; }")
            self.table_countdowns.setCellWidget(c_row, 3, pbar)

            self.table_countdowns.setItem(c_row, 4, QTableWidgetItem(prog["remainingStr"]))
            c_row += 1

    def load_json_file(self):
        path, _ = QFileDialog.getOpenFileName(self, "Open UniTrack Schedule JSON", "", "JSON Files (*.json)")
        if path:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    self.vm.data = AppData.from_json(f.read())
                QMessageBox.information(self, "Success", "Schedule loaded successfully!")
                self.refresh_ui()
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Failed to load JSON: {str(e)}")

    def save_json_file(self):
        path, _ = QFileDialog.getSaveFileName(self, "Save UniTrack Schedule JSON", "unitrack_schedule.json", "JSON Files (*.json)")
        if path:
            try:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(self.vm.data.to_json())
                QMessageBox.information(self, "Saved", f"Schedule saved to {os.path.basename(path)}")
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Failed to save JSON: {str(e)}")

def main():
    app = QApplication(sys.argv)
    window = UniTrackDesktopWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
