import React, { useState } from 'react';
import { Language } from '../types/cricket';
import { TeamRadarChart } from './TeamRadarChart';
import { Table, Radar, Trophy } from 'lucide-react';

interface PointsTableProps {
  lang: Language;
}

export const PointsTable: React.FC<PointsTableProps> = ({ lang }) => {
  const isTa = lang === 'ta';
  const [activeTab, setActiveTab] = useState<'asiangames' | 'icc'>('asiangames');
  const [viewMode, setViewMode] = useState<'both' | 'table' | 'radar'>('both');

  const asianGamesTable = [
    { pos: 1, team: 'India', teamTa: 'இந்தியா', flag: '🇮🇳', p: 3, w: 3, l: 0, nrr: '+2.410', pts: 6 },
    { pos: 2, team: 'Pakistan', teamTa: 'பாகிஸ்தான்', flag: '🇵🇰', p: 3, w: 2, l: 1, nrr: '+1.120', pts: 4 },
    { pos: 3, team: 'Bangladesh', teamTa: 'வங்கதேசம்', flag: '🇧🇩', p: 3, w: 2, l: 1, nrr: '+0.680', pts: 4 },
    { pos: 4, team: 'Sri Lanka', teamTa: 'இலங்கை', flag: '🇱🇰', p: 3, w: 2, l: 1, nrr: '-0.350', pts: 4 },
    { pos: 5, team: 'Afghanistan', teamTa: 'ஆப்கானிஸ்தான்', flag: '🇦🇫', p: 3, w: 1, l: 2, nrr: '-0.310', pts: 2 },
  ];

  const iccTable = [
    { pos: 1, team: 'India', teamTa: 'இந்தியா', flag: '🇮🇳', p: 5, w: 5, l: 0, nrr: '+2.850', pts: 10 },
    { pos: 2, team: 'Australia', teamTa: 'ஆஸ்திரேலியா', flag: '🇦🇺', p: 5, w: 4, l: 1, nrr: '+1.420', pts: 8 },
    { pos: 3, team: 'South Africa', teamTa: 'தென்னாப்பிரிக்கா', flag: '🇿🇦', p: 5, w: 3, l: 2, nrr: '+0.750', pts: 6 },
    { pos: 4, team: 'New Zealand', teamTa: 'நியூசிலாந்து', flag: '🇳🇿', p: 5, w: 3, l: 2, nrr: '+0.340', pts: 6 },
    { pos: 5, team: 'Pakistan', teamTa: 'பாகிஸ்தான்', flag: '🇵🇰', p: 5, w: 2, l: 3, nrr: '-0.120', pts: 4 },
    { pos: 6, team: 'West Indies', teamTa: 'மேற்கிந்திய தீவுகள்', flag: '🌴', p: 5, w: 2, l: 3, nrr: '-0.450', pts: 4 },
  ];

  return (
    <section className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>📊</span>
            <span>{isTa ? 'புள்ளிகள் பட்டியல் & D3 ரேடார் வரைபடம்' : 'Standings & D3 Performance Radar'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isTa ? 'அட்டவணை நிலவரம் மற்றும் அணிகளின் நேரடி செயல்திறன் ஒப்பீடு' : 'International standings and dynamic team stat comparison'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'both' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title={isTa ? 'இரண்டும்' : 'Both'}
            >
              <span>{isTa ? 'இரண்டும்' : 'All'}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title={isTa ? 'அட்டவணை மட்டும்' : 'Table only'}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{isTa ? 'அட்டவணை' : 'Table'}</span>
            </button>
            <button
              onClick={() => setViewMode('radar')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'radar' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title={isTa ? 'D3 ரேடார் வரைபடம்' : 'D3 Radar only'}
            >
              <Radar className="w-3.5 h-3.5 text-sky-400" />
              <span>{isTa ? 'ரேடார்' : 'Radar'}</span>
            </button>
          </div>

          {/* Tournament Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('asiangames')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'asiangames' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Asian Games
            </button>
            <button
              onClick={() => setActiveTab('icc')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'icc' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              ICC International
            </button>
          </div>
        </div>
      </div>

      {/* Points Table Data Grid */}
      {(viewMode === 'both' || viewMode === 'table') && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase font-extrabold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">{isTa ? 'அணி' : 'Team'}</th>
                  <th className="py-3 px-4 text-center">{isTa ? 'போட்டிகள்' : 'P'}</th>
                  <th className="py-3 px-4 text-center">{isTa ? 'வெற்றி' : 'W'}</th>
                  <th className="py-3 px-4 text-center">{isTa ? 'தோல்வி' : 'L'}</th>
                  <th className="py-3 px-4 text-center">{isTa ? 'ரன் ரேட்' : 'NRR'}</th>
                  <th className="py-3 px-4 text-center">{isTa ? 'புள்ளிகள்' : 'PTS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {activeTab === 'asiangames'
                  ? asianGamesTable.map((t) => (
                      <tr key={t.team} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-black text-sky-400">{t.pos}</td>
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <span className="text-xl">{t.flag}</span>
                          <span>{isTa ? t.teamTa : t.team}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-300">{t.p}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">{t.w}</td>
                        <td className="py-3.5 px-4 text-center text-rose-400 font-bold">{t.l}</td>
                        <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400">{t.nrr}</td>
                        <td className="py-3.5 px-4 text-center font-black text-base text-amber-400">{t.pts}</td>
                      </tr>
                    ))
                  : iccTable.map((t) => (
                      <tr key={t.team} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-black text-sky-400">{t.pos}</td>
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <span className="text-xl">{t.flag}</span>
                          <span>{isTa ? t.teamTa : t.team}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-300">{t.p}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">{t.w}</td>
                        <td className="py-3.5 px-4 text-center text-rose-400 font-bold">{t.l}</td>
                        <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400">{t.nrr}</td>
                        <td className="py-3.5 px-4 text-center font-black text-base text-amber-400">{t.pts}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* D3.js Performance Radar Chart */}
      {(viewMode === 'both' || viewMode === 'radar') && (
        <TeamRadarChart lang={lang} tournamentFilter={activeTab} />
      )}
    </section>
  );
};
