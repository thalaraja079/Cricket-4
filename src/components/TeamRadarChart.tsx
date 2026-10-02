import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Shield, Sparkles, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { Language } from '../types/cricket';

interface TeamStats {
  id: string;
  name: string;
  nameTa: string;
  shortName: string;
  logo: string;
  color: string;
  tournament: 'asiangames' | 'icc';
  stats: {
    powerplay: number;      // 0 - 100
    deathBowling: number;   // 0 - 100
    spinControl: number;    // 0 - 100
    boundaryRate: number;   // 0 - 100
    fielding: number;       // 0 - 100
    winMomentum: number;    // 0 - 100
  };
}

const TEAMS_PERFORMANCE: TeamStats[] = [
  // Asian Games Teams
  {
    id: 'ind',
    name: 'India',
    nameTa: 'இந்தியா',
    shortName: 'IND',
    logo: '🇮🇳',
    color: '#38bdf8', // Sky Blue
    tournament: 'asiangames',
    stats: {
      powerplay: 93,
      deathBowling: 89,
      spinControl: 96,
      boundaryRate: 91,
      fielding: 88,
      winMomentum: 98,
    },
  },
  {
    id: 'pak',
    name: 'Pakistan',
    nameTa: 'பாகிஸ்தான்',
    shortName: 'PAK',
    logo: '🇵🇰',
    color: '#34d399', // Emerald
    tournament: 'asiangames',
    stats: {
      powerplay: 84,
      deathBowling: 94,
      spinControl: 85,
      boundaryRate: 83,
      fielding: 77,
      winMomentum: 86,
    },
  },
  {
    id: 'sl',
    name: 'Sri Lanka',
    nameTa: 'இலங்கை',
    shortName: 'SL',
    logo: '🇱🇰',
    color: '#fbbf24', // Amber
    tournament: 'asiangames',
    stats: {
      powerplay: 75,
      deathBowling: 79,
      spinControl: 87,
      boundaryRate: 74,
      fielding: 81,
      winMomentum: 72,
    },
  },
  {
    id: 'ban',
    name: 'Bangladesh',
    nameTa: 'வங்கதேசம்',
    shortName: 'BAN',
    logo: '🇧🇩',
    color: '#f87171', // Rose
    tournament: 'asiangames',
    stats: {
      powerplay: 71,
      deathBowling: 76,
      spinControl: 82,
      boundaryRate: 70,
      fielding: 75,
      winMomentum: 69,
    },
  },
  {
    id: 'afg',
    name: 'Afghanistan',
    nameTa: 'ஆப்கானிஸ்தான்',
    shortName: 'AFG',
    logo: '🇦🇫',
    color: '#c084fc', // Purple
    tournament: 'asiangames',
    stats: {
      powerplay: 77,
      deathBowling: 81,
      spinControl: 95,
      boundaryRate: 76,
      fielding: 78,
      winMomentum: 75,
    },
  },
  // ICC International Teams (100% International, NO IPL)
  {
    id: 'aus',
    name: 'Australia',
    nameTa: 'ஆஸ்திரேலியா',
    shortName: 'AUS',
    logo: '🇦🇺',
    color: '#f59e0b', // Gold Amber
    tournament: 'icc',
    stats: {
      powerplay: 92,
      deathBowling: 91,
      spinControl: 84,
      boundaryRate: 90,
      fielding: 92,
      winMomentum: 90,
    },
  },
  {
    id: 'wi',
    name: 'West Indies',
    nameTa: 'மேற்கிந்திய தீவுகள்',
    shortName: 'WI',
    logo: '🌴',
    color: '#ec4899', // Pink / Maroon
    tournament: 'icc',
    stats: {
      powerplay: 90,
      deathBowling: 82,
      spinControl: 78,
      boundaryRate: 94,
      fielding: 83,
      winMomentum: 82,
    },
  },
  {
    id: 'sa',
    name: 'South Africa',
    nameTa: 'தென்னாப்பிரிக்கா',
    shortName: 'SA',
    logo: '🇿🇦',
    color: '#10b981', // Green
    tournament: 'icc',
    stats: {
      powerplay: 89,
      deathBowling: 90,
      spinControl: 86,
      boundaryRate: 88,
      fielding: 93,
      winMomentum: 85,
    },
  },
  {
    id: 'eng',
    name: 'England',
    nameTa: 'இங்கிலாந்து',
    shortName: 'ENG',
    logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    color: '#0ea5e9', // Blue
    tournament: 'icc',
    stats: {
      powerplay: 93,
      deathBowling: 84,
      spinControl: 82,
      boundaryRate: 91,
      fielding: 86,
      winMomentum: 84,
    },
  },
];

interface RadarAxis {
  key: keyof TeamStats['stats'];
  labelEn: string;
  labelTa: string;
}

const RADAR_AXES: RadarAxis[] = [
  { key: 'powerplay', labelEn: 'Powerplay Batting', labelTa: 'பவர்பிளே பேட்டிங்' },
  { key: 'deathBowling', labelEn: 'Death Overs', labelTa: 'டெத் ஓவர் பந்துவீச்சு' },
  { key: 'spinControl', labelEn: 'Spin Control', labelTa: 'சுழற்பந்து கட்டுப்பாடு' },
  { key: 'boundaryRate', labelEn: 'Boundary %', labelTa: 'பவுண்டரி ஆதிக்கம்' },
  { key: 'fielding', labelEn: 'Fielding / Catches', labelTa: 'ஃபீல்டிங் திறன்' },
  { key: 'winMomentum', labelEn: 'Win Momentum', labelTa: 'வெற்றி வேகம்' },
];

interface TeamRadarChartProps {
  lang: Language;
  tournamentFilter: 'asiangames' | 'icc';
}

export const TeamRadarChart: React.FC<TeamRadarChartProps> = ({ lang, tournamentFilter }) => {
  const isTa = lang === 'ta';

  // Available teams for selected tournament
  const tournamentTeams = useMemo(() => {
    return TEAMS_PERFORMANCE.filter((t) => t.tournament === tournamentFilter);
  }, [tournamentFilter]);

  const [team1Id, setTeam1Id] = useState<string>(
    tournamentFilter === 'asiangames' ? 'ind' : 'aus'
  );
  const [team2Id, setTeam2Id] = useState<string>(
    tournamentFilter === 'asiangames' ? 'pak' : 'wi'
  );

  // Keep selected teams valid on tournament switch
  React.useEffect(() => {
    if (tournamentFilter === 'asiangames') {
      setTeam1Id('ind');
      setTeam2Id('pak');
    } else {
      setTeam1Id('aus');
      setTeam2Id('wi');
    }
  }, [tournamentFilter]);

  const team1 = tournamentTeams.find((t) => t.id === team1Id) || tournamentTeams[0];
  const team2 = tournamentTeams.find((t) => t.id === team2Id) || tournamentTeams[1] || tournamentTeams[0];

  const [hoveredAxis, setHoveredAxis] = useState<RadarAxis | null>(null);

  // SVG Geometry Constants
  const size = 340;
  const center = size / 2;
  const radius = size * 0.38;
  const numAxes = RADAR_AXES.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // D3 Scale: Linear 0 to 100 -> 0 to radius
  const rScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([0, radius]);
  }, [radius]);

  // Radial grid levels: 20%, 40%, 60%, 80%, 100%
  const gridLevels = [20, 40, 60, 80, 100];

  // Helper to get (x, y) for an axis and stat value
  const getCoordinates = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = rScale(value);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate SVG polygon points string using D3
  const getPolygonPoints = (stats: TeamStats['stats']) => {
    return RADAR_AXES.map((axis, i) => {
      const { x, y } = getCoordinates(i, stats[axis.key]);
      return `${x},${y}`;
    }).join(' ');
  };

  // Grid ring path generator
  const getGridRingPoints = (level: number) => {
    return RADAR_AXES.map((_, i) => {
      const { x, y } = getCoordinates(i, level);
      return `${x},${y}`;
    }).join(' ');
  };

  const points1 = useMemo(() => getPolygonPoints(team1.stats), [team1, rScale]);
  const points2 = useMemo(() => getPolygonPoints(team2.stats), [team2, rScale]);

  // Overall index calculation
  const avgStat1 = Math.round(
    Object.values(team1.stats).reduce((a, b) => a + b, 0) / RADAR_AXES.length
  );
  const avgStat2 = Math.round(
    Object.values(team2.stats).reduce((a, b) => a + b, 0) / RADAR_AXES.length
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="text-base sm:text-lg font-black text-white">
              {isTa ? 'அணிகளின் செயல்திறன் ரேடார் வரைபடம் (D3 Team Radar)' : 'D3 Team Performance Radar'}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
              D3.js
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isTa
              ? 'பவர்பிளே, டெத் ஓவர்கள், சுழற்பந்து மற்றும் வெற்றி வேகம் ஒப்பீடு'
              : 'Interactive 6-metric tactical radar comparison'}
          </p>
        </div>

        {/* Team Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Team 1 Select */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-base">{team1.logo}</span>
            <select
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {tournamentTeams.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {isTa ? t.nameTa : t.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-black text-slate-500">VS</span>

          {/* Team 2 Select */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-base">{team2.logo}</span>
            <select
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {tournamentTeams.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {isTa ? t.nameTa : t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Radar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Radar Chart (Center) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full max-w-[340px] h-auto drop-shadow-2xl overflow-visible select-none"
          >
            <defs>
              {/* Team 1 Radial Gradient */}
              <radialGradient id={`rad-${team1.id}`} cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor={team1.color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={team1.color} stopOpacity="0.15" />
              </radialGradient>
              {/* Team 2 Radial Gradient */}
              <radialGradient id={`rad-${team2.id}`} cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor={team2.color} stopOpacity="0.45" />
                <stop offset="100%" stopColor={team2.color} stopOpacity="0.12" />
              </radialGradient>
            </defs>

            {/* Concentric Grid Rings */}
            {gridLevels.map((lvl) => (
              <polygon
                key={`grid-${lvl}`}
                points={getGridRingPoints(lvl)}
                fill="none"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray={lvl === 100 ? 'none' : '3 3'}
                opacity={lvl === 100 ? 0.7 : 0.4}
              />
            ))}

            {/* Spokes (Radial Axis Lines) */}
            {RADAR_AXES.map((_, i) => {
              const { x, y } = getCoordinates(i, 100);
              return (
                <line
                  key={`spoke-${i}`}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1.2"
                  opacity="0.6"
                />
              );
            })}

            {/* Percentage Marks along top vertical spoke */}
            {gridLevels.map((lvl) => {
              const { y } = getCoordinates(0, lvl);
              return (
                <text
                  key={`lvl-${lvl}`}
                  x={center + 6}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  {lvl}%
                </text>
              );
            })}

            {/* Team 2 Polygon (Rendered First for clean layering) */}
            <polygon
              points={points2}
              fill={`url(#rad-${team2.id})`}
              stroke={team2.color}
              strokeWidth="2.2"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />

            {/* Team 1 Polygon */}
            <polygon
              points={points1}
              fill={`url(#rad-${team1.id})`}
              stroke={team1.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />

            {/* Data Point Circles for Team 2 */}
            {RADAR_AXES.map((axis, i) => {
              const { x, y } = getCoordinates(i, team2.stats[axis.key]);
              return (
                <circle
                  key={`pt2-${i}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#090d16"
                  stroke={team2.color}
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Data Point Circles for Team 1 */}
            {RADAR_AXES.map((axis, i) => {
              const { x, y } = getCoordinates(i, team1.stats[axis.key]);
              return (
                <circle
                  key={`pt1-${i}`}
                  cx={x}
                  cy={y}
                  r="4.5"
                  fill="#090d16"
                  stroke={team1.color}
                  strokeWidth="2.2"
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Axis Labels Around Radar Periphery */}
            {RADAR_AXES.map((axis, i) => {
              const angle = angleStep * i - Math.PI / 2;
              const labelRadius = radius + 22;
              const lx = center + labelRadius * Math.cos(angle);
              const ly = center + labelRadius * Math.sin(angle);

              // Text anchor calculation based on angle
              let textAnchor: 'middle' | 'start' | 'end' = 'middle';
              if (Math.cos(angle) > 0.3) textAnchor = 'start';
              if (Math.cos(angle) < -0.3) textAnchor = 'end';

              const isHovered = hoveredAxis?.key === axis.key;

              return (
                <g
                  key={`label-${i}`}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredAxis(axis)}
                  onMouseLeave={() => setHoveredAxis(null)}
                >
                  <text
                    x={lx}
                    y={ly + (Math.sin(angle) > 0.4 ? 4 : -2)}
                    textAnchor={textAnchor}
                    fontSize={isHovered ? '11' : '10'}
                    fontWeight={isHovered ? '800' : '600'}
                    fill={isHovered ? '#38bdf8' : '#cbd5e1'}
                    className="transition-colors duration-200"
                  >
                    {isTa ? axis.labelTa : axis.labelEn}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full border-2"
                style={{ backgroundColor: `${team1.color}33`, borderColor: team1.color }}
              />
              <span className="font-bold text-white flex items-center gap-1">
                <span>{team1.logo}</span>
                <span>{isTa ? team1.nameTa : team1.name}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full border-2"
                style={{ backgroundColor: `${team2.color}33`, borderColor: team2.color }}
              />
              <span className="font-bold text-white flex items-center gap-1">
                <span>{team2.logo}</span>
                <span>{isTa ? team2.nameTa : team2.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Metric Comparison Side Panel (Right) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Header Score Cards */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div
              className="p-3 rounded-xl border bg-slate-950/60"
              style={{ borderColor: `${team1.color}40` }}
            >
              <div className="text-xs text-slate-400 font-semibold">{isTa ? team1.shortName : team1.shortName} Overall Index</div>
              <div className="text-2xl font-black mt-1 font-mono" style={{ color: team1.color }}>
                {avgStat1}/100
              </div>
            </div>

            <div
              className="p-3 rounded-xl border bg-slate-950/60"
              style={{ borderColor: `${team2.color}40` }}
            >
              <div className="text-xs text-slate-400 font-semibold">{isTa ? team2.shortName : team2.shortName} Overall Index</div>
              <div className="text-2xl font-black mt-1 font-mono" style={{ color: team2.color }}>
                {avgStat2}/100
              </div>
            </div>
          </div>

          {/* Metrics List Comparison */}
          <div className="space-y-2 pt-1">
            {RADAR_AXES.map((axis) => {
              const val1 = team1.stats[axis.key];
              const val2 = team2.stats[axis.key];
              const diff = val1 - val2;
              const isHovered = hoveredAxis?.key === axis.key;

              return (
                <div
                  key={axis.key}
                  onMouseEnter={() => setHoveredAxis(axis)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  className={`p-2.5 rounded-xl border transition-all duration-200 ${
                    isHovered
                      ? 'bg-slate-800/80 border-sky-500/50 shadow-md'
                      : 'bg-slate-950/40 border-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{isTa ? axis.labelTa : axis.labelEn}</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold">
                      <span style={{ color: team1.color }}>{val1}%</span>
                      <span className="text-slate-500 mx-1.5">vs</span>
                      <span style={{ color: team2.color }}>{val2}%</span>
                    </span>
                  </div>

                  {/* Dual comparison bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${(val1 / (val1 + val2)) * 100}%`,
                        backgroundColor: team1.color,
                      }}
                    />
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${(val2 / (val1 + val2)) * 100}%`,
                        backgroundColor: team2.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tactical Edge Summary */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              {avgStat1 > avgStat2
                ? (isTa
                    ? `${team1.nameTa} அணி ${avgStat1 - avgStat2}% அதிக உத்திகளுடன் முன்னிலையில் உள்ளது.`
                    : `${team1.name} holds a +${avgStat1 - avgStat2}% overall tactical edge in tournament execution.`)
                : (isTa
                    ? `${team2.nameTa} அணி ${avgStat2 - avgStat1}% அதிக உத்திகளுடன் முன்னிலையில் உள்ளது.`
                    : `${team2.name} holds a +${avgStat2 - avgStat1}% overall tactical edge in tournament execution.`)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
