import React from 'react';
import { Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import { Language } from '../types/cricket';
import { mockRecentResults } from '../data/mockCricketData';

interface RecentResultsProps {
  lang: Language;
}

export const RecentResults: React.FC<RecentResultsProps> = ({ lang }) => {
  const isTa = lang === 'ta';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>🏆</span>
            <span>{isTa ? 'சமீபத்தில் முடிந்த போட்டிகள் (Recent Results)' : 'Recent Match Results'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isTa ? 'அதிகாரப்பூர்வ முடிவுகள் மற்றும் ஆட்டநாயகன் விவரங்கள்' : 'Official match results and Player of the Match awards'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockRecentResults.map((r) => (
          <div
            key={r.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {r.tournament}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {isTa ? r.dateTa : r.date}
                </span>
              </div>

              {/* Match Details */}
              <div className="text-xs text-slate-400 mb-2 font-medium">{r.matchNumber}</div>

              {/* Teams & Scores */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-extrabold text-white flex items-center gap-2">
                    <span>{r.team1.logo}</span>
                    <span>{isTa ? r.team1.nameTa : r.team1.name}</span>
                  </span>
                  <span className="font-black text-slate-200 font-mono">{r.score1}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-extrabold text-white flex items-center gap-2">
                    <span>{r.team2.logo}</span>
                    <span>{isTa ? r.team2.nameTa : r.team2.name}</span>
                  </span>
                  <span className="font-black text-slate-200 font-mono">{r.score2}</span>
                </div>
              </div>
            </div>

            {/* Outcome Banner & POTM */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{isTa ? r.winMarginTa : r.winMarginEn}</span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>POTM:</span>
                <span className="font-bold text-amber-300">{isTa ? r.playerOfMatchTa : r.playerOfMatchEn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
