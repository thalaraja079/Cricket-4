import React from 'react';
import { Trophy, Calendar, MapPin, CheckCircle2, Award, Clock } from 'lucide-react';
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
        {/* Left Column: Official Completed Match (from BCCI) */}
        <div className="lg:col-span-7 p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              <Trophy className="w-4 h-4 text-emerald-400" />
              {isTa ? 'சமீபத்திய அதிகாரப்பூர்வ போட்டி முடிவு' : 'Official Match Result (Latest Completed)'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              {isTa ? '2வது ஒருநாள் போட்டி · முடிந்தது' : '2nd ODI · Completed'}
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {isTa ? 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம்' : 'West Indies Tour of India'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTa ? 'பர்சபரா அரங்கம், குவஹாத்தி • புதன்கிழமை, செப் 30, 2026' : 'Barsapara Cricket Stadium, Guwahati • Wednesday, Sep 30, 2026'}
            </p>
          </div>

          {/* Scores Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Team 1: West Indies */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌴</span>
                <div>
                  <div className="text-sm font-bold text-slate-300">
                    {isTa ? 'மேற்கிந்திய தீவுகள்' : 'West Indies'}
                  </div>
                  <div className="text-xs text-slate-400">(50.0 ov)</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-rose-400 font-mono">405/7</span>
              </div>
            </div>

            {/* Team 2: India */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <div className="text-sm font-bold text-white">
                    {isTa ? 'இந்தியா' : 'India'}
                  </div>
                  <div className="text-xs text-slate-400">(43.3 ov)</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-sky-400 font-mono">406/2</span>
              </div>
            </div>
          </div>

          {/* Result Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm sm:text-base">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isTa ? 'இந்தியா 8 விக்கெட்டுகள் வித்தியாசத்தில் வெற்றி பெற்றது! (2-0 முன்னிலை)' : 'India won by 8 wickets (IND leads 3-match series 2-0)'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {isTa
                ? 'சுப்மன் கில் 142* (106) மற்றும் விராட் கோலி 112* (88) ரன்கள் விளாசி ஆட்டமிழக்காமல் இருக்க, இந்தியா 406 ரன்கள் இலக்கை 43.3 ஓவர்களில் எளிதாக எட்டி தொடரை வென்றது.'
                : 'Shubman Gill scored an unbeaten 142* alongside Virat Kohli 112* as India chased down a mammoth 406 with 39 balls to spare to clinch the series.'}
            </p>
          </div>

          {/* Toss and POTM */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400 pt-1">
            <span>🪙 {isTa ? 'டாஸ்: இந்தியா டாஸ் வென்று பந்துவீச்சைத் தேர்வு செய்தது' : 'Toss: India won toss and opted to bowl'}</span>
            <span className="font-semibold text-amber-300">
              POTM: {isTa ? 'சுப்மன் கில் 142* (106b)' : 'Shubman Gill 142* (106b)'}
            </span>
          </div>
        </div>

        {/* Right Column: Next Big Upcoming Match */}
        <div className="lg:col-span-5 p-6 sm:p-7 bg-slate-950/40 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-sky-400">
                <Calendar className="w-4 h-4 text-sky-400" />
                {isTa ? 'அடுத்து வரவிருக்கும் முக்கிய போட்டி' : 'Next Big Scheduled Match'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Award className="w-3.5 h-3.5" />
                {isTa ? '3வது ஒருநாள் போட்டி' : '3rd ODI (Final ODI)'}
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-medium">
                {isTa ? 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம்' : 'West Indies Tour of India'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <span>🇮🇳 {isTa ? 'இந்தியா' : 'India'}</span>
                <span className="text-amber-400 text-sm font-bold">vs</span>
                <span>🌴 {isTa ? 'மேற்கிந்திய தீவுகள்' : 'West Indies'}</span>
              </div>
            </div>

            {/* Time and Venue Badges */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sky-300 bg-sky-500/10 border border-sky-500/20 px-3 py-2 rounded-xl">
                <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{isTa ? 'சனிக்கிழமை, அக் 3, 2026 • மதியம் 1:30 மணி' : 'Saturday, Oct 3, 2026 • 1:30 PM IST'}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 px-3 py-1.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{isTa ? 'மகாராஜா யாதவீந்திரா சிங் அரங்கம், சண்டிகர் (முல்லன்பூர்)' : 'Maharaja Yadavindra Singh Stadium, New Chandigarh (Mullanpur)'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{isTa ? 'தொடங்க இன்னும்: 28 மணி நேரம்' : 'Starts in: 28 hours'}</span>
            </span>
            <span className="text-slate-400 font-mono">BCCI Official</span>
          </div>
        </div>
      </div>
    </div>
  );
};
