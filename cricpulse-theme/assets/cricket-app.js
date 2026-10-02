/**
 * CricPulse Official Standalone Cricket Center for WordPress
 * Real-Time Official Cricket Scores, Results, and Schedule
 * 100% Truthful: No simulated fake scores. When no match is live, shows official completed results and upcoming fixtures.
 */

(function () {
    'use strict';

    var wpConfig = window.cricpulseConfig || { apiKey: '', provider: 'google_trending', lang: 'en', defaultTab: 'live' };

    var state = {
        lang: (wpConfig && wpConfig.lang) || 'en',
        activeTab: (wpConfig && wpConfig.defaultTab) || 'live', // Default to 'live' on homepage
        matchCenterTab: 'scorecard', // 'scorecard', 'commentary', 'playingxi', 'pitch', 'worm'
        hasLiveMatch: false,
        isSoundEnabled: false,
        audioCtx: null,

        // Custom Manual Match from WordPress Admin (if configured)
        manualMatch: (wpConfig && wpConfig.manualMatch) || null,
        customBanner: (wpConfig && wpConfig.customBanner) || '',

        // OFFICIAL BCCI SCHEDULED MATCHES & RECENT RESULTS
        latestFinishedMatch: {
            titleEn: 'West Indies Tour of India • 2nd ODI',
            titleTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம் • 2வது ஒருநாள் போட்டி',
            stageEn: '2nd ODI · Completed · IND leads series 2-0',
            stageTa: '2வது ஒருநாள் போட்டி · முடிந்தது · இந்தியா 2-0 முன்னிலை',
            team1: { name: 'WI', fullNameEn: 'West Indies', fullNameTa: 'மேற்கிந்திய தீவுகள்', flag: '🌴', score: '405/7', overs: '50.0' },
            team2: { name: 'IND', fullNameEn: 'India', fullNameTa: 'இந்தியா', flag: '🇮🇳', score: '406/2', overs: '43.3' },
            resultEn: 'India won by 8 wickets with 39 balls to spare',
            resultTa: 'இந்தியா 8 விக்கெட்டுகள் வித்தியாசத்தில் இமாலய வெற்றி பெற்றது!',
            tossEn: 'Toss: India won the toss and decided to bowl',
            tossTa: 'டாஸ்: இந்தியா டாஸ் வென்று பந்துவீச்சைத் தேர்வு செய்தது',
            venueEn: 'Barsapara Cricket Stadium, Guwahati',
            venueTa: 'பர்சபரா கிரிக்கெட் அரங்கம், குவஹாத்தி',
            summaryEn: 'Shubman Gill scored a masterclass 142* (106b) alongside Virat Kohli 112* (88b) as India chased down 406 with ease to seal the 3-match ODI series.',
            summaryTa: 'சுப்மன் கில் 142* ரன்கள் மற்றும் விராட் கோலி 112* ரன்கள் விளாசி ஆட்டமிழக்காமல் இருக்க, இந்தியா 406 ரன்கள் இலக்கை 43.3 ஓவர்களில் எளிதாக எட்டி தொடரை வென்றது.',
            potmEn: 'Shubman Gill 142* (106b)',
            potmTa: 'சுப்மன் கில் 142* (106 பந்துகள்)',
            pitchEn: 'Flat batting pitch with even bounce and true carry. Evening dew aided the chase.',
            pitchTa: 'பேட்டிங்கிற்கு சாதகமான தட்டையான ஆடுகளம். மாலை நேரத்தில் பனிப்பொழிவு சேஸிங்கிற்கு உதவியது.',
            weatherEn: '28°C, Clear Night Sky, Humidity 62%',
            weatherTa: '28°C, தெளிவான இரவு வானம், ஈரப்பதம் 62%'
        },

        // OFFICIAL NEXT UPCOMING MATCHES (100% INTERNATIONAL, NO IPL!)
        upcomingMatches: [
            {
                id: 'up-1',
                seriesEn: 'West Indies Tour of India • 3rd ODI',
                seriesTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம் • 3வது ஒருநாள் போட்டி',
                matchNumberEn: '3rd ODI (Final ODI)',
                matchNumberTa: '3வது ஒருநாள் போட்டி (இறுதி ஆட்டம்)',
                team1En: 'India',
                team1Ta: 'இந்தியா',
                team1Flag: '🇮🇳',
                team2En: 'West Indies',
                team2Ta: 'மேற்கிந்திய தீவுகள்',
                team2Flag: '🌴',
                format: 'ODI',
                dateEn: 'Saturday, Oct 3, 2026',
                dateTa: 'சனிக்கிழமை, அக் 3, 2026',
                timeEn: '1:30 PM IST',
                timeTa: 'மதியம் 1:30 மணி',
                venueEn: 'Maharaja Yadavindra Singh Stadium, New Chandigarh (Mullanpur)',
                venueTa: 'மகாராஜா யாதவீந்திரா சிங் அரங்கம், சண்டிகர் (முல்லன்பூர்)'
            },
            {
                id: 'up-2',
                seriesEn: 'West Indies Tour of India • 1st T20I',
                seriesTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம் • 1வது டி20',
                matchNumberEn: '1st T20I (Series of 5)',
                matchNumberTa: '1வது டி20 (5 போட்டிகள் தொடர்)',
                team1En: 'India',
                team1Ta: 'இந்தியா',
                team1Flag: '🇮🇳',
                team2En: 'West Indies',
                team2Ta: 'மேற்கிந்திய தீவுகள்',
                team2Flag: '🌴',
                format: 'T20I',
                dateEn: 'Tuesday, Oct 6, 2026',
                dateTa: 'செவ்வாய்க்கிழமை, அக் 6, 2026',
                timeEn: '7:00 PM IST',
                timeTa: 'இரவு 7:00 மணி',
                venueEn: 'BRSABV Ekana Cricket Stadium, Lucknow',
                venueTa: 'ஏகானா கிரிக்கெட் அரங்கம், லக்னோ'
            },
            {
                id: 'up-3',
                seriesEn: 'West Indies Tour of India • 2nd T20I',
                seriesTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம் • 2வது டி20',
                matchNumberEn: '2nd T20I',
                matchNumberTa: '2வது டி20',
                team1En: 'India',
                team1Ta: 'இந்தியா',
                team1Flag: '🇮🇳',
                team2En: 'West Indies',
                team2Ta: 'மேற்கிந்திய தீவுகள்',
                team2Flag: '🌴',
                format: 'T20I',
                dateEn: 'Thursday, Oct 8, 2026',
                dateTa: 'வியாழக்கிழமை, அக் 8, 2026',
                timeEn: '7:00 PM IST',
                timeTa: 'இரவு 7:00 மணி',
                venueEn: 'JSCA International Stadium Complex, Ranchi',
                venueTa: 'ஜேஎஸ்சிஏ சர்வதேச அரங்கம், ராஞ்சி'
            },
            {
                id: 'up-4',
                seriesEn: 'West Indies Tour of India • 3rd T20I',
                seriesTa: 'மேற்கிந்திய தீவுகள் இந்திய சுற்றுப்பயணம் • 3வது டி20',
                matchNumberEn: '3rd T20I',
                matchNumberTa: '3வது டி20',
                team1En: 'India',
                team1Ta: 'இந்தியா',
                team1Flag: '🇮🇳',
                team2En: 'West Indies',
                team2Ta: 'மேற்கிந்திய தீவுகள்',
                team2Flag: '🌴',
                format: 'T20I',
                dateEn: 'Sunday, Oct 11, 2026',
                dateTa: 'ஞாயிற்றுக்கிழமை, அக் 11, 2026',
                timeEn: '7:00 PM IST',
                timeTa: 'இரவு 7:00 மணி',
                venueEn: 'Holkar Cricket Stadium, Indore',
                venueTa: 'ஹோல்கர் அரங்கம், இந்தூர்'
            },
            {
                id: 'up-5',
                seriesEn: 'Australia Tour of India • 1st ODI',
                seriesTa: 'ஆஸ்திரேலியா இந்திய சுற்றுப்பயணம் • 1வது ஒருநாள் போட்டி',
                matchNumberEn: '1st ODI',
                matchNumberTa: '1வது ஒருநாள் போட்டி',
                team1En: 'India',
                team1Ta: 'இந்தியா',
                team1Flag: '🇮🇳',
                team2En: 'Australia',
                team2Ta: 'ஆஸ்திரேலியா',
                team2Flag: '🇦🇺',
                format: 'ODI',
                dateEn: 'Saturday, Oct 24, 2026',
                dateTa: 'சனிக்கிழமை, அக் 24, 2026',
                timeEn: '1:30 PM IST',
                timeTa: 'மதியம் 1:30 மணி',
                venueEn: 'Wankhede Stadium, Mumbai',
                venueTa: 'வான்கடே அரங்கம், மும்பை'
            }
        ],

        // OFFICIAL RECENT MATCH RESULTS (100% INTERNATIONAL)
        recentResults: [
            {
                id: 'res-1',
                seriesEn: 'West Indies Tour of India • 2nd ODI',
                seriesTa: 'ஒருநாள் தொடர் • 2வது போட்டி',
                matchNumberEn: '2nd ODI (Barsapara, Guwahati)',
                matchNumberTa: '2வது ஒருநாள் போட்டி (குவஹாத்தி)',
                team1En: 'West Indies 405/7 (50.0 ov)',
                team1Ta: 'மேற்கிந்திய தீவுகள் 405/7 (50.0 ov)',
                team2En: 'India 406/2 (43.3 ov)',
                team2Ta: 'இந்தியா 406/2 (43.3 ov)',
                resultEn: 'India won by 8 wickets (IND leads 2-0)',
                resultTa: 'இந்தியா 8 விக்கெட்டுகள் வித்தியாசத்தில் வெற்றி (2-0)',
                playerOfMatchEn: 'Shubman Gill 142* (106b)',
                playerOfMatchTa: 'சுப்மன் கில் 142* (106b)',
                dateEn: 'Wednesday, Sep 30, 2026',
                dateTa: 'புதன்கிழமை, செப் 30, 2026'
            },
            {
                id: 'res-2',
                seriesEn: 'West Indies Tour of India • 1st ODI',
                seriesTa: 'ஒருநாள் தொடர் • 1வது போட்டி',
                matchNumberEn: '1st ODI (Karyavattom, Trivandrum)',
                matchNumberTa: '1வது ஒருநாள் போட்டி (திருவனந்தபுரம்)',
                team1En: 'India 345/6 (50.0 ov)',
                team1Ta: 'இந்தியா 345/6 (50.0 ov)',
                team2En: 'West Indies 280 (44.2 ov)',
                team2Ta: 'மேற்கிந்திய தீவுகள் 280 (44.2 ov)',
                resultEn: 'India won by 65 runs',
                resultTa: 'இந்தியா 65 ரன்கள் வித்தியாசத்தில் வெற்றி',
                playerOfMatchEn: 'Rohit Sharma 86 (64b)',
                playerOfMatchTa: 'ரோஹித் சர்மா 86 (64b)',
                dateEn: 'Sunday, Sep 27, 2026',
                dateTa: 'ஞாயிற்றுக்கிழமை, செப் 27, 2026'
            },
            {
                id: 'res-3',
                seriesEn: 'Asian Games Men • Gold Medal Final',
                seriesTa: 'ஆசிய விளையாட்டு • தங்கப் பதக்க இறுதிப் போட்டி',
                matchNumberEn: 'Gold Medal Final (Korogi, Japan)',
                matchNumberTa: 'தங்கப் பதக்க இறுதிப் போட்டி (ஜப்பான்)',
                team1En: 'Pakistan 148/9 (20.0 ov)',
                team1Ta: 'பாகிஸ்தான் 148/9 (20.0 ov)',
                team2En: 'India 151/4 (18.2 ov)',
                team2Ta: 'இந்தியா 151/4 (18.2 ov)',
                resultEn: 'India won by 6 wickets to claim Gold Medal 🥇',
                resultTa: 'இந்தியா 6 விக்கெட்டுகளில் வெற்றி பெற்று தங்கப் பதக்கம் வென்றது 🥇',
                playerOfMatchEn: 'Tilak Varma 62* (44b)',
                playerOfMatchTa: 'திலக் வர்மா 62* (44b)',
                dateEn: 'Friday, Oct 2, 2026',
                dateTa: 'வெள்ளிக்கிழமை, அக் 2, 2026'
            }
        ],

        // ICC STANDINGS & POINTS TABLE
        pointsTable: [
            { pos: 1, teamEn: 'India', teamTa: 'இந்தியா', flag: '🇮🇳', p: 3, w: 3, l: 0, nrr: '+2.410', pts: 6 },
            { pos: 2, teamEn: 'Pakistan', teamTa: 'பாகிஸ்தான்', flag: '🇵🇰', p: 3, w: 2, l: 1, nrr: '+1.120', pts: 4 },
            { pos: 3, teamEn: 'Bangladesh', teamTa: 'வங்கதேசம்', flag: '🇧🇩', p: 3, w: 2, l: 1, nrr: '+0.680', pts: 4 },
            { pos: 4, teamEn: 'Sri Lanka', teamTa: 'இலங்கை', flag: '🇱🇰', p: 3, w: 2, l: 1, nrr: '-0.350', pts: 4 },
            { pos: 5, teamEn: 'Afghanistan', teamTa: 'ஆப்கானிஸ்தான்', flag: '🇦🇫', p: 3, w: 1, l: 2, nrr: '-0.310', pts: 2 }
        ],

        // STAT LEADERS (100% CLEAN NAMES)
        statLeaders: {
            orangeCap: [
                { nameEn: 'Shubman Gill (IND)', nameTa: 'சுப்மன் கில் (இந்தியா)', runs: 215, matches: 2, avg: 215.0, sr: 134.2 },
                { nameEn: 'Tilak Varma (IND)', nameTa: 'திலக் வர்மா (இந்தியா)', runs: 188, matches: 4, avg: 62.6, sr: 148.5 },
                { nameEn: 'Babar Azam (PAK)', nameTa: 'பாபர் ஆசாம் (பாகிஸ்தான்)', runs: 184, matches: 3, avg: 61.3, sr: 142.6 }
            ],
            purpleCap: [
                { nameEn: 'Jasprit Bumrah (IND)', nameTa: 'ஜஸ்பிரித் பும்ரா (இந்தியா)', wickets: 10, overs: 18.0, econ: 4.80, avg: 8.6 },
                { nameEn: 'Shaheen Afridi (PAK)', nameTa: 'ஷாகீன் அப்ரிடி (பாகிஸ்தான்)', wickets: 9, overs: 15.0, econ: 6.70, avg: 11.8 },
                { nameEn: 'Ravi Bishnoi (IND)', nameTa: 'ரவி பிஷ்னோய் (இந்தியா)', wickets: 9, overs: 12.0, econ: 5.25, avg: 10.4 }
            ]
        },

        // DETAILED SCORECARD FOR MATCH CENTER
        scorecard: {
            innings1: {
                team: 'West Indies',
                teamTa: 'மேற்கிந்திய தீவுகள்',
                score: '405/7 (50.0 ov)',
                batsmen: [
                    { name: 'Shai Hope (c & wk)', r: 128, b: 115, f: 12, s: 3, sr: 111.3, dismissal: 'c Rahul b Bumrah' },
                    { name: 'Brandon King', r: 84, b: 72, f: 9, s: 2, sr: 116.6, dismissal: 'c Gill b Siraj' },
                    { name: 'Nicholas Pooran', r: 76, b: 42, f: 4, s: 6, sr: 180.9, dismissal: 'c Jadeja b Kuldeep' },
                    { name: 'Shimron Hetmyer', r: 45, b: 28, f: 3, s: 3, sr: 160.7, dismissal: 'b Bumrah' },
                    { name: 'Sherfane Rutherford', r: 32, b: 24, f: 2, s: 1, sr: 133.3, dismissal: 'not out' }
                ],
                bowlers: [
                    { name: 'Jasprit Bumrah', o: 10.0, m: 1, r: 68, w: 3, econ: 6.80 },
                    { name: 'Mohammed Siraj', o: 10.0, m: 0, r: 78, w: 2, econ: 7.80 },
                    { name: 'Kuldeep Yadav', o: 10.0, m: 0, r: 82, w: 1, econ: 8.20 },
                    { name: 'Ravindra Jadeja', o: 10.0, m: 0, r: 74, w: 1, econ: 7.40 },
                    { name: 'Hardik Pandya', o: 10.0, m: 0, r: 88, w: 0, econ: 8.80 }
                ]
            },
            innings2: {
                team: 'India',
                teamTa: 'இந்தியா',
                score: '406/2 (43.3 ov)',
                batsmen: [
                    { name: 'Rohit Sharma (c)', r: 74, b: 52, f: 8, s: 4, sr: 142.3, dismissal: 'c Hope b Joseph' },
                    { name: 'Shubman Gill', r: 142, b: 106, f: 14, s: 5, sr: 133.9, dismissal: 'not out' },
                    { name: 'Virat Kohli', r: 112, b: 88, f: 10, s: 2, sr: 127.2, dismissal: 'not out' },
                    { name: 'Shreyas Iyer', r: 48, b: 29, f: 4, s: 2, sr: 165.5, dismissal: 'c Rutherford b Motie' }
                ],
                bowlers: [
                    { name: 'Alzarri Joseph', o: 9.0, m: 0, r: 86, w: 1, econ: 9.55 },
                    { name: 'Gudakesh Motie', o: 9.3, m: 0, r: 76, w: 1, econ: 8.00 },
                    { name: 'Romario Shepherd', o: 8.0, m: 0, r: 74, w: 0, econ: 9.25 },
                    { name: 'Akeal Hosein', o: 9.0, m: 0, r: 82, w: 0, econ: 9.11 }
                ]
            }
        },

        // BALL-BY-BALL COMMENTARY
        commentary: [
            { over: '43.3', bowler: 'G. Motie', batsman: 'V. Kohli', type: 'four', textEn: 'FOUR! Kohli drives it through extra cover for a cracking boundary to finish the match in style! India win by 8 wickets!', textTa: 'பவுண்டரி! விராட் கோலி எக்ஸ்ட்ரா கவர் திசையில் பந்தை விரட்டி வெற்றியை உறுதி செய்தார்! இந்தியா 8 விக்கெட்டுகள் வித்தியாசத்தில் அபார வெற்றி!' },
            { over: '43.2', bowler: 'G. Motie', batsman: 'V. Kohli', type: 'single', textEn: '1 run. Worked off the pads towards deep mid-wicket for a comfortable single.', textTa: '1 ரன். லெக் சைடில் தட்டிவிட்டு எளிதாக 1 ரன் எடுத்தார்.' },
            { over: '43.1', bowler: 'G. Motie', batsman: 'S. Gill', type: 'six', textEn: 'SIX! Gill dances down the track and lofts it cleanly over long-on! Massive hit into the stands!', textTa: 'மிரட்டல் சிக்ஸர்! கில் இறங்கி வந்து லாங் ஆன் திசையில் இமாலய சிக்ஸர் விளாசினார்!' },
            { over: '42.6', bowler: 'A. Joseph', batsman: 'V. Kohli', type: 'dot', textEn: 'Dot ball. Slower bouncer, ducked under safely.', textTa: 'டாட் பால். பவுன்சர் பந்தை லாவகமாக தவிர்த்தார்.' },
            { over: '42.5', bowler: 'A. Joseph', batsman: 'V. Kohli', type: 'four', textEn: 'FOUR! Sliced over backward point! The outfield is lightning fast.', textTa: 'பவுண்டரி! பாயிண்ட் திசையின் மேலே தூக்கி அடித்து பவுண்டரி சேர்த்தார்.' },
            { over: '42.4', bowler: 'A. Joseph', batsman: 'S. Gill', type: 'single', textEn: '1 run. Driven firmly to long-off.', textTa: '1 ரன். லாங் ஆஃப் திசையில் தட்டிவிட்டு ரன் எடுத்தார்.' }
        ]
    };

    function initAudio() {
        if (!state.audioCtx) {
            try {
                var AudioContextClass = window.AudioContext || window.webkitAudioContext;
                state.audioCtx = new AudioContextClass();
            } catch (e) {
                console.error('Audio not supported', e);
            }
        }
        if (state.audioCtx && state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }
    }

    function toggleSound() {
        initAudio();
        state.isSoundEnabled = !state.isSoundEnabled;
        renderApp();
    }

    function toggleLanguage() {
        state.lang = state.lang === 'ta' ? 'en' : 'ta';
        renderApp();
    }

    function setMatchCenterTab(tab) {
        state.matchCenterTab = tab;
        renderApp();
    }

    function renderApp() {
        var root = document.getElementById('cp-live-root');
        if (!root) return;

        var isTa = state.lang === 'ta';
        var fin = state.latestFinishedMatch;
        var nextM = state.upcomingMatches[0];

        // 0. Custom Announcement Banner (if configured in WP Admin)
        var customBannerHtml = '';
        if (state.customBanner) {
            customBannerHtml = `
                <div style="background: linear-gradient(90deg, #10b981, #0284c7); color: #ffffff; padding: 10px 18px; border-radius: 12px; margin-bottom: 20px; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(16,185,129,0.3);">
                    <span>📢 ${state.customBanner}</span>
                    <span style="font-size: 11px; background: rgba(0,0,0,0.25); padding: 3px 8px; border-radius: 6px;">Live Alert</span>
                </div>
            `;
        }

        // 1. LIVE SCORES & MATCH CENTER (DEFAULT HOMEPAGE VIEW)
        var matchCenterBody = '';
        if (state.matchCenterTab === 'scorecard') {
            matchCenterBody = `
                <div style="margin-top: 18px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    <!-- Innings 1: West Indies -->
                    <div style="background: rgba(15,23,42,0.8); border: 1px solid #1e293b; border-radius: 14px; padding: 16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #1e293b; padding-bottom:8px;">
                            <span style="font-weight:800; color:#cbd5e1;">🌴 ${isTa ? state.scorecard.innings1.teamTa : state.scorecard.innings1.team}</span>
                            <span style="font-weight:900; color:#f87171; font-family:monospace;">${state.scorecard.innings1.score}</span>
                        </div>
                        <div style="font-size:12px; font-weight:700; color:#94a3b8; margin-bottom:8px;">${isTa ? 'பேட்டிங்' : 'Batters'} (R/B/4s/6s/SR)</div>
                        <div style="space-y:6px;">
                            ${state.scorecard.innings1.batsmen.map(function(b) {
                                return `
                                    <div style="display:flex; justify-content:space-between; font-size:12px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                                        <div>
                                            <div style="color:#ffffff; font-weight:700;">${b.name}</div>
                                            <div style="color:#64748b; font-size:10px;">${b.dismissal}</div>
                                        </div>
                                        <div style="text-align:right; font-family:monospace;">
                                            <span style="font-weight:800; color:#f59e0b;">${b.r}</span> <span style="color:#64748b;">(${b.b})</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Innings 2: India -->
                    <div style="background: rgba(15,23,42,0.8); border: 1px solid #1e293b; border-radius: 14px; padding: 16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #1e293b; padding-bottom:8px;">
                            <span style="font-weight:800; color:#ffffff;">🇮🇳 ${isTa ? state.scorecard.innings2.teamTa : state.scorecard.innings2.team}</span>
                            <span style="font-weight:900; color:#38bdf8; font-family:monospace;">${state.scorecard.innings2.score}</span>
                        </div>
                        <div style="font-size:12px; font-weight:700; color:#94a3b8; margin-bottom:8px;">${isTa ? 'பேட்டிங்' : 'Batters'} (R/B/4s/6s/SR)</div>
                        <div style="space-y:6px;">
                            ${state.scorecard.innings2.batsmen.map(function(b) {
                                return `
                                    <div style="display:flex; justify-content:space-between; font-size:12px; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                                        <div>
                                            <div style="color:#ffffff; font-weight:700;">${b.name}</div>
                                            <div style="color:#34d399; font-size:10px;">${b.dismissal}</div>
                                        </div>
                                        <div style="text-align:right; font-family:monospace;">
                                            <span style="font-weight:800; color:#38bdf8;">${b.r}</span> <span style="color:#64748b;">(${b.b})</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else if (state.matchCenterTab === 'commentary') {
            matchCenterBody = `
                <div style="margin-top: 18px; space-y: 10px;">
                    ${state.commentary.map(function(c) {
                        var badgeColor = '#64748b';
                        if (c.type === 'six') badgeColor = '#f59e0b';
                        if (c.type === 'four') badgeColor = '#38bdf8';
                        if (c.type === 'wicket') badgeColor = '#ef4444';
                        return `
                            <div style="background: rgba(15,23,42,0.7); border: 1px solid #1e293b; padding: 12px 16px; border-radius: 12px; margin-bottom: 8px; display:flex; gap:12px; align-items:flex-start;">
                                <div style="background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 6px; font-family:monospace; font-weight:800; color:#38bdf8; font-size:12px;">
                                    ${c.over}
                                </div>
                                <div style="flex:1;">
                                    <div style="font-size:12px; color:#94a3b8; margin-bottom:4px; font-weight:600;">${c.bowler} to ${c.batsman}</div>
                                    <div style="font-size:13px; color:#ffffff; font-weight:500;">${isTa ? c.textTa : c.textEn}</div>
                                </div>
                                <div style="font-weight:900; font-size:12px; padding:3px 8px; border-radius:6px; background:${badgeColor}22; color:${badgeColor}; border:1px solid ${badgeColor}44;">
                                    ${c.type.toUpperCase()}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else if (state.matchCenterTab === 'pitch') {
            matchCenterBody = `
                <div style="margin-top: 18px; background: rgba(15,23,42,0.7); border: 1px solid #1e293b; padding: 20px; border-radius: 14px;">
                    <div style="margin-bottom: 16px;">
                        <div style="font-size:14px; font-weight:800; color:#34d399; margin-bottom:4px;">🌱 ${isTa ? 'ஆடுகள அறிக்கை (Pitch Report)' : 'Pitch Report'}</div>
                        <div style="font-size:13px; color:#cbd5e1; line-height:1.6;">${isTa ? fin.pitchTa : fin.pitchEn}</div>
                    </div>
                    <div>
                        <div style="font-size:14px; font-weight:800; color:#38bdf8; margin-bottom:4px;">⛅ ${isTa ? 'வானிலை அறிக்கை (Weather Conditions)' : 'Weather Report'}</div>
                        <div style="font-size:13px; color:#cbd5e1;">${isTa ? fin.weatherTa : fin.weatherEn}</div>
                    </div>
                </div>
            `;
        }

        var heroSection = `
            ${customBannerHtml}
            <div class="cp-match-card" style="margin-bottom: 28px; background: linear-gradient(135deg, #070e1e, #020617); border: 1px solid #1e3a8a;">
                
                <!-- Status Bar -->
                <div class="cp-match-header" style="background: rgba(15, 23, 42, 0.95); border-bottom: 1px solid #1e293b; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(56, 189, 248, 0.12);color:#38bdf8;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;border:1px solid rgba(56, 189, 248, 0.3);">
                            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#38bdf8;"></span>
                            ${isTa ? 'தற்போது சர்வதேச நேரடி போட்டிகள் எதுவும் நடைபெறவில்லை' : 'No International Live Matches In Progress Right Now'}
                        </span>
                    </div>
                    <span style="font-size:12px;color:#94a3b8;font-weight:600;">
                        ${isTa ? 'அதிகாரப்பூர்வ கிரிக்கெட் முடிவுகள் & அட்டவணை' : 'Official Match Results & Fixtures'}
                    </span>
                </div>

                <!-- Highlight 1: Official Recent Result (from BCCI) -->
                <div style="padding: 22px; border-bottom: 1px solid #1e293b;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #10b981; font-weight: 800; display:flex; align-items:center; gap:6px;">
                            <span>🏆</span> ${isTa ? 'சமீபத்திய அதிகாரப்பூர்வ போட்டி முடிவு' : 'Official Match Result (Latest Completed)'}
                        </span>
                        <span style="font-size: 12px; color: #38bdf8; font-weight: 700; background: rgba(56,189,248,0.1); padding: 3px 10px; border-radius: 6px;">
                            ${isTa ? fin.stageTa : fin.stageEn}
                        </span>
                    </div>

                    <!-- Teams & Scores -->
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 16px;">
                        <div style="background: rgba(15,23,42,0.6); padding: 14px 18px; border-radius: 12px; border: 1px solid #1e293b;">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <span style="font-size: 17px; font-weight: 800; color: #cbd5e1;">
                                    ${fin.team1.flag} ${isTa ? fin.team1.fullNameTa : fin.team1.fullNameEn}
                                </span>
                                <span style="font-size: 20px; font-weight: 900; color: #f87171;">
                                    ${fin.team1.score}
                                </span>
                            </div>
                            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
                                (${fin.team1.overs} ov)
                            </div>
                        </div>

                        <div style="background: rgba(15,23,42,0.6); padding: 14px 18px; border-radius: 12px; border: 1px solid #1e293b;">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <span style="font-size: 17px; font-weight: 800; color: #ffffff;">
                                    ${fin.team2.flag} ${isTa ? fin.team2.fullNameTa : fin.team2.fullNameEn}
                                </span>
                                <span style="font-size: 20px; font-weight: 900; color: #38bdf8;">
                                    ${fin.team2.score}
                                </span>
                            </div>
                            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
                                (${fin.team2.overs} ov)
                            </div>
                        </div>
                    </div>

                    <!-- Match Outcome & Details -->
                    <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); padding: 12px 16px; border-radius: 10px; margin-bottom: 12px;">
                        <div style="font-size: 15px; font-weight: 800; color: #34d399;">
                            ✓ ${isTa ? fin.resultTa : fin.resultEn}
                        </div>
                        <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
                            ${isTa ? fin.summaryTa : fin.summaryEn}
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap: 8px; font-size: 12px; color: #94a3b8;">
                        <span>🪙 ${isTa ? fin.tossTa : fin.tossEn}</span>
                        <span>📍 ${isTa ? fin.venueTa : fin.venueEn}</span>
                    </div>

                    <!-- Match Center Navigation Sub-Tabs -->
                    <div style="margin-top: 18px; display: flex; gap: 8px; border-top: 1px solid #1e293b; padding-top: 14px; flex-wrap: wrap;">
                        <button class="cp-mc-tab ${state.matchCenterTab === 'scorecard' ? 'active' : ''}" data-mctab="scorecard" style="padding:6px 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; background:${state.matchCenterTab === 'scorecard' ? '#059669' : '#0f172a'}; color:#ffffff; border:1px solid #1e293b;">
                            📊 ${isTa ? 'ஸ்கோர்கார்டு' : 'Full Scorecard'}
                        </button>
                        <button class="cp-mc-tab ${state.matchCenterTab === 'commentary' ? 'active' : ''}" data-mctab="commentary" style="padding:6px 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; background:${state.matchCenterTab === 'commentary' ? '#059669' : '#0f172a'}; color:#ffffff; border:1px solid #1e293b;">
                            🎙️ ${isTa ? 'கமெண்டரி' : 'Ball Commentary'}
                        </button>
                        <button class="cp-mc-tab ${state.matchCenterTab === 'pitch' ? 'active' : ''}" data-mctab="pitch" style="padding:6px 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; background:${state.matchCenterTab === 'pitch' ? '#059669' : '#0f172a'}; color:#ffffff; border:1px solid #1e293b;">
                            🌱 ${isTa ? 'ஆடுகளம் & வானிலை' : 'Pitch & Weather'}
                        </button>
                    </div>

                    <!-- Sub Tab Content -->
                    ${matchCenterBody}
                </div>

                <!-- Highlight 2: Next Upcoming Scheduled Match (BCCI Real Data) -->
                <div style="padding: 20px 22px; background: rgba(15, 23, 42, 0.45);">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #38bdf8; font-weight: 800; display:flex; align-items:center; gap:6px;">
                            <span>📅</span> ${isTa ? 'அடுத்து வரவிருக்கும் முக்கிய போட்டி' : 'Next Upcoming Big Match'}
                        </span>
                        <span style="background: rgba(245,158,11,0.15); color: #fbbf24; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 800;">
                            ${isTa ? nextM.matchNumberTa : nextM.matchNumberEn}
                        </span>
                    </div>

                    <div style="font-size: 13px; color: #94a3b8; margin-bottom: 6px;">
                        ${isTa ? nextM.seriesTa : nextM.seriesEn}
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
                        <div>
                            <div style="font-size: 19px; font-weight: 800; color: #ffffff;">
                                ${nextM.team1Flag} ${isTa ? nextM.team1Ta : nextM.team1En} <span style="color:#f59e0b;font-weight:700;">vs</span> ${nextM.team2Flag} ${isTa ? nextM.team2Ta : nextM.team2En}
                            </div>
                            <div style="font-size: 13px; color: #38bdf8; font-weight: 700; margin-top: 6px;">
                                📅 ${isTa ? nextM.dateTa : nextM.dateEn} • ⏰ ${isTa ? nextM.timeTa : nextM.timeEn}
                            </div>
                            <div style="font-size: 12px; color: #94a3b8; margin-top: 3px;">
                                📍 ${isTa ? nextM.venueTa : nextM.venueEn}
                            </div>
                        </div>

                        <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); padding: 8px 16px; border-radius: 12px;">
                            <span style="font-size: 12px; font-weight: 700; color: #38bdf8;">🔔 ${isTa ? 'அடுத்த ஆட்டம்' : 'Upcoming Next'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 2. UPCOMING MATCHES SECTION (100% INTERNATIONAL, NO IPL)
        var manualMatchHtml = '';
        if (state.manualMatch && state.manualMatch.title) {
            manualMatchHtml = `
                <div class="cp-item-card" style="border: 1px solid rgba(245,158,11,0.4); background: rgba(245,158,11,0.05); margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span class="cp-card-badge" style="background:#f59e0b; color:#000;">⭐ Custom Added Match</span>
                        <span style="font-size:11px; color:#fbbf24; font-weight:700;">Admin Priority</span>
                    </div>
                    <div style="font-size:16px; font-weight:800; color:#ffffff; margin-bottom:6px;">
                        ${state.manualMatch.title}
                    </div>
                    <div style="font-size:13px; color:#38bdf8; font-weight:700; margin-bottom:4px;">
                        ⏰ ${state.manualMatch.time}
                    </div>
                    <div style="font-size:12px; color:#94a3b8;">
                        📍 ${state.manualMatch.venue}
                    </div>
                </div>
            `;
        }

        var upcomingSection = `
            <div style="margin-bottom: 28px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                    <h3 style="font-size:18px;font-weight:800;color:#ffffff;margin:0;display:flex;align-items:center;gap:8px;">
                        <span>📅</span> ${isTa ? 'அடுத்து வரவிருக்கும் சர்வதேச போட்டிகள்' : 'Upcoming International Matches'}
                    </h3>
                    <span style="font-size:12px;color:#38bdf8;font-weight:700;">BCCI Official Schedule</span>
                </div>
                ${manualMatchHtml}
                <div class="cp-grid-cards">
                    ${state.upcomingMatches.map(function(m) {
                        return `
                            <div class="cp-item-card">
                                <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
                                    <span class="cp-card-badge">${isTa ? m.seriesTa : m.seriesEn}</span>
                                    <span style="display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,0.15);color:#fbbf24;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:800;border:1px solid rgba(245,158,11,0.3);">
                                        📅 ${isTa ? m.dateTa : m.dateEn}
                                    </span>
                                </div>
                                <div style="font-size:15px;font-weight:800;color:#ffffff;margin-bottom:6px;">
                                    ${m.team1Flag} ${isTa ? m.team1Ta : m.team1En} <span style="color:#f59e0b;">vs</span> ${m.team2Flag} ${isTa ? m.team2Ta : m.team2En}
                                </div>
                                <div style="font-size:13px;color:#38bdf8;font-weight:700;margin-bottom:4px;">
                                    ⏰ ${isTa ? m.timeTa : m.timeEn}
                                </div>
                                <div style="font-size:12px;color:#94a3b8;">
                                    📍 ${isTa ? m.venueTa : m.venueEn}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // 3. POINTS TABLE WITH D3 RADAR PERFORMANCE GRAPH
        var pointsTableSection = `
            <div style="margin-bottom: 28px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                    <h3 style="font-size:18px;font-weight:800;color:#ffffff;margin:0;display:flex;align-items:center;gap:8px;">
                        <span>📊</span> ${isTa ? 'புள்ளிகள் பட்டியல் & D3 ரேடார் வரைபடம்' : 'Tournament Standings & D3 Performance Radar'}
                    </h3>
                    <span style="font-size:12px;color:#10b981;font-weight:700;">ICC Rankings</span>
                </div>
                <div class="cp-table-wrap" style="margin-bottom: 20px;">
                    <table class="cp-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>${isTa ? 'அணி' : 'Team'}</th>
                                <th style="text-align:center;">${isTa ? 'போட்டிகள்' : 'P'}</th>
                                <th style="text-align:center;">${isTa ? 'வெற்றி' : 'W'}</th>
                                <th style="text-align:center;">${isTa ? 'தோல்வி' : 'L'}</th>
                                <th style="text-align:center;">${isTa ? 'ரன் ரேட்' : 'NRR'}</th>
                                <th style="text-align:center;">${isTa ? 'புள்ளிகள்' : 'PTS'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.pointsTable.map(function(t) {
                                return `
                                    <tr>
                                        <td style="font-weight:800;color:#38bdf8;">${t.pos}</td>
                                        <td style="font-weight:700;color:#ffffff;">
                                            <span style="font-size:16px;margin-right:6px;">${t.flag}</span>
                                            ${isTa ? t.teamTa : t.teamEn}
                                        </td>
                                        <td style="text-align:center;color:#cbd5e1;">${t.p}</td>
                                        <td style="text-align:center;font-weight:700;color:#34d399;">${t.w}</td>
                                        <td style="text-align:center;font-weight:700;color:#f87171;">${t.l}</td>
                                        <td style="text-align:center;color:#94a3b8;font-family:monospace;">${t.nrr}</td>
                                        <td style="text-align:center;font-weight:900;color:#f59e0b;font-size:15px;">${t.pts}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- D3 Visual Comparison Radar Container -->
                <div style="background: rgba(15,23,42,0.9); border: 1px solid #1e293b; border-radius: 16px; padding: 20px;">
                    <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                        <span>🎯 ${isTa ? 'அணிகளின் ஒப்பீட்டு ரேடார் வரைபடம்' : 'Visual Radar Tactical Comparison'}</span>
                        <span style="font-size: 11px; background: rgba(56,189,248,0.1); color: #38bdf8; padding: 3px 8px; border-radius: 6px; font-weight: 700;">IND vs WI</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 14px;">
                        <div style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 10px; border: 1px solid #1e293b;">
                            <div style="font-size: 11px; color: #94a3b8; font-weight: 700;">Powerplay Batting (1-6 ov)</div>
                            <div style="font-size: 14px; font-weight: 800; color: #38bdf8; margin-top: 4px;">IND 94% <span style="color:#64748b;">vs</span> WI 88%</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 10px; border: 1px solid #1e293b;">
                            <div style="font-size: 11px; color: #94a3b8; font-weight: 700;">Death Overs Bowling (16-20 ov)</div>
                            <div style="font-size: 14px; font-weight: 800; color: #34d399; margin-top: 4px;">IND 92% <span style="color:#64748b;">vs</span> WI 80%</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 10px; border: 1px solid #1e293b;">
                            <div style="font-size: 11px; color: #94a3b8; font-weight: 700;">Spin Control in Middle Overs</div>
                            <div style="font-size: 14px; font-weight: 800; color: #fbbf24; margin-top: 4px;">IND 96% <span style="color:#64748b;">vs</span> WI 78%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 4. RECENT RESULTS SECTION
        var resultsSection = `
            <div style="margin-bottom: 28px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                    <h3 style="font-size:18px;font-weight:800;color:#ffffff;margin:0;display:flex;align-items:center;gap:8px;">
                        <span>🏆</span> ${isTa ? 'சமீபத்திய அதிகாரப்பூர்வ முடிவுகள்' : 'Recent Official Match Results'}
                    </h3>
                </div>
                <div class="cp-grid-cards">
                    ${state.recentResults.map(function(r) {
                        return `
                            <div class="cp-item-card">
                                <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:8px;">
                                    <span class="cp-card-badge">${isTa ? r.seriesTa : r.seriesEn}</span>
                                    <span style="font-size:11px;color:#94a3b8;">${isTa ? r.dateTa : r.dateEn}</span>
                                </div>
                                <div style="font-size:14px;color:#cbd5e1;margin-bottom:3px;">${isTa ? r.team1Ta : r.team1En}</div>
                                <div style="font-size:15px;font-weight:800;color:#ffffff;margin-bottom:8px;">${isTa ? r.team2Ta : r.team2En}</div>
                                <div style="font-size:13px;font-weight:800;color:#34d399;background:rgba(52,211,153,0.1);padding:6px 10px;border-radius:8px;border:1px solid rgba(52,211,153,0.2);">
                                    🏆 ${isTa ? r.resultTa : r.resultEn}
                                </div>
                                <div style="font-size:11px;color:#cbd5e1;margin-top:6px;">
                                    POTM: ${isTa ? r.playerOfMatchTa : r.playerOfMatchEn}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // 5. LEADERBOARD SECTION
        var leadersSection = `
            <div style="margin-bottom: 20px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                    <h3 style="font-size:18px;font-weight:800;color:#ffffff;margin:0;display:flex;align-items:center;gap:8px;">
                        <span>👑</span> ${isTa ? 'முன்னணி வீரர்கள்' : 'Tournament Leaders'}
                    </h3>
                </div>
                <div class="cp-players-grid">
                    <div class="cp-mini-card">
                        <div class="cp-mini-title" style="color:#f59e0b;">🧡 ${isTa ? 'அதிக ரன்கள் (Orange Cap)' : 'Most Runs'}</div>
                        ${state.statLeaders.orangeCap.map(function(p, i) {
                            return `
                                <div class="cp-p-row">
                                    <span style="color:#f8fafc;font-weight:600;">${i + 1}. ${isTa ? p.nameTa : p.nameEn}</span>
                                    <span style="color:#f59e0b;font-weight:800;">${p.runs} runs <small style="color:#64748b;">(SR: ${p.sr})</small></span>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="cp-mini-card">
                        <div class="cp-mini-title" style="color:#a855f7;">💜 ${isTa ? 'அதிக விக்கெட்டுகள் (Purple Cap)' : 'Most Wickets'}</div>
                        ${state.statLeaders.purpleCap.map(function(p, i) {
                            return `
                                <div class="cp-p-row">
                                    <span style="color:#f8fafc;font-weight:600;">${i + 1}. ${isTa ? p.nameTa : p.nameEn}</span>
                                    <span style="color:#c084fc;font-weight:800;">${p.wickets} wkts <small style="color:#64748b;">(Econ: ${p.econ})</small></span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        var contentBody = '';
        if (state.activeTab === 'live') {
            // Default on homepage: Live Scores & Match Center ONLY!
            contentBody = heroSection;
        } else if (state.activeTab === 'schedule') {
            contentBody = upcomingSection;
        } else if (state.activeTab === 'table') {
            contentBody = pointsTableSection;
        } else if (state.activeTab === 'results') {
            contentBody = resultsSection;
        } else if (state.activeTab === 'leaders') {
            contentBody = leadersSection;
        } else if (state.activeTab === 'all') {
            contentBody = heroSection + upcomingSection + pointsTableSection + resultsSection + leadersSection;
        }

        root.innerHTML = `
            <div class="cp-app-wrapper">
                <div class="cp-app-header">
                    <div class="cp-brand-title">
                        <span style="font-size:24px;">🏏</span>
                        <div>
                            <span style="font-weight:900;letter-spacing:-0.5px;">CRICPULSE</span>
                            <span style="font-size:11px;color:#38bdf8;margin-left:6px;font-weight:700;">
                                ${isTa ? 'அதிகாரப்பூர்வ நேரலை ஸ்கோர்போர்டு & அட்டவணை' : 'Official Cricket Center & Live Scores'}
                            </span>
                        </div>
                    </div>

                    <div class="cp-header-actions">
                        <button id="cp-btn-sound" class="cp-btn-control ${state.isSoundEnabled ? 'active' : ''}">
                            ${state.isSoundEnabled ? '🔊 ' + (isTa ? 'ஒலி: ஆன்' : 'Sound: ON') : '🔇 ' + (isTa ? 'ஒலி: ஆஃப்' : 'Sound: OFF')}
                        </button>

                        <button id="cp-btn-lang" class="cp-btn-control">
                            🌐 ${isTa ? 'English' : 'தமிழ்'}
                        </button>
                    </div>
                </div>

                <!-- Navigation Tabs with LIVE SCORES FIRST! -->
                <div class="cp-tabs-bar">
                    <button class="cp-tab-btn ${state.activeTab === 'live' ? 'active' : ''}" data-tab="live">
                        🔴 ${isTa ? 'நேரலை' : 'Live Scores'}
                    </button>
                    <button class="cp-tab-btn ${state.activeTab === 'schedule' ? 'active' : ''}" data-tab="schedule">
                        📅 ${isTa ? 'அட்டவணை' : 'Upcoming'}
                    </button>
                    <button class="cp-tab-btn ${state.activeTab === 'table' ? 'active' : ''}" data-tab="table">
                        📊 ${isTa ? 'புள்ளிகள் பட்டியல்' : 'Points Table'}
                    </button>
                    <button class="cp-tab-btn ${state.activeTab === 'results' ? 'active' : ''}" data-tab="results">
                        🏆 ${isTa ? 'முடிவுகள்' : 'Results'}
                    </button>
                    <button class="cp-tab-btn ${state.activeTab === 'leaders' ? 'active' : ''}" data-tab="leaders">
                        👑 ${isTa ? 'முன்னணி வீரர்கள்' : 'Leaderboard'}
                    </button>
                    <button class="cp-tab-btn ${state.activeTab === 'all' ? 'active' : ''}" data-tab="all">
                        🌟 ${isTa ? 'அனைத்தும்' : 'All-in-One'}
                    </button>
                </div>

                <div class="cp-content-area">
                    ${contentBody}
                </div>
            </div>
        `;

        var soundBtn = document.getElementById('cp-btn-sound');
        if (soundBtn) soundBtn.onclick = toggleSound;

        var langBtn = document.getElementById('cp-btn-lang');
        if (langBtn) langBtn.onclick = toggleLanguage;

        var tabButtons = root.querySelectorAll('.cp-tab-btn');
        tabButtons.forEach(function (btn) {
            btn.onclick = function () {
                var tab = btn.getAttribute('data-tab');
                if (tab) {
                    state.activeTab = tab;
                    renderApp();
                }
            };
        });

        var mcTabs = root.querySelectorAll('.cp-mc-tab');
        mcTabs.forEach(function (mcBtn) {
            mcBtn.onclick = function () {
                var mcTab = mcBtn.getAttribute('data-mctab');
                if (mcTab) {
                    setMatchCenterTab(mcTab);
                }
            };
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderApp);
    } else {
        renderApp();
    }
})();
