import React, { useState } from 'react';
import { Language } from './types/cricket';
import { Header } from './components/Header';
import { NoLiveMatchHero } from './components/NoLiveMatchHero';
import { UpcomingMatches } from './components/UpcomingMatches';
import { PointsTable } from './components/PointsTable';
import { RecentResults } from './components/RecentResults';
import { PlayerStats } from './components/PlayerStats';
import { WordPressEmbedModal } from './components/WordPressEmbedModal';
import { PushNotificationBanner } from './components/PushNotificationBanner';
import { WordPressArticlesSection } from './components/WordPressArticlesSection';
import { Footer } from './components/Footer';

export default function App() {
  // Default to English ('en') as requested by user, with 1-click toggle to Tamil ('ta')
  const getInitialLang = (): Language => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      if (langParam === 'ta' || langParam === 'en') return langParam;
    }
    return 'en';
  };

  const [lang, setLang] = useState<Language>(getInitialLang);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'points' | 'results' | 'stats'>('live');
  const [isWordPressModalOpen, setIsWordPressModalOpen] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ta' ? 'en' : 'ta'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={toggleLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWordPress={() => setIsWordPressModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Browser Push Notification Permission & Status Bar */}
        <PushNotificationBanner lang={lang} />

        {/* All Sections: Truthful Real-World Match Overview */}
        {activeTab === 'all' && (
          <div className="space-y-10">
            {/* 1. Official Completed & Next Match Hero Spotlight */}
            <NoLiveMatchHero lang={lang} />

            {/* 2. Upcoming Matches Grid */}
            <UpcomingMatches lang={lang} />

            {/* 3. Points Table */}
            <PointsTable lang={lang} />

            {/* 4. Recent Results */}
            <RecentResults lang={lang} />

            {/* 5. Player Leaderboard / Stats */}
            <PlayerStats lang={lang} />

            {/* 6. WordPress Articles & News Section */}
            <WordPressArticlesSection lang={lang} />
          </div>
        )}

        {/* Tab 1: Latest Result & Official Match Spotlight */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <NoLiveMatchHero lang={lang} />
            <RecentResults lang={lang} />
          </div>
        )}

        {/* Tab 2: Upcoming Matches */}
        {activeTab === 'upcoming' && (
          <UpcomingMatches lang={lang} />
        )}

        {/* Tab 3: Points Table */}
        {activeTab === 'points' && (
          <PointsTable lang={lang} />
        )}

        {/* Tab 4: Results */}
        {activeTab === 'results' && (
          <RecentResults lang={lang} />
        )}

        {/* Tab 5: Player Stats & Leaderboard */}
        {activeTab === 'stats' && (
          <PlayerStats lang={lang} />
        )}

      </main>

      {/* WordPress Embed Modal */}
      <WordPressEmbedModal
        isOpen={isWordPressModalOpen}
        onClose={() => setIsWordPressModalOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectTab={setActiveTab}
      />

    </div>
  );
}
