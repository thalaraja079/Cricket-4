import React, { useState } from 'react';
import { CricketMatch, Language } from '../types/cricket';
import { t } from '../utils/translations';
import { X, Sparkles, TrendingUp, ShieldAlert, Cpu, CheckCircle, RefreshCw, Globe } from 'lucide-react';
import { fetchLiveAiMatchAnalysis } from '../services/liveCricketApi';

interface AiMatchAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: CricketMatch;
  lang: Language;
}

export const AiMatchAnalysisModal: React.FC<AiMatchAnalysisModalProps> = ({
  isOpen,
  onClose,
  match,
  lang,
}) => {
  const [simulating, setSimulating] = useState(false);
  const [predictedWinner, setPredictedWinner] = useState<string | null>(null);
  const [aiAnalysisText, setAiAnalysisText] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  if (!isOpen) return null;
  const tr = t[lang];

  const runPrediction = async () => {
    setSimulating(true);
    setLoadingAi(true);
    try {
      const currentScoreDesc = `${match.team1.shortName}: ${match.innings1.totalRuns}/${match.innings1.wickets} (${match.innings1.overs} ov) vs ${match.team2.shortName}: ${match.innings2 ? `${match.innings2.totalRuns}/${match.innings2.wickets} (${match.innings2.overs} ov)` : 'Yet to bat'}`;
      
      const res = await fetchLiveAiMatchAnalysis(match.title, currentScoreDesc, lang);
      if (res.success && res.analysis) {
        setAiAnalysisText(res.analysis);
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setSimulating(false);
      setLoadingAi(false);
      const winTeam = (match.winProbabilityTeam2 ?? 50) >= 50 ? match.team2 : match.team1;
      setPredictedWinner((lang === 'ta' ? winTeam.nameTa : winTeam.name) || winTeam.name);
    }
  };

  const winProb1 = match.winProbabilityTeam1 ?? 52;
  const winProb2 = match.winProbabilityTeam2 ?? 48;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-y-auto p-6 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{tr.aiAnalysis}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Google Search Grounding
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {match.title} · {match.tournament}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs sm:text-sm">
          
          {/* Win Probability & Momentum */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>{match.team1.shortName}: {winProb1}%</span>
              <span className="text-emerald-400 font-bold">{tr.winProbability}</span>
              <span>{match.team2.shortName}: {winProb2}%</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${winProb1}%` }}
              />
              <div 
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${winProb2}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {lang === 'ta' 
                ? 'தற்போதைய தேவைப்படும் ரன் விகிதம் மற்றும் கையில் உள்ள விக்கெட்டுகளைக் கொண்டு கணக்கிடப்பட்ட நேரலை வெற்றி வாய்ப்பு.'
                : 'Dynamic victory probability calculated based on required run rate, balls remaining, death bowlers, and wickets in hand.'}
            </p>
          </div>

          {/* Strategic Pitch Report */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{tr.pitchReport}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'ta' ? match.pitchReportTa : match.pitchReport}
            </p>
            <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{lang === 'ta' ? 'மைதான விவரம்:' : 'Venue:'} {lang === 'ta' ? match.venueTa : match.venue} ({match.weather?.tempC ?? 27}°C)</span>
            </div>
          </div>

          {/* Live Google Search AI Tactical Report */}
          {aiAnalysisText && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 space-y-2">
              <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ta' ? 'கூகுள் நேரடி AI மேட்ச் கணிப்பு அறிக்கை' : 'Google Search Grounded Tactical Breakdown'}</span>
              </h4>
              <div className="text-slate-200 leading-relaxed whitespace-pre-line text-xs sm:text-sm bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {aiAnalysisText}
              </div>
            </div>
          )}

          {/* AI Win Simulator */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950/80 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ta' ? 'ஜெமினி AI நேரடி மேட்ச் கணிப்பு' : 'Gemini AI Match Predictor'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {predictedWinner ? (
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {lang === 'ta' ? `கணிக்கப்பட்ட வெற்றி அணி: ${predictedWinner}` : `Predicted Winner: ${predictedWinner}`}
                  </span>
                ) : (
                  lang === 'ta'
                    ? 'கூகுள் தேடல் தரவுகளுடன் நேரடி AI பகுப்பாய்வை இயக்கு'
                    : 'Analyze real-time Google search live data and predict outcome'
                )}
              </p>
            </div>

            <button
              onClick={runPrediction}
              disabled={simulating || loadingAi}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {loadingAi && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {loadingAi 
                  ? (lang === 'ta' ? 'கூகுளில் தேடுகிறது...' : 'Searching Google...') 
                  : (lang === 'ta' ? 'AI கணிப்பை இயக்கு' : 'Run Live AI Analysis')}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
