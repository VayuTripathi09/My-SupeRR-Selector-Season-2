import React, { useState, useMemo } from 'react';
import { BatterRanking, UniversalPlayer } from '../types';
import {
  Swords,
  Search,
  Filter,
  ArrowUpDown,
  Trophy,
  Award,
  ChevronDown,
  TrendingUp,
  Flame,
  Sparkles,
  Download,
  X,
  CheckCircle2,
  Medal
} from 'lucide-react';

interface BatterRankingsPageProps {
  batters: BatterRanking[];
  allPlayers: UniversalPlayer[];
  onSelectPlayer: (player: UniversalPlayer) => void;
}

export const BatterRankingsPage: React.FC<BatterRankingsPageProps> = ({
  batters,
  allPlayers,
  onSelectPlayer,
}) => {
  const [viewMode, setViewMode] = useState<'top10' | 'all'>('top10');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [sortBy, setSortBy] = useState<keyof BatterRanking>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const playerMap = useMemo(() => new Map(allPlayers.map((p) => [p.player_name, p])), [allPlayers]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(batters.map((b) => b.role).filter(Boolean));
    return ['All', ...Array.from(roles)];
  }, [batters]);

  const uniqueTeams = useMemo(() => {
    const teams = new Set(batters.map((b) => b.team).filter(Boolean));
    return ['All', ...Array.from(teams)];
  }, [batters]);

  const filteredBatters = useMemo(() => {
    let list = viewMode === 'top10' ? batters.filter((b) => b.rank <= 10) : [...batters];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.striker_name.toLowerCase().includes(q) ||
          b.team.toLowerCase().includes(q) ||
          b.role.toLowerCase().includes(q)
      );
    }

    if (selectedRole !== 'All') {
      list = list.filter((b) => b.role === selectedRole);
    }

    if (selectedTeam !== 'All') {
      list = list.filter((b) => b.team === selectedTeam);
    }

    list.sort((a, b) => {
      let valA = a[sortBy] ?? 0;
      let valB = b[sortBy] ?? 0;
      if (typeof valA === 'string') valA = (valA as string).toLowerCase();
      if (typeof valB === 'string') valB = (valB as string).toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [batters, viewMode, searchQuery, selectedRole, selectedTeam, sortBy, sortAsc]);

  const displayedBatters = useMemo(() => {
    if (viewMode === 'top10') return filteredBatters;
    if (rowsPerPage === -1) return filteredBatters;
    return filteredBatters.slice(0, rowsPerPage);
  }, [filteredBatters, viewMode, rowsPerPage]);

  const handleSort = (field: keyof BatterRanking) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(field === 'rank');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Rank',
      'Player Name',
      'Team',
      'Role',
      'Pressure Score',
      'High SR',
      'Normal SR',
      'Pressure Lift',
      'High Balls',
      'High Matches',
      'Normal Balls',
      'Baseline Reliability',
      'Baseline Quality',
    ];
    const rows = filteredBatters.map((b) => [
      b.rank,
      `"${b.striker_name}"`,
      `"${b.team}"`,
      `"${b.role}"`,
      b.adjusted_gap_score,
      b.high_sr,
      b.normal_sr ?? '',
      b.pressure_lift ?? '',
      b.high_balls,
      b.high_matches,
      b.normal_balls,
      b.baseline_reliability,
      b.baseline_quality,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RR_Batter_Rankings_${viewMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Title & View Toggle Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-display font-extrabold text-deep-navy">
              Reliability-Adjusted Batter Rankings
            </h2>
            <span className="rounded-full bg-pink-100 text-royal-pink px-2.5 py-0.5 text-xs font-bold border border-pink-200">
              {viewMode === 'top10' ? 'Official Top 10' : `All ${batters.length} Eligible`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical formula: 40% High SR Pct + 30% Volume Pct + 15% Reliable Lift Pct + 15% Total Matches Pct
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Top 10 vs All Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 shadow-sm">
            <button
              onClick={() => {
                setViewMode('top10');
                setRowsPerPage(10);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'top10'
                  ? 'bg-royal-pink text-white shadow-sm'
                  : 'text-slate-600 hover:text-deep-navy'
              }`}
            >
              Top 10 Final
            </button>
            <button
              onClick={() => {
                setViewMode('all');
                setRowsPerPage(25);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'all'
                  ? 'bg-royal-pink text-white shadow-sm'
                  : 'text-slate-600 hover:text-deep-navy'
              }`}
            >
              All Eligible ({batters.length})
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-royal-pink hover:text-royal-pink transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input (5 cols) */}
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search batter by name or franchise..."
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

        {/* Role Filter (3 cols) */}
        <div className="sm:col-span-3 relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-royal-pink focus:outline-none focus:ring-1 focus:ring-royal-pink shadow-sm"
          >
            <option value="All">All Roles ({batters.length})</option>
            {uniqueRoles.filter((r) => r !== 'All').map((r) => (
              <option key={r} value={r}>Role: {r}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Team Filter (2 cols) */}
        <div className="sm:col-span-2 relative">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-royal-pink focus:outline-none focus:ring-1 focus:ring-royal-pink shadow-sm"
          >
            <option value="All">All Teams</option>
            {uniqueTeams.filter((t) => t !== 'All').map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Page size limit (2 cols) */}
        {viewMode === 'all' && (
          <div className="sm:col-span-2 relative">
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-royal-pink focus:outline-none focus:ring-1 focus:ring-royal-pink shadow-sm"
            >
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={-1}>Show All ({batters.length})</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-card border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/80 sticky top-0">
              <tr>
                <th
                  onClick={() => handleSort('rank')}
                  className="px-4 py-3.5 cursor-pointer hover:text-royal-pink transition-colors w-16"
                >
                  <div className="flex items-center space-x-1">
                    <span>Rank</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('striker_name')}
                  className="px-4 py-3.5 cursor-pointer hover:text-royal-pink transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Batter</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-3.5">Franchise</th>
                <th className="px-3 py-3.5">Role</th>
                <th
                  onClick={() => handleSort('adjusted_gap_score')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-royal-pink transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Pressure Score</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('high_sr')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-royal-pink transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>High SR</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('normal_sr')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-royal-pink transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Normal SR</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pressure_lift')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-royal-pink transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Pressure Lift</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('high_balls')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-royal-pink transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>High Balls</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('high_matches')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-royal-pink transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Matches</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5 text-center">Baseline Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayedBatters.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-slate-400">
                    No batters match your current filter criteria.
                  </td>
                </tr>
              ) : (
                displayedBatters.map((batter) => {
                  const universalP = playerMap.get(batter.striker_name);

                  return (
                    <tr
                      key={batter.striker_id}
                      onClick={() => {
                        if (universalP) onSelectPlayer(universalP);
                      }}
                      className="hover:bg-pink-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Rank Medal */}
                      <td className="px-4 py-3 font-bold">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-mono font-black ${
                            batter.rank === 1
                              ? 'bg-amber-400 text-deep-navy shadow-sm'
                              : batter.rank === 2
                              ? 'bg-slate-300 text-deep-navy shadow-sm'
                              : batter.rank === 3
                              ? 'bg-amber-700/20 text-amber-900 border border-amber-300'
                              : 'text-slate-600 bg-slate-100'
                          }`}
                        >
                          {batter.rank}
                        </span>
                      </td>

                      {/* Batter Name */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 group-hover:text-royal-pink transition-colors flex items-center space-x-1.5">
                          <span>{batter.striker_name}</span>
                          {batter.rank <= 10 && (
                            <span className="rounded bg-royal-pink/10 text-royal-pink text-[9px] font-black px-1.5 py-0.5 tracking-tight">
                              Top 10
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Team */}
                      <td className="px-3 py-3 text-slate-500 text-[11px] truncate max-w-[130px]">
                        {batter.team}
                      </td>

                      {/* Role */}
                      <td className="px-3 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          {batter.role}
                        </span>
                      </td>

                      {/* Adjusted Gap Score */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono font-black text-sm text-royal-pink tabular-nums">
                          {batter.adjusted_gap_score.toFixed(1)}
                        </span>
                      </td>

                      {/* High SR */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                        {batter.high_sr.toFixed(1)}
                      </td>

                      {/* Normal SR */}
                      <td className="px-4 py-3 text-right font-mono text-slate-600 tabular-nums">
                        {batter.normal_sr !== null ? batter.normal_sr.toFixed(1) : '—'}
                      </td>

                      {/* Pressure Lift */}
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {batter.pressure_lift !== null ? (
                          <span
                            className={`font-bold ${
                              batter.pressure_lift > 0 ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            {batter.pressure_lift > 0 ? '+' : ''}
                            {batter.pressure_lift.toFixed(1)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* High Balls */}
                      <td className="px-4 py-3 text-right font-mono text-slate-700 tabular-nums">
                        {batter.high_balls}
                      </td>

                      {/* Matches */}
                      <td className="px-4 py-3 text-right font-mono text-slate-700 tabular-nums">
                        {batter.high_matches}
                      </td>

                      {/* Baseline Quality */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            batter.baseline_quality === 'Strong'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : batter.baseline_quality === 'Moderate'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {batter.baseline_quality} ({batter.normal_balls}b)
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-500 gap-2">
          <span>Showing {displayedBatters.length} of {filteredBatters.length} filtered records</span>
          <span className="font-mono">Threshold: ≥ 60 balls & ≥ 8 matches in IPL second-innings chases</span>
        </div>
      </div>
    </div>
  );
};
