import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Download,
  Github,
  QrCode,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../viewmodels/usePWAInstall.ts';

interface AndroidDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidDownloadModal: React.FC<AndroidDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'github' | 'qr'>('install');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [repoUrl, setRepoUrl] = useState(
    'https://github.com/unitrack/unitrack-academic-calendar'
  );

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://unitrack.app';

  useEffect(() => {
    if (!isOpen) return;
    const targetUrl = activeTab === 'github' ? `${repoUrl}/releases` : currentUrl;
    QRCode.toDataURL(targetUrl, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR Code error:', err));
  }, [isOpen, activeTab, currentUrl, repoUrl]);

  if (!isOpen) return null;

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl btn-theme-primary text-white shadow-md">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Android App & Mobile Download
                </h2>
                <span className="rounded-full badge-theme-soft px-2.5 py-0.5 text-[10px] font-bold">
                  Android Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Install directly on your phone or download the APK via GitHub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-6 pt-3 dark:border-slate-800 dark:bg-slate-800/40">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'install'
                ? 'border-theme-accent text-theme'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Download className="h-4 w-4" />
            1-Click Android Install (PWA)
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'github'
                ? 'border-theme-accent text-theme'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Github className="h-4 w-4" />
            Download APK from GitHub
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'qr'
                ? 'border-theme-accent text-theme'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <QrCode className="h-4 w-4" />
            Scan QR on Phone
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6">
          {/* TAB 1: 1-Click Install */}
          {activeTab === 'install' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Recommended for Android Users</h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                      UniTrack is a fully compliant Progressive Web App (WebAPK). Once installed,
                      it runs full-screen without browser UI, stores all timetables offline in IndexedDB/LocalStorage,
                      and sends real-time class alert notifications!
                    </p>
                  </div>
                </div>
              </div>

              {/* Install Trigger Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isInstalled ? 'App Already Installed' : 'Ready to Install on this Device'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isInstalled
                      ? 'UniTrack is running in standalone mode.'
                      : 'Add UniTrack icon directly to your Android home screen launcher.'}
                  </p>
                </div>

                {!isInstalled && (
                  <button
                    onClick={install}
                    className="flex items-center gap-2 rounded-xl btn-theme-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition shrink-0"
                  >
                    <Download className="h-4 w-4" />
                    Install to Android Screen
                  </button>
                )}
              </div>

              {/* Step-by-Step Android Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Manual Install in 3 Steps (Chrome / Samsung Internet on Android)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200 mb-2">
                      1
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Open in Chrome</h5>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      Open UniTrack on your Android phone browser (Google Chrome or Samsung Internet).
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200 mb-2">
                      2
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Tap Menu (⋮)</h5>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      Tap the 3 dots in the top-right corner of Chrome, then select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200 mb-2">
                      3
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Launch & Enjoy</h5>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      UniTrack will appear alongside your other Android apps with offline support!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Download APK through GitHub */}
          {activeTab === 'github' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <Github className="h-5 w-5 text-slate-900 dark:text-white" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Download APK from GitHub Releases
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  You can download the standalone <strong>UniTrack.apk</strong> directly on your Android phone
                  from the GitHub repository release section.
                </p>
              </div>

              {/* Instructions to Install on Phone */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/60 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  How to Download & Install the APK on Your Android Phone:
                </h5>
                <ol className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                  <li className="pl-1">
                    On your Android phone, open the GitHub Releases page:{' '}
                    <span className="font-mono text-[11px] font-semibold text-theme">
                      github.com/unitrack/releases
                    </span>
                  </li>
                  <li className="pl-1">
                    Under the latest Release tag (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] dark:bg-slate-700">v2.1.0</code>), tap on{' '}
                    <strong className="text-slate-900 dark:text-white">UniTrack-Release.apk</strong> to download it.
                  </li>
                  <li className="pl-1">
                    When the download finishes, tap the notification or open the <strong>Files / Downloads</strong> app.
                  </li>
                  <li className="pl-1">
                    If prompted with <em>"Install unknown apps"</em>, tap <strong>Settings</strong> and switch <strong>Allow from this source</strong> to ON.
                  </li>
                  <li className="pl-1">
                    Tap <strong>Install</strong>. Once completed, tap <strong>Open</strong> to start organizing your university schedule!
                  </li>
                </ol>
              </div>

              {/* GitHub Actions CI/CD Info */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
                <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold">Automated GitHub Actions Workflow Included</h5>
                  <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                    The repository includes <code className="font-mono">.github/workflows/build-android-apk.yml</code> which
                    automatically bundles the web app with Bubblewrap TWA, signs the APK, and publishes it whenever you tag a new release.
                  </p>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleCopyLink(`${repoUrl}/releases/download/latest/UniTrack.apk`)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Direct APK URL'}</span>
                </button>

                <a
                  href={`${repoUrl}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl btn-theme-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Go to GitHub Releases</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: QR Code */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="max-w-md">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Scan with your Android Camera
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Point your phone's camera or Google Lens at this QR code to instantly open UniTrack on your mobile device.
                </p>
              </div>

              {/* QR Image */}
              <div className="rounded-3xl border-4 border-slate-100 bg-white p-4 shadow-xl dark:border-slate-800">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scan to open UniTrack on Android phone"
                    className="h-56 w-56 rounded-xl"
                  />
                ) : (
                  <div className="h-56 w-56 flex items-center justify-center text-xs text-slate-400">
                    Generating QR code...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full max-w-md">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                />
                <button
                  onClick={() => handleCopyLink(currentUrl)}
                  className="rounded-xl btn-theme-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-theme" />
            <span>Android 8.0+ • Works 100% Offline with Service Worker</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
