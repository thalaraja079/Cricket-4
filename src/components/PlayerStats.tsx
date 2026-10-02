import React from 'react';
import { Award, Flame } from 'lucide-react';
import { Language } from '../types/cricket';
import { mockPlayerLeaderboard } from '../data/mockCricketData';

interface PlayerStatsProps {
  lang: Language;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ lang }) => {
  const isTa = lang === 'ta';

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>👑</span>
          <span>{isTa ? 'முன்னணி வீரர்கள் (Player Leaderboard)' : 'Tournament Leaders'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isTa ? 'அதிக ரன்கள் (Orange Cap) & அதிக விக்கெட்டுகள் (Purple Cap)' : 'Orange Cap (Most Runs) & Purple Cap (Most Wickets)'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Orange Cap: Most Runs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isTa ? 'அதிக ரன்கள் (Orange Cap)' : 'Most Runs (Orange Cap)'}</span>
            </span>
            <span className="text-xs font-bold text-slate-400">Runs (SR)</span>
          </div>

          <div className="space-y-3">
            {mockPlayerLeaderboard.orangeCap.slice(0, 4).map((p) => (
              <div key={p.rank} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {p.rank}
                  </span>
                  <div>
                    <div className="font-bold text-white">
                      {isTa && p.nameTa ? p.nameTa : p.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{p.team} • {p.matches} matches</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-amber-400 font-mono text-base">{p.runs}</div>
                  <div className="text-[11px] text-slate-400">SR: {p.strikeRate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purple Cap: Most Wickets */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-extrabold text-purple-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>{isTa ? 'அதிக விக்கெட்டுகள் (Purple Cap)' : 'Most Wickets (Purple Cap)'}</span>
            </span>
            <span className="text-xs font-bold text-slate-400">Wickets (Econ)</span>
          </div>

          <div className="space-y-3">
            {mockPlayerLeaderboard.purpleCap.slice(0, 4).map((p) => (
              <div key={p.rank} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {p.rank}
                  </span>
                  <div>
                    <div className="font-bold text-white">
                      {isTa && p.nameTa ? p.nameTa : p.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{p.team} • {p.matches} matches</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-purple-400 font-mono text-base">{p.wickets}</div>
                  <div className="text-[11px] text-slate-400">Econ: {p.economy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
