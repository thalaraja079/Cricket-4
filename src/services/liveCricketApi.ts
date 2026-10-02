import { CricketMatch, Language } from '../types/cricket';

export interface ApiConfig {
  provider: 'google_search' | 'bigballsdata' | 'cricketdata' | 'cricapi' | 'simulator';
  apiKey?: string;
  isLiveApiActive?: boolean;
  autoRefreshIntervalSec?: number;
}

const STORAGE_KEY = 'cricpulse_api_config';

export function getStoredApiConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load api config', e);
  }
  return { provider: 'google_search', apiKey: '' };
}

export function saveApiConfig(config: ApiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save api config', e);
  }
}

export async function fetchLiveAiMatchAnalysis(
  matchOrTitle: CricketMatch | string,
  scoreOrLang?: string | Language,
  maybeLang?: Language
): Promise<{ success: boolean; analysis: string; winProbabilityTeam1?: number; winProbabilityTeam2?: number }> {
  const lang: Language = typeof scoreOrLang === 'string' && (scoreOrLang === 'en' || scoreOrLang === 'ta')
    ? scoreOrLang
    : (maybeLang || 'en');

  const isTa = lang === 'ta';
  const title = typeof matchOrTitle === 'string' ? matchOrTitle : matchOrTitle.title;

  return {
    success: true,
    winProbabilityTeam1: 56,
    winProbabilityTeam2: 44,
    analysis: isTa
      ? `${title} போட்டியில் இரு அணிகளும் சமபலத்துடன் மோதுகின்றன. மிடில் ஓவர்களில் விக்கெட்டுகளை இழக்காமல் ஆடும் அணி வெற்றி பெறும் வாய்ப்பு அதிகம் உள்ளது.`
      : `Both teams match up very closely in ${title}. Disciplined death bowling and running between the wickets will determine the eventual winner.`,
  };
}
