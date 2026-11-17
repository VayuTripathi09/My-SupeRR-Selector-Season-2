import React, { useState, useMemo } from 'react';
import { UniversalPlayer, OverviewMetrics } from '../types';
import {
  Search,
  Filter,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Target,
  Swords,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Activity,
  Award,
  Zap,
  Info,
  X,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface PlayerExplorerPageProps {
  players: UniversalPlayer[];
  overview: OverviewMetrics;
  onOpenCompare?: (player: UniversalPlayer) => void;
}

export const PlayerExplorerPage: React.FC<PlayerExplorerPageProps> = ({
  players,
  overview,
  onOpenCompare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'bat_eligible' | 'bowl_eligible' | 'ineligible'>('all');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(
    players.find((p) => p.player_name.includes('Tilak Varma'))?.player_id || players[0]?.player_id
  );

  const uniqueTeams = useMemo(() => {
    const teams = new Set(players.map((p) => p.team).filter(Boolean));
    return ['All', ...Array.from(teams)];
  }, [players]);

  const filteredList = useMemo(() => {
    let list = [...players];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.player_name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q)
      );
    }

    if (filterMode === 'bat_eligible') {
      list = list.filter((p) => p.is_bat_eligible);
    } else if (filterMode === 'bowl_eligible') {
      list = list.filter((p) => p.is_bowl_eligible);
    } else if (filterMode === 'ineligible') {
      list = list.filter((p) => !p.is_bat_eligible && !p.is_bowl_eligible);
    }

    if (selectedTeam !== 'All') {
      list = list.filter((p) => p.team === selectedTeam);
    }

    return list;
  }, [players, searchQuery, filterMode, selectedTeam]);

  const selectedPlayer = useMemo(() => {
    return players.find((p) => p.player_id === selectedPlayerId) || filteredList[0] || players[0];
  }, [players, selectedPlayerId, filteredList]);

  // Comparison chart data (Player High vs Normal vs Cohort Benchmark)
  const comparisonData = useMemo(() => {
    if (!selectedPlayer) return [];
    const batHighSR = selectedPlayer.batting_stats.High?.strike_rate ?? 0;
    const batNormSR = selectedPlayer.batting_stats.Normal?.strike_rate ?? 0;
    const bowlHighEcon = selectedPlayer.bowling_stats.High?.economy ?? 0;
    const bowlNormEcon = selectedPlayer.bowling_stats.Normal?.economy ?? 0;

    return [
      {
        metric: 'Batting SR',
        'Player High Pressure': batHighSR,
        'Player Normal Pressure': batNormSR,
        'Cohort High Benchmark': overview.cohort_benchmarks.batter_high_avg_sr,
        'Cohort Normal Benchmark': overview.cohort_benchmarks.batter_normal_avg_sr,
      },
      {
        metric: 'Bowling Economy',
        'Player High Pressure': bowlHighEcon,
        'Player Normal Pressure': bowlNormEcon,
        'Cohort High Benchmark': overview.cohort_benchmarks.bowler_high_avg_econ,
        'Cohort Normal Benchmark': 8.5,
      },
    ];
  }, [selectedPlayer, overview]);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-display font-extrabold text-deep-navy">
          Universal Player Intelligence Explorer
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Complete indexed database of {players.length} match-active players across 837 second-innings chases
        </p>
      </div>

      {/* Explorer Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Directory & Search (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by player name or franchise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-royal-pink focus:outline-none focus:ring-1 focus:ring-royal-pink shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 rounded p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterMode('all')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-deep-navy text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All ({players.length})
            </button>
            <button
              onClick={() => setFilterMode('bat_eligible')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                filterMode === 'bat_eligible'
                  ? 'bg-royal-pink text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Eligible Batters (45)
            </button>
            <button
              onClick={() => setFilterMode('bowl_eligible')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                filterMode === 'bowl_eligible'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Eligible Bowlers (56)
            </button>
            <button
              onClick={() => setFilterMode('ineligible')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                filterMode === 'ineligible'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Ineligible
            </button>
          </div>

          {/* Team Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-royal-pink focus:outline-none focus:ring-1 focus:ring-royal-pink shadow-sm"
            >
              <option value="All">All Franchises / National Squads</option>
              {uniqueTeams.filter((t) => t !== 'All').map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Scrollable Player Directory List */}
          <div className="rounded-2xl bg-white border border-slate-200/80 shadow-card overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex justify-between items-center text-[11px] text-slate-500 font-semibold">
              <span>Showing {filteredList.length} Players</span>
              <span>Click to view dossier</span>
            </div>

            <div className="max-h-[580px] overflow-y-auto divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No players found matching your search.
                </div>
              ) : (
                filteredList.map((p) => {
                  const isSelected = p.player_id === selectedPlayer.player_id;
                  return (
                    <div
                      key={p.player_id}
                      onClick={() => setSelectedPlayerId(p.player_id)}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-pink-50/70 border-l-4 border-royal-pink'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-royal-pink text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {p.player_name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-royal-pink' : 'text-slate-800'}`}>
                            {p.player_name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.team} • {p.role}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center space-x-1.5">
                        {p.batter_ranking && (
                          <span className="rounded bg-royal-pink/10 text-royal-pink text-[9px] font-black px-1.5 py-0.5">
                            #{p.batter_ranking.rank} Bat
                          </span>
                        )}
                        {p.bowler_ranking && (
                          <span className="rounded bg-indigo-50 text-indigo-700 text-[9px] font-black px-1.5 py-0.5 border border-indigo-200">
                            #{p.bowler_ranking.rank} Bowl
                          </span>
                        )}
                        <ChevronRight className={`h-3.5 w-3.5 ${isSelected ? 'text-royal-pink' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Player Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Player Hero Card */}
          <div className="rounded-2xl bg-gradient-card-dark p-6 text-white shadow-xl border border-navy-border relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 h-36 w-36 rounded-full bg-royal-pink/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-gradient-to-tr from-royal-pink to-pink-500 text-white font-extrabold text-2xl shadow-royal shrink-0">
                  {selectedPlayer.player_name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-display font-extrabold tracking-tight text-white">
                      {selectedPlayer.player_name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                    <span className="font-bold text-pink-300">{selectedPlayer.team}</span>
                    <span className="text-slate-500">•</span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-slate-200">{selectedPlayer.role}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-mono text-[11px]">ID: {selectedPlayer.player_id}</span>
                  </div>
                </div>
              </div>

              {onOpenCompare && (
                <button
                  onClick={() => onOpenCompare(selectedPlayer)}
                  className="rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 shadow-sm"
                >
                  <Scale className="h-3.5 w-3.5 text-royal-pink" />
                  <span>Compare Candidate</span>
                </button>
              )}
            </div>

            {/* Quick Rank & Score Badges */}
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10">
              <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Batting Pressure Score</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-mono font-black text-royal-pink tabular-nums">
                    {selectedPlayer.batter_ranking ? selectedPlayer.batter_ranking.adjusted_gap_score.toFixed(1) : '—'}
                  </span>
                  {selectedPlayer.batter_ranking ? (
                    <span className="text-xs font-bold text-white bg-royal-pink/40 px-2 py-0.5 rounded">
                      Rank #{selectedPlayer.batter_ranking.rank}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Ineligible</span>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Bowling Pressure Score</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-mono font-black text-indigo-400 tabular-nums">
                    {selectedPlayer.bowler_ranking ? selectedPlayer.bowler_ranking.gap_score.toFixed(1) : '—'}
                  </span>
                  {selectedPlayer.bowler_ranking ? (
                    <span className="text-xs font-bold text-white bg-indigo-600/40 px-2 py-0.5 rounded">
                      Rank #{selectedPlayer.bowler_ranking.rank}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Ineligible</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ineligibility Explanations if Applicable */}
          {(!selectedPlayer.is_bat_eligible || !selectedPlayer.is_bowl_eligible) && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                <span>Eligibility Audit Findings</span>
              </div>
              {!selectedPlayer.is_bat_eligible && (
                <div className="text-xs text-amber-800 leading-relaxed">
                  <strong>Batting Ineligibility:</strong> {selectedPlayer.bat_ineligibility_reason} (Threshold: ≥ 60 balls faced & ≥ 8 matches in IPL second-innings chases).
                </div>
              )}
              {!selectedPlayer.is_bowl_eligible && selectedPlayer.total_bowling.legal_balls > 0 && (
                <div className="text-xs text-amber-800 leading-relaxed">
                  <strong>Bowling Ineligibility:</strong> {selectedPlayer.bowl_ineligibility_reason} (Threshold: ≥ 60 legal balls & ≥ 8 matches in IPL second-innings chases).
                </div>
              )}
            </div>
          )}

          {/* Batting Pressure Table */}
          {selectedPlayer.total_batting.balls > 0 && (
            <div className="rounded-2xl bg-white p-5 shadow-card border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Swords className="h-4 w-4 text-royal-pink" />
                  <h4 className="text-xs font-bold text-deep-navy uppercase tracking-wider">
                    Batting Splits by Pressure Tier
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono font-medium">
                  Career Chase: {selectedPlayer.total_batting.runs} runs ({selectedPlayer.total_batting.balls}b faced)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Tier</th>
                      <th className="px-3 py-2 text-right">Runs</th>
                      <th className="px-3 py-2 text-right">Balls</th>
                      <th className="px-3 py-2 text-right">Strike Rate</th>
                      <th className="px-3 py-2 text-right">4s / 6s</th>
                      <th className="px-3 py-2 text-right">Dismissals</th>
                      <th className="px-3 py-2 text-right">Matches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-mono text-[11px]">
                    {['High', 'Medium', 'Normal'].map((tier) => {
                      const stats = selectedPlayer.batting_stats[tier as keyof typeof selectedPlayer.batting_stats];
                      return (
                        <tr key={tier} className={tier === 'High' ? 'bg-pink-50/30 font-bold' : ''}>
                          <td className="px-3 py-2.5 flex items-center space-x-1.5 font-sans font-semibold">
                            <span className={`w-2 h-2 rounded-full ${
                              tier === 'High' ? 'bg-royal-pink' : tier === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <span className={tier === 'High' ? 'text-royal-pink' : 'text-slate-700'}>{tier}</span>
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{stats ? stats.runs : '—'}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{stats ? stats.balls : '—'}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums font-black text-slate-900">
                            {stats ? stats.strike_rate.toFixed(1) : '—'}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                            {stats ? `${stats.fours} / ${stats.sixes}` : '—'}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{stats ? stats.dismissals : '—'}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{stats ? stats.matches : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bowling Pressure Table */}
          {selectedPlayer.total_bowling.legal_balls > 0 && (
            <div className="rounded-2xl bg-white p-5 shadow-card border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-deep-navy uppercase tracking-wider">
                    Bowling Splits by Pressure Tier
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-mono font-medium">
                  Career Chase: {selectedPlayer.total_bowling.wickets} wkts ({selectedPlayer.total_bowling.economy} Econ)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Tier</th>
                      <th className="px-3 py-2 text-right">Legal Balls</th>
                      <th className="px-3 py-2 text-right">Runs</th>
                      <th className="px-3 py-2 text-right">Wickets</th>
                      <th className="px-3 py-2 text-right">Economy</th>
                      <th className="px-3 py-2 text-right">Dot %</th>
                      <th className="px-3 py-2 text-right">Boundary %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-mono text-[11px]">
                    {['High', 'Medium', 'Normal'].map((tier) => {
                      const stats = selectedPlayer.bowling_stats[tier as keyof typeof selectedPlayer.bowling_stats];
                      return (
                        <tr key={tier} className={tier === 'High' ? 'bg-indigo-50/30 font-bold' : ''}>
                          <td className="px-3 py-2.5 flex items-center space-x-1.5 font-sans font-semibold">
                            <span className={`w-2 h-2 rounded-full ${
                              tier === 'High' ? 'bg-indigo-600' : tier === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <span className={tier === 'High' ? 'text-indigo-700' : 'text-slate-700'}>{tier}</span>
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{stats ? stats.legal_balls : '—'}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{stats ? stats.runs_conceded : '—'}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums font-black text-emerald-600">{stats ? stats.wickets : '—'}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums font-black text-slate-900">
                            {stats ? stats.economy.toFixed(2) : '—'}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-emerald-700 font-semibold">
                            {stats ? `${stats.dot_pct.toFixed(1)}%` : '—'}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{stats ? `${stats.boundary_pct.toFixed(1)}%` : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Benchmark Comparison Chart */}
          <div className="rounded-2xl bg-white p-5 shadow-card border border-slate-200/80">
            <h4 className="text-xs font-bold text-deep-navy uppercase tracking-wider mb-3">
              Performance vs Tournament Cohort Benchmark
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#14213D', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Player High Pressure" fill="#EA1B85" name="Player High" />
                  <Bar dataKey="Cohort High Benchmark" fill="#F472B6" name="Tournament High Avg" />
                  <Bar dataKey="Player Normal Pressure" fill="#64748B" name="Player Normal" />
                  <Bar dataKey="Cohort Normal Benchmark" fill="#94A3B8" name="Tournament Normal Avg" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
