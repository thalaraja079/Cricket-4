import React from 'react';
import { Trophy, Calendar, MapPin, CheckCircle2, Award } from 'lucide-react';
import { Language } from '../types/cricket';

interface NoLiveMatchHeroProps {
  lang: Language;
}

export const NoLiveMatchHero: React.FC<NoLiveMatchHeroProps> = ({ lang }) => {
  const isTa = lang === 'ta';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Live Status Strip */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/25 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            {isTa ? 'தற்போது சர்வதேச நேரடி போட்டிகள் எதுவும் நடைபெறவில்லை' : 'No International Live Matches In Progress Right Now'}
          </span>
        </div>
        <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
          <span>{isTa ? 'அதிகாரப்பூர்வ கிரிக்கெட் முடிவுகள் & அட்டவணை' : 'Official Cricket Scores & Fixtures'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Left Column: Official Completed Match Today (from Google) */}
        <div className="lg:col-span-7 p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              <Trophy className="w-4 h-4 text-emerald-400" />
              {isTa ? 'இன்று அதிகாரப்பூர்வமாக முடிந்த போட்டி' : 'Official Match Result (Completed Today)'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              {isTa ? 'அரையிறுதி 2 • T20' : 'Semi-final · T20 12 of 14'}
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Asian Games Men 2026
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Korogi Sports Park, Nisshin, Japan
            </p>
          </div>

          {/* Scores Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Team 1: India */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <div className="text-sm font-bold text-white">
                    {isTa ? 'இந்தியா' : 'India'}
                  </div>
                  <div className="text-xs text-slate-400">(20.0 ov)</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-sky-400 font-mono">169/7</span>
              </div>
            </div>

            {/* Team 2: Sri Lanka */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇱🇰</span>
                <div>
                  <div className="text-sm font-bold text-slate-200">
                    {isTa ? 'இலங்கை' : 'Sri Lanka'}
                  </div>
                  <div className="text-xs text-slate-400">(9.5 ov) • All Out</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-rose-400 font-mono">45</span>
              </div>
            </div>
          </div>

          {/* Result Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm sm:text-base">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isTa ? 'இந்தியா 124 ரன்கள் வித்தியாசத்தில் அபார வெற்றி பெற்றது!' : 'IND won by 124 runs'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {isTa
                ? 'இலங்கையை 45 ரன்களில் சுருட்டி 124 ரன்கள் வித்தியாசத்தில் வெற்றி பெற்று இந்தியா தங்கப் பதக்க இறுதிப் போட்டிக்கு (Gold Medal Final) முன்னேறியது.'
                : 'India advanced to the Asian Games Gold Medal Final with a dominant 124-run win after bowling out Sri Lanka for 45 in 9.5 overs.'}
            </p>
          </div>

          {/* Toss and Details */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400 pt-1">
            <span>🪙 {isTa ? 'டாஸ்: இலங்கை டாஸ் வென்று பந்துவீச்சைத் தேர்வு செய்தது' : 'Toss: SL won toss and decided to bowl'}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Nisshin, Japan
            </span>
          </div>
        </div>

        {/* Right Column: Next Big Upcoming Match */}
        <div className="lg:col-span-5 p-6 sm:p-7 bg-slate-950/40 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-sky-400">
                <Calendar className="w-4 h-4 text-sky-400" />
                {isTa ? 'அடுத்து வரவிருக்கும் பெரிய போட்டி' : 'Next Big Scheduled Match'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Award className="w-3.5 h-3.5" />
                Gold Medal Final
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400">
                {isTa ? 'ஆசிய விளையாட்டுப் போட்டிகள் 2026' : 'Asian Games Men 2026'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                🇮🇳 {isTa ? 'இந்தியா' : 'India'} <span className="text-amber-400 font-extrabold">vs</span> 🇵🇰 {isTa ? 'பாகிஸ்தான்' : 'Pakistan'}
              </h3>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-sky-400">
                <span>⏰</span>
                <span>{isTa ? 'சனிக்கிழமை, அக் 3 • காலை 9:00 மணி IST' : 'Saturday, Oct 3 • 9:00 AM IST'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Korogi Sports Park, Nisshin, Japan</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{isTa ? 'அதிகாரப்பூர்வ இறுதிப் போட்டி' : 'Official Final Match'}</span>
            <span className="text-amber-400 font-semibold">{isTa ? '🥇 தங்கம் வெல்லும் மோதல்' : '🥇 Clash for Gold'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
