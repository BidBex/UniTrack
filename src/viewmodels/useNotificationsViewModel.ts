import { useCallback, useEffect, useState } from 'react';
import { ClassEvent, CountdownItem, NotificationSettings } from '../domain/types.ts';

export interface AppNotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'class' | 'deadline' | 'system' | 'success' | 'warning';
  timestamp: Date;
}

export function useNotificationsViewModel(
  settings: NotificationSettings,
  onUpdateSettings: (settings: NotificationSettings) => void
) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [toasts, setToasts] = useState<AppNotificationToast[]>([]);
  const [lastNotifiedMap, setLastNotifiedMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Web Audio sound synthesizer (no external audio assets needed!)
  const playAlertSound = useCallback((type: 'class' | 'deadline' | 'chime' = 'chime') => {
    if (!settings.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'class') {
        // High ascending pleasant two-tone chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.0, now + 0.12); // A5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'deadline') {
        // Urgent alert sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // AudioContext unavailable or blocked by browser policy until gesture
    }
  }, [settings.soundEnabled]);

  const addToast = useCallback((toast: Omit<AppNotificationToast, 'id' | 'timestamp'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const newToast: AppNotificationToast = {
      ...toast,
      id,
      timestamp: new Date(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      addToast({
        title: 'Notifications Unsupported',
        message: 'Your browser does not support the Web Notifications API.',
        type: 'warning',
      });
      return false;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        onUpdateSettings({ ...settings, enabled: true });
        addToast({
          title: 'Notifications Enabled',
          message: 'You will receive reminders for upcoming classes and exams.',
          type: 'success',
        });
        playAlertSound('chime');
        return true;
      } else {
        addToast({
          title: 'Notifications Blocked',
          message: 'Permission was declined. Please allow in browser site settings.',
          type: 'warning',
        });
        return false;
      }
    } catch {
      return false;
    }
  };

  const sendNotification = useCallback(
    (title: string, body: string, type: 'class' | 'deadline') => {
      playAlertSound(type);

      // In-app toast always shows
      addToast({
        title,
        message: body,
        type,
      });

      // System notification if granted and enabled
      if (settings.enabled && permission === 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
        try {
          new Notification(title, {
            body,
            icon: '/pwa-192x192.png',
            badge: '/icon.svg',
          });
        } catch {
          // fallback
        }
      }
    },
    [addToast, permission, playAlertSound, settings.enabled]
  );

  const testNotification = useCallback(() => {
    sendNotification(
      '🔔 Test University Alert',
      'Operating Systems Lab starts in 15 minutes in Linux Lab 301!',
      'class'
    );
  }, [sendNotification]);

  return {
    permission,
    toasts,
    addToast,
    dismissToast,
    requestNotificationPermission,
    sendNotification,
    testNotification,
    playAlertSound,
  };
}
