import React, { useEffect, useState } from 'react';
import { Bell, Flame, CheckCircle2, AlertCircle, X, WifiOff } from 'lucide-react';
import { AppNotificationToast } from '../viewmodels/useNotificationsViewModel.ts';

interface NotificationToastsProps {
  toasts: AppNotificationToast[];
  onDismiss: (id: string) => void;
}

export const NotificationToasts: React.FC<NotificationToastsProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isClass = toast.type === 'class';
        const isDeadline = toast.type === 'deadline';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 animate-in slide-in-from-bottom-5"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white ${
                isDeadline
                  ? 'bg-amber-500'
                  : isClass
                  ? 'bg-indigo-600'
                  : 'bg-emerald-600'
              }`}
            >
              {isDeadline ? (
                <Flame className="h-4 w-4" />
              ) : isClass ? (
                <Bell className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {toast.title}
              </h4>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900/90 text-white px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-md dark:bg-slate-800/90">
      <WifiOff className="h-4 w-4 text-amber-400 animate-pulse" />
      <span>Offline Study Mode — Schedule cached locally</span>
    </div>
  );
};
