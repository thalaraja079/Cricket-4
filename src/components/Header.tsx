import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types/cricket';
import { t } from '../utils/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: 'all' | 'live' | 'upcoming' | 'points' | 'results' | 'stats';
  setActiveTab: (tab: 'all' | 'live' | 'upcoming' | 'points' | 'results' | 'stats') => void;
  onOpenWordPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activeTab,
  setActiveTab,
  onOpenWordPress,
}) => {
  const tr = t[lang];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Brand, Navigation, and Controls */}
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark with sports accent */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('all')}
              className="text-left group flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-base">
                🏏
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white font-sports">
                  {lang === 'ta' ? 'கிரிக் பல்ஸ்' : 'CricPulse'}
                  <span className="text-emerald-400 ml-1">LIVE</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>🏠</span>
              <span>{tr.all}</span>
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'live'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-live" />
              <span>{tr.liveScores}</span>
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tr.upcoming}
            </button>

            <button
              onClick={() => setActiveTab('points')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'points'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tr.pointsTable}
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tr.completed}
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tr.stats}
            </button>
          </nav>

          {/* Zone 3: Language & WordPress Controls */}
          <div className="flex items-center gap-2">
            {/* Live Status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>{lang === 'ta' ? 'அதிகாரப்பூர்வ தகவல்' : 'Official Feed'}</span>
            </div>

            {/* WordPress Embed Button */}
            <button
              onClick={onOpenWordPress}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
              title="WordPress-ல் சேர்க்க / Embed in WordPress"
            >
              <span className="font-extrabold text-blue-400">W</span>
              <span className="hidden sm:inline">{lang === 'ta' ? 'WordPress-ல் சேர்க்க' : 'WordPress'}</span>
            </button>

            {/* Tamil / English Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors cursor-pointer"
              title="Change Language / மொழியை மாற்ற"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-900 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-300'
            }`}
          >
            <span>🏠</span>
            {tr.all}
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'live' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live" />
            {tr.liveScores}
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
              activeTab === 'upcoming' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {tr.upcoming}
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
              activeTab === 'points' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {tr.pointsTable}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
              activeTab === 'results' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {tr.completed}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
              activeTab === 'stats' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {tr.stats}
          </button>
        </div>
      </div>
    </header>
  );
};
