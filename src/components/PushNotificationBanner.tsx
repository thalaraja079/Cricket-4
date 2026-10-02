import React, { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Language } from '../types/cricket';

interface PushNotificationBannerProps {
  lang: Language;
}

export const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({ lang }) => {
  const isTa = lang === 'ta';
  const [dismissed, setDismissed] = useState(false);
  const [enabled, setEnabled] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-white">
            {isTa ? 'நேரலை விக்கெட் & சிக்ஸர் அறிவிப்புகள்' : 'Instant Match Alerts & Notifications'}
          </span>
          <span className="text-slate-400 ml-1.5 hidden sm:inline">
            {isTa ? 'அடுத்த போட்டிகள் தொடங்கும் போது உடனே தெரிந்து கொள்ளுங்கள்' : 'Get notified when upcoming matches begin and when wickets fall'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            setEnabled(true);
            setTimeout(() => setDismissed(true), 1500);
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            enabled ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {enabled ? (
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {isTa ? 'இயக்கப்பட்டது' : 'Subscribed'}
            </span>
          ) : (
            isTa ? 'இயக்கு' : 'Enable'
          )}
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
