/**
 * UniTrack - Academic Week Calendar & Exam Countdowns
 * Clean MVVM Architecture
 */

import React, { useEffect, useState } from 'react';
import { useCalendarViewModel } from './viewmodels/useCalendarViewModel.ts';
import { useNotificationsViewModel } from './viewmodels/useNotificationsViewModel.ts';
import { Navbar } from './components/Navbar.tsx';
import { TimetableHeader } from './components/TimetableHeader.tsx';
import { TimetableGrid } from './components/TimetableGrid.tsx';
import { AddEditClassModal } from './components/AddEditClassModal.tsx';
import { CountdownsView } from './components/CountdownsView.tsx';
import { WidgetView } from './components/WidgetView.tsx';
import { SemesterSettingsModal } from './components/SemesterSettingsModal.tsx';
import { DesktopHubModal } from './components/DesktopHubModal.tsx';
import { NotificationToasts, OfflineBanner } from './components/NotificationToasts.tsx';
import { ClassEvent, DayOfWeek } from './domain/types.ts';
import { getDayOfWeekFromDate } from './domain/calendarLogic.ts';

export default function App() {
  const {
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
  } = useCalendarViewModel();

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('unitrack_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('unitrack_dark_mode', String(isDarkMode));
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'calendar' | 'countdowns' | 'widget' | 'desktop' | 'settings'
  >('calendar');

  // Modals
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEvent | null>(null);
  const [defaultDayForAdd, setDefaultDayForAdd] = useState<DayOfWeek>('Monday');

  // Notifications
  const {
    permission,
    toasts,
    dismissToast,
    requestNotificationPermission,
    sendNotification,
    testNotification,
  } = useNotificationsViewModel(settings, setSettings);

  // Periodic check for upcoming class notification (every 30 seconds)
  useEffect(() => {
    if (!settings.enabled) return;

    if (nextUpcoming && nextUpcoming.startsInMinutes <= settings.classAlertMinutes && nextUpcoming.startsInMinutes > 0) {
      const alertKey = `alert_${nextUpcoming.classEvent.id}_${new Date().toDateString()}`;
      const lastSent = sessionStorage.getItem(alertKey);
      if (!lastSent) {
        sendNotification(
          `🔔 Class Starting Soon: [${nextUpcoming.classEvent.code}]`,
          `${nextUpcoming.classEvent.title} begins in ${nextUpcoming.startsInMinutes} min in ${nextUpcoming.classEvent.room}`,
          'class'
        );
        sessionStorage.setItem(alertKey, 'true');
      }
    }
  }, [nextUpcoming, settings.enabled, settings.classAlertMinutes, sendNotification]);

  const handleOpenAddClass = (day?: DayOfWeek) => {
    setEditingClass(null);
    if (day) setDefaultDayForAdd(day);
    setIsAddClassModalOpen(true);
  };

  const handleEditClass = (cls: ClassEvent) => {
    setEditingClass(cls);
    setIsAddClassModalOpen(true);
  };

  const handleSaveClass = (data: Omit<ClassEvent, 'id'>, id?: string) => {
    if (id && editingClass) {
      updateClass({ ...editingClass, ...data });
    } else {
      addClass(data);
    }
  };

  // Today's classes for widget
  const todayName = getDayOfWeekFromDate(currentDate);
  const todayClasses = timetableByDay[todayName] || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentWeekInfo={currentAcademicWeek}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onExportJson={exportToJson}
        onImportJson={importFromJson}
        settings={settings}
        onUpdateSettings={setSettings}
        onRequestNotificationPermission={requestNotificationPermission}
        onTestNotification={testNotification}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-3 py-6 sm:px-6 space-y-6">
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <TimetableHeader
              semester={semester}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              selectedWeekParity={selectedWeekParity}
              parityOverride={parityOverride}
              setParityOverride={setParityOverride}
              effectiveParity={effectiveParity}
              selectedDayFilter={selectedDayFilter}
              setSelectedDayFilter={setSelectedDayFilter}
              selectedTypeFilter={selectedTypeFilter}
              setSelectedTypeFilter={setSelectedTypeFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentWeekInfo={currentAcademicWeek}
              onOpenAddModal={() => handleOpenAddClass()}
              nextUpcoming={nextUpcoming}
            />

            <TimetableGrid
              timetableByDay={timetableByDay}
              selectedDayFilter={selectedDayFilter}
              onEditClass={handleEditClass}
              onDeleteClass={deleteClass}
              onAddClassForDay={handleOpenAddClass}
            />
          </div>
        )}

        {activeTab === 'countdowns' && (
          <CountdownsView
            countdowns={countdowns}
            setCountdowns={setCountdowns}
          />
        )}

        {activeTab === 'widget' && (
          <WidgetView
            currentWeekInfo={currentAcademicWeek}
            nextUpcoming={nextUpcoming}
            todayClasses={todayClasses}
            countdowns={countdowns}
            onOpenClassModal={() => handleOpenAddClass()}
          />
        )}

        {activeTab === 'desktop' && (
          <DesktopHubModal onExportJson={exportToJson} />
        )}

        {activeTab === 'settings' && (
          <SemesterSettingsModal
            semester={semester}
            onUpdateSemester={updateSemester}
            onAddVacation={addVacation}
            onDeleteVacation={deleteVacation}
            onResetToSampleData={resetToSampleData}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <AddEditClassModal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        onSave={handleSaveClass}
        initialClass={editingClass}
        defaultDay={defaultDayForAdd}
      />

      {/* Floating Notifications & Toasts */}
      <NotificationToasts toasts={toasts} onDismiss={dismissToast} />

      {/* Offline Status */}
      <OfflineBanner />
    </div>
  );
}
