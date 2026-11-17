import React, { useState, useMemo } from 'react';
import { BowlerRanking, UniversalPlayer } from '../types';
import {
  Target,
  Search,
  Filter,
  ArrowUpDown,
  Trophy,
  Award,
  ChevronDown,
  TrendingDown,
  Download,
  X
} from 'lucide-react';

interface BowlerRankingsPageProps {
  bowlers: BowlerRanking[];
  allPlayers: UniversalPlayer[];
  onSelectPlayer: (player: UniversalPlayer) => void;
}

export const BowlerRankingsPage: React.FC<BowlerRankingsPageProps> = ({
  bowlers,
  allPlayers,
  onSelectPlayer,
}) => {
  const [viewMode, setViewMode] = useState<'top10' | 'all'>('top10');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [sortBy, setSortBy] = useState<keyof BowlerRanking>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const playerMap = useMemo(() => new Map(allPlayers.map((p) => [p.player_name, p])), [allPlayers]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(bowlers.map((b) => b.role).filter(Boolean));
    return ['All', ...Array.from(roles)];
  }, [bowlers]);

  const uniqueTeams = useMemo(() => {
    const teams = new Set(bowlers.map((b) => b.team).filter(Boolean));
    return ['All', ...Array.from(teams)];
  }, [bowlers]);

  const filteredBowlers = useMemo(() => {
    let list = viewMode === 'top10' ? bowlers.filter((b) => b.rank <= 10) : [...bowlers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.bowler_name.toLowerCase().includes(q) ||
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
  }, [bowlers, viewMode, searchQuery, selectedRole, selectedTeam, sortBy, sortAsc]);

  const displayedBowlers = useMemo(() => {
    if (viewMode === 'top10') return filteredBowlers;
    if (rowsPerPage === -1) return filteredBowlers;
    return filteredBowlers.slice(0, rowsPerPage);
  }, [filteredBowlers, viewMode, rowsPerPage]);

  const handleSort = (field: keyof BowlerRanking) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(field === 'rank' || field === 'high_economy');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Rank',
      'Bowler Name',
      'Team',
      'Role',
      'Pressure Score',
      'High Economy',
      'High Wickets',
      'High Balls',
      'High Matches',
      'Dot Ball %',
      'Boundary %',
      'Wickets Per Over',
    ];
    const rows = filteredBowlers.map((b) => [
      b.rank,
      `"${b.bowler_name}"`,
      `"${b.team}"`,
      `"${b.role}"`,
      b.gap_score,
      b.high_economy,
      b.high_wickets,
      b.high_balls,
      b.high_matches,
      b.dot_pct,
      b.boundary_pct,
      b.wickets_per_over,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RR_Bowler_Rankings_${viewMode}.csv`);
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
              High-Pressure Bowler Rankings
            </h2>
            <span className="rounded-full bg-indigo-100 text-indigo-700 px-2.5 py-0.5 text-xs font-bold border border-indigo-200">
              {viewMode === 'top10' ? 'Official Top 10' : `All ${bowlers.length} Eligible`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Composite score: 30% Economy Pct + 30% Wicket Pct + 20% Dot Pct + 10% Boundary Pct + 10% Volume Pct
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
                  ? 'bg-indigo-600 text-white shadow-sm'
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
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-deep-navy'
              }`}
            >
              All Eligible ({bowlers.length})
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-sm"
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
            placeholder="Search bowler by name or franchise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-sm"
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
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-sm"
          >
            <option value="All">All Roles ({bowlers.length})</option>
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
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-sm"
          >
            <option value="All">All Teams</option>
            {uniqueTeams.filter((t) => t !== 'All').map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Rows per page (2 cols) */}
        {viewMode === 'all' && (
          <div className="sm:col-span-2 relative">
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-sm"
            >
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={-1}>Show All ({bowlers.length})</option>
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
                  className="px-4 py-3.5 cursor-pointer hover:text-indigo-600 transition-colors w-16"
                >
                  <div className="flex items-center space-x-1">
                    <span>Rank</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('bowler_name')}
                  className="px-4 py-3.5 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Bowler</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-3.5">Franchise</th>
                <th className="px-3 py-3.5">Role</th>
                <th
                  onClick={() => handleSort('gap_score')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Pressure Score</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('high_economy')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Economy</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('high_wickets')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Wickets</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dot_pct')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Dot %</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('boundary_pct')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Boundary %</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('wickets_per_over')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Wkts/Over</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('high_balls')}
                  className="px-4 py-3.5 text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Balls (Mat)</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayedBowlers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-slate-400">
                    No bowlers match your current filter criteria.
                  </td>
                </tr>
              ) : (
                displayedBowlers.map((bowler) => {
                  const universalP = playerMap.get(bowler.bowler_name);

                  return (
                    <tr
                      key={bowler.bowler_id}
                      onClick={() => {
                        if (universalP) onSelectPlayer(universalP);
                      }}
                      className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Rank Medal */}
                      <td className="px-4 py-3 font-bold">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-mono font-black ${
                            bowler.rank === 1
                              ? 'bg-amber-400 text-deep-navy shadow-sm'
                              : bowler.rank === 2
                              ? 'bg-slate-300 text-deep-navy shadow-sm'
                              : bowler.rank === 3
                              ? 'bg-amber-700/20 text-amber-900 border border-amber-300'
                              : 'text-slate-600 bg-slate-100'
                          }`}
                        >
                          {bowler.rank}
                        </span>
                      </td>

                      {/* Bowler Name */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center space-x-1.5">
                          <span>{bowler.bowler_name}</span>
                          {bowler.rank <= 10 && (
                            <span className="rounded bg-indigo-50 text-indigo-700 text-[9px] font-black px-1.5 py-0.5 tracking-tight border border-indigo-200">
                              Top 10
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Team */}
                      <td className="px-3 py-3 text-slate-500 text-[11px] truncate max-w-[130px]">
                        {bowler.team}
                      </td>

                      {/* Role */}
                      <td className="px-3 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          {bowler.role}
                        </span>
                      </td>

                      {/* Gap Score */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono font-black text-sm text-indigo-600 tabular-nums">
                          {bowler.gap_score.toFixed(1)}
                        </span>
                      </td>

                      {/* High Economy */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                        {bowler.high_economy.toFixed(2)}
                      </td>

                      {/* High Wickets */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 tabular-nums">
                        {bowler.high_wickets}
                      </td>

                      {/* Dot % */}
                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-700 tabular-nums">
                        {bowler.dot_pct.toFixed(1)}%
                      </td>

                      {/* Boundary % */}
                      <td className="px-4 py-3 text-right font-mono text-slate-600 tabular-nums">
                        {bowler.boundary_pct.toFixed(1)}%
                      </td>

                      {/* Wickets Per Over */}
                      <td className="px-4 py-3 text-right font-mono text-slate-600 tabular-nums">
                        {bowler.wickets_per_over.toFixed(3)}
                      </td>

                      {/* Balls & Matches */}
                      <td className="px-4 py-3 text-right font-mono text-slate-500 text-[11px] tabular-nums">
                        {bowler.high_balls}b ({bowler.high_matches}m)
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
          <span>Showing {displayedBowlers.length} of {filteredBowlers.length} filtered records</span>
          <span className="font-mono">Threshold: ≥ 60 legal balls & ≥ 8 matches in IPL second-innings chases</span>
        </div>
      </div>
    </div>
  );
};
