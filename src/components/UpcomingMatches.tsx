import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Trophy, Shield, ChevronRight } from 'lucide-react';
import { Language, UpcomingMatch } from '../types/cricket';

interface UpcomingMatchesProps {
  lang: Language;
}

export const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({ lang }) => {
  const isTa = lang === 'ta';
  const [filter, setFilter] = useState<'all' | 'odi' | 't20i'>('all');

  const matches: UpcomingMatch[] = [
    {
      id: 'up-1',
      tournament: 'West Indies Tour of India',
      tournamentTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம்',
      matchNumber: '3rd ODI (Final ODI)',
      matchNumberTa: '3வது ஒருநாள் போட்டி (இறுதி ஆட்டம்)',
      team1: { id: 'ind', name: 'India', nameTa: 'இந்தியா', shortName: 'IND', color: '#0055A5', secondaryColor: '#FF671F', logo: '🇮🇳' },
      team2: { id: 'wi', name: 'West Indies', nameTa: 'மேற்கிந்திய தீவுகள்', shortName: 'WI', color: '#7B002C', secondaryColor: '#FFCC00', logo: '🌴' },
      date: 'Saturday, Oct 3, 2026',
      dateTa: 'சனிக்கிழமை, அக் 3, 2026',
      time: '1:30 PM IST',
      timeTa: 'மதியம் 1:30 மணி',
      venue: 'Maharaja Yadavindra Singh Stadium, New Chandigarh (Mullanpur)',
      venueTa: 'மகாராஜா யாதவீந்திரா சிங் அரங்கம், சண்டிகர் (முல்லன்பூர்)',
      format: 'ODI',
      countdownHours: 28,
    },
    {
      id: 'up-2',
      tournament: 'West Indies Tour of India',
      tournamentTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம்',
      matchNumber: '1st T20I (Series of 5)',
      matchNumberTa: '1வது டி20 (5 போட்டிகள் தொடர்)',
      team1: { id: 'ind', name: 'India', nameTa: 'இந்தியா', shortName: 'IND', color: '#0055A5', secondaryColor: '#FF671F', logo: '🇮🇳' },
      team2: { id: 'wi', name: 'West Indies', nameTa: 'மேற்கிந்திய தீவுகள்', shortName: 'WI', color: '#7B002C', secondaryColor: '#FFCC00', logo: '🌴' },
      date: 'Tuesday, Oct 6, 2026',
      dateTa: 'செவ்வாய்க்கிழமை, அக் 6, 2026',
      time: '7:00 PM IST',
      timeTa: 'இரவு 7:00 மணி',
      venue: 'BRSABV Ekana Cricket Stadium, Lucknow',
      venueTa: 'ஏகானா கிரிக்கெட் அரங்கம், லக்னோ',
      format: 'T20I',
      countdownHours: 102,
    },
    {
      id: 'up-3',
      tournament: 'West Indies Tour of India',
      tournamentTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம்',
      matchNumber: '2nd T20I',
      matchNumberTa: '2வது டி20',
      team1: { id: 'ind', name: 'India', nameTa: 'இந்தியா', shortName: 'IND', color: '#0055A5', secondaryColor: '#FF671F', logo: '🇮🇳' },
      team2: { id: 'wi', name: 'West Indies', nameTa: 'மேற்கிந்திய தீவுகள்', shortName: 'WI', color: '#7B002C', secondaryColor: '#FFCC00', logo: '🌴' },
      date: 'Thursday, Oct 8, 2026',
      dateTa: 'வியாழக்கிழமை, அக் 8, 2026',
      time: '7:00 PM IST',
      timeTa: 'இரவு 7:00 மணி',
      venue: 'JSCA International Stadium Complex, Ranchi',
      venueTa: 'ஜேஎஸ்சிஏ சர்வதேச அரங்கம், ராஞ்சி',
      format: 'T20I',
      countdownHours: 150,
    },
    {
      id: 'up-4',
      tournament: 'West Indies Tour of India',
      tournamentTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம்',
      matchNumber: '3rd T20I',
      matchNumberTa: '3வது டி20',
      team1: { id: 'ind', name: 'India', nameTa: 'இந்தியா', shortName: 'IND', color: '#0055A5', secondaryColor: '#FF671F', logo: '🇮🇳' },
      team2: { id: 'wi', name: 'West Indies', nameTa: 'மேற்கிந்திய தீவுகள்', shortName: 'WI', color: '#7B002C', secondaryColor: '#FFCC00', logo: '🌴' },
      date: 'Sunday, Oct 11, 2026',
      dateTa: 'ஞாயிற்றுக்கிழமை, அக் 11, 2026',
      time: '7:00 PM IST',
      timeTa: 'இரவு 7:00 மணி',
      venue: 'Holkar Cricket Stadium, Indore',
      venueTa: 'ஹோல்கர் கிரிக்கெட் அரங்கம், இந்தூர்',
      format: 'T20I',
      countdownHours: 220,
    },
    {
      id: 'up-5',
      tournament: 'Australia Tour of India',
      tournamentTa: 'ஆஸ்திரேலியா இந்திய சுற்றுப்பயணம்',
      matchNumber: '1st ODI',
      matchNumberTa: '1வது ஒருநாள் போட்டி',
      team1: { id: 'ind', name: 'India', nameTa: 'இந்தியா', shortName: 'IND', color: '#0055A5', secondaryColor: '#FF671F', logo: '🇮🇳' },
      team2: { id: 'aus', name: 'Australia', nameTa: 'ஆஸ்திரேலியா', shortName: 'AUS', color: '#004B23', secondaryColor: '#FFCC00', logo: '🇦🇺' },
      date: 'Saturday, Oct 24, 2026',
      dateTa: 'சனிக்கிழமை, அக் 24, 2026',
      time: '1:30 PM IST',
      timeTa: 'மதியம் 1:30 மணி',
      venue: 'Wankhede Stadium, Mumbai',
      venueTa: 'வான்கடே அரங்கம், மும்பை',
      format: 'ODI',
      countdownHours: 530,
    }
  ];

  const filteredMatches = matches.filter((m) => {
    if (filter === 'odi') return m.format === 'ODI';
    if (filter === 't20i') return m.format === 'T20I';
    return true;
  });

  return (
    <section className="space-y-4">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>📅</span>
            <span>{isTa ? 'அடுத்து வரவிருக்கும் சர்வதேச போட்டிகள் & அட்டவணை' : 'Upcoming International Matches Schedule'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isTa ? 'பிசிசிஐ (BCCI) அதிகாரப்பூர்வ சர்வதேச கால அட்டவணை' : 'Official BCCI International Cricket Fixtures'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isTa ? 'அனைத்தும்' : 'All'}
          </button>
          <button
            onClick={() => setFilter('odi')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'odi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ODI
          </button>
          <button
            onClick={() => setFilter('t20i')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 't20i' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            T20I
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-200 shadow-lg flex flex-col justify-between space-y-4 group"
          >
            {/* Top row: Tournament & Date Badge */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                {isTa ? m.tournamentTa || m.tournament : m.tournament} • {isTa ? m.matchNumberTa || m.matchNumber : m.matchNumber}
              </span>
              
              {/* CLEAR, PROMINENT DATE BADGE */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{isTa ? m.dateTa || m.date : m.date}</span>
              </div>
            </div>

            {/* Teams display */}
            <div className="space-y-3 py-1">
              {/* Team 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.team1.logo}</span>
                  <span className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {isTa ? m.team1.nameTa || m.team1.name : m.team1.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                  {m.team1.shortName}
                </span>
              </div>

              {/* VS Divider */}
              <div className="flex items-center gap-2">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-[11px] font-black uppercase text-amber-400/80 px-2 tracking-wider">VS</span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              {/* Team 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.team2.logo}</span>
                  <span className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {isTa ? m.team2.nameTa || m.team2.name : m.team2.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                  {m.team2.shortName}
                </span>
              </div>
            </div>

            {/* Bottom details: Time & Venue */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-sky-400">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>{isTa ? m.timeTa : m.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate max-w-[240px]">{isTa ? m.venueTa : m.venue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
