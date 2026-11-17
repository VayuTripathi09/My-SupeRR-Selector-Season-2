import React, { useState, useMemo } from 'react';
import { UniversalPlayer } from '../types';
import {
  Scale,
  Users,
  Swords,
  Target,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  X,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Medal
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

interface PlayerComparisonPageProps {
  players: UniversalPlayer[];
  initialPlayer?: UniversalPlayer | null;
}

export const PlayerComparisonPage: React.FC<PlayerComparisonPageProps> = ({
  players,
  initialPlayer,
}) => {
  // Preset defaults
  const tilak = players.find((p) => p.player_name.includes('Tilak Varma')) || players[0];
  const miller = players.find((p) => p.player_name.includes('Miller')) || players[1];
  const rinku = players.find((p) => p.player_name.includes('Rinku')) || players[2];

  const [selectedIds, setSelectedIds] = useState<number[]>([
    initialPlayer ? initialPlayer.player_id : tilak.player_id,
    miller.player_id,
  ]);

  const selectedPlayers = useMemo(() => {
    return selectedIds
      .map((id) => players.find((p) => p.player_id === id))
      .filter((p): p is UniversalPlayer => p !== undefined);
  }, [selectedIds, players]);

  const handleAddPlayer = (id: number) => {
    if (!selectedIds.includes(id) && selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemovePlayer = (id: number) => {
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter((pId) => pId !== id));
    }
  };

  const setPreset = (names: string[]) => {
    const matched = names
      .map((n) => players.find((p) => p.player_name.toLowerCase().includes(n.toLowerCase())))
      .filter((p): p is UniversalPlayer => p !== undefined)
      .map((p) => p.player_id);

    if (matched.length >= 2) {
      setSelectedIds(matched.slice(0, 3));
    }
  };

  // Bar chart data for strike rates & economy
  const performanceChartData = useMemo(() => {
    return selectedPlayers.map((p) => ({
      name: p.player_name.split(' ').slice(-1)[0],
      fullName: p.player_name,
      'High Pressure SR': p.batting_stats.High?.strike_rate ?? 0,
      'Normal Pressure SR': p.batting_stats.Normal?.strike_rate ?? 0,
      'High Economy': p.bowling_stats.High?.economy ?? 0,
      'Dot %': p.bowling_stats.High?.dot_pct ?? 0,
      'High Balls': (p.batting_stats.High?.balls ?? 0) + (p.bowling_stats.High?.legal_balls ?? 0),
    }));
  }, [selectedPlayers]);

  return (
    <div className="space-y-7 pb-12 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-deep-navy">
            Head-to-Head Candidate Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare 2 or 3 players across clutch metrics, sample exposure, and RR 2027 squad fit
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">Presets:</span>
          <button
            onClick={() => setPreset(['Tilak Varma', 'David Miller', 'Rinku Singh'])}
            className="rounded-lg bg-pink-50 text-royal-pink px-2.5 py-1 text-xs font-bold border border-pink-200 hover:bg-pink-100 transition-colors shadow-sm"
          >
            Top 3 Finishers
          </button>
          <button
            onClick={() => setPreset(['Eshan Malinga', 'Mohit Sharma', 'Jasprit Bumrah'])}
            className="rounded-lg bg-indigo-50 text-indigo-700 px-2.5 py-1 text-xs font-bold border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            Elite Death Bowlers
          </button>
          <button
            onClick={() => setPreset(['Marcus Stoinis', 'Shivam Dube'])}
            className="rounded-lg bg-amber-50 text-amber-800 px-2.5 py-1 text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors shadow-sm"
          >
            Power All-Rounders
          </button>
        </div>
      </div>

      {/* Player Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((slotIndex) => {
          const player = selectedPlayers[slotIndex];
          return (
            <div
              key={slotIndex}
              className={`rounded-2xl p-4 border transition-all ${
                player
                  ? 'bg-white shadow-card border-slate-200/80'
                  : 'bg-slate-50/70 border-dashed border-slate-300 flex flex-col items-center justify-center py-8'
              }`}
            >
              {player ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Candidate {slotIndex + 1}
                    </span>
                    {selectedPlayers.length > 2 && (
                      <button
                        onClick={() => handleRemovePlayer(player.player_id)}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors"
                        title="Remove candidate"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-deep-navy to-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {player.player_name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {player.player_name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {player.team} • {player.role}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <select
                      value={player.player_id}
                      onChange={(e) => {
                        const newId = parseInt(e.target.value);
                        const updated = [...selectedIds];
                        updated[slotIndex] = newId;
                        setSelectedIds(updated);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:border-royal-pink focus:outline-none"
                    >
                      {players.map((p) => (
                        <option key={p.player_id} value={p.player_id}>
                          {p.player_name} ({p.team})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleAddPlayer(parseInt(e.target.value));
                    }}
                    defaultValue=""
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    <option value="" disabled>+ Add 3rd Candidate</option>
                    {players
                      .filter((p) => !selectedIds.includes(p.player_id))
                      .map((p) => (
                        <option key={p.player_id} value={p.player_id}>
                          {p.player_name} ({p.team})
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Key Metrics Table */}
      <div className="rounded-2xl bg-white shadow-card border border-slate-200/80 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4 text-royal-pink" />
            <h3 className="text-xs font-bold text-deep-navy uppercase tracking-wider">
              Clutch Performance Matrix
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Green pill indicates top value</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3 w-1/4">Metric</th>
                {selectedPlayers.map((p) => (
                  <th key={p.player_id} className="px-5 py-3 text-center">
                    <div className="font-extrabold text-deep-navy text-sm font-sans">{p.player_name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{p.team}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {/* Batting Pressure Score */}
              <tr className="bg-slate-50/40">
                <td className="px-5 py-3 font-bold text-slate-700">Batting Pressure Score</td>
                {selectedPlayers.map((p) => {
                  const score = p.batter_ranking?.adjusted_gap_score;
                  const isMax = score !== undefined && score === Math.max(...selectedPlayers.map((x) => x.batter_ranking?.adjusted_gap_score ?? -1));
                  return (
                    <td key={p.player_id} className="px-5 py-3 text-center font-mono">
                      {score !== undefined ? (
                        <span className={`text-base font-black ${isMax ? 'text-royal-pink font-extrabold' : 'text-slate-800'}`}>
                          {score.toFixed(1)}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            (#{p.batter_ranking?.rank})
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Ineligible</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Bowling Pressure Score */}
              <tr>
                <td className="px-5 py-3 font-bold text-slate-700">Bowling Pressure Score</td>
                {selectedPlayers.map((p) => {
                  const score = p.bowler_ranking?.gap_score;
                  const isMax = score !== undefined && score === Math.max(...selectedPlayers.map((x) => x.bowler_ranking?.gap_score ?? -1));
                  return (
                    <td key={p.player_id} className="px-5 py-3 text-center font-mono">
                      {score !== undefined ? (
                        <span className={`text-base font-black ${isMax ? 'text-indigo-600 font-extrabold' : 'text-slate-800'}`}>
                          {score.toFixed(1)}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            (#{p.bowler_ranking?.rank})
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Ineligible</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* High-Pressure Strike Rate */}
              <tr className="bg-slate-50/40">
                <td className="px-5 py-3 font-semibold text-slate-600">High-Pressure Strike Rate</td>
                {selectedPlayers.map((p) => {
                  const val = p.batting_stats.High?.strike_rate;
                  const isMax = val !== undefined && val > 0 && val === Math.max(...selectedPlayers.map((x) => x.batting_stats.High?.strike_rate ?? 0));
                  return (
                    <td key={p.player_id} className="px-5 py-3 text-center font-mono font-bold">
                      {val !== undefined && val > 0 ? (
                        <span className={isMax ? 'text-royal-pink font-black text-sm' : 'text-slate-800'}>
                          {val.toFixed(1)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Normal-Pressure Strike Rate */}
              <tr>
                <td className="px-5 py-3 font-semibold text-slate-600">Normal-Pressure Strike Rate</td>
                {selectedPlayers.map((p) => {
                  const val = p.batting_stats.Normal?.strike_rate;
                  return (
                    <td key={p.player_id} className="px-5 py-3 text-center text-slate-600 font-mono">
                      {val !== undefined && val > 0 ? val.toFixed(1) : '—'}
                    </td>
                  );
                })}
              </tr>

              {/* Pressure Lift */}
              <tr className="bg-slate-50/40">
                <td className="px-5 py-3 font-semibold text-slate-600">Pressure Lift (High vs Normal)</td>
                {selectedPlayers.map((p) => {
                  const lift = p.batter_ranking?.pressure_lift;
                  return (
                    <td key={p.player_id} className="px-5 py-3 text-center font-mono font-bold">
                      {lift !== undefined && lift !== null ? (
                        <span className={lift > 0 ? 'text-emerald-600' : 'text-red-500'}>
                          {lift > 0 ? '+' : ''}{lift.toFixed(1)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* High-Pressure Economy */}
              <tr>
                <td className="px-5 py-3 font-semibold text-slate-600">High-Pressure Economy</td>
                {selectedPlayers.map((p) => {
                  const econ = p.bowling_stats.High?.economy;
                  return (
                    <td key={p.player_id} className="px-5 py-3 text-center font-mono font-bold text-slate-800">
                      {econ !== undefined && econ > 0 ? econ.toFixed(2) : '—'}
                    </td>
                  );
                })}
              </tr>

              {/* Dot-Ball Percentage */}
              <tr className="bg-slate-50/40">
                <td className="px-5 py-3 font-semibold text-slate-600">High-Pressure Dot-Ball %</td>
                {selectedPlayers.map((p) => {
                  const dots = p.bowling_stats.High?.dot_pct;
                  return (
                    <td key={p.player_id} className="px-5 py-3 text-center font-mono font-semibold text-emerald-600">
                      {dots !== undefined && dots > 0 ? `${dots.toFixed(1)}%` : '—'}
                    </td>
                  );
                })}
              </tr>

              {/* Sample Size (High Balls Faced / Bowled) */}
              <tr>
                <td className="px-5 py-3 font-semibold text-slate-600">High-Pressure Deliveries (Sample)</td>
                {selectedPlayers.map((p) => {
                  const batBalls = p.batting_stats.High?.balls ?? 0;
                  const bowlBalls = p.bowling_stats.High?.legal_balls ?? 0;
                  return (
                    <td key={p.player_id} className="px-5 py-3 text-center text-slate-700 font-mono">
                      {batBalls > 0 && `${batBalls}b Faced`}
                      {batBalls > 0 && bowlBalls > 0 && ' / '}
                      {bowlBalls > 0 && `${bowlBalls}b Bowled`}
                      {batBalls === 0 && bowlBalls === 0 && '0 balls'}
                    </td>
                  );
                })}
              </tr>

              {/* RR Role Fit Suitability */}
              <tr className="bg-pink-50/30">
                <td className="px-5 py-3 font-bold text-deep-navy">RR 2027 Strategic Suitability</td>
                {selectedPlayers.map((p) => (
                  <td key={p.player_id} className="px-5 py-3 text-center">
                    <span className="rounded-full bg-pink-100 text-royal-pink font-bold px-3 py-1 text-[11px] border border-pink-200 inline-block shadow-sm">
                      {p.role}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Chart Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batting SR Comparison */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80">
          <h4 className="text-xs font-bold text-deep-navy uppercase tracking-wider mb-2">
            High vs Normal Strike Rate Comparison
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#14213D', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="High Pressure SR" fill="#EA1B85" name="High Pressure SR" />
                <Bar dataKey="Normal Pressure SR" fill="#64748B" name="Normal Pressure SR" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High-Pressure Sample Volume Comparison */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80">
          <h4 className="text-xs font-bold text-deep-navy uppercase tracking-wider mb-2">
            Sample Volume & Reliability Basis
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#14213D', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="High Balls" fill="#14213D" name="High-Pressure Deliveries" />
                <Bar dataKey="Dot %" fill="#10B981" name="Dot Ball %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
