import React, { useEffect } from 'react';
import { UniversalPlayer } from '../types';
import {
  X,
  Trophy,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Activity,
  Flame,
  Zap,
  Target,
  Swords,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PlayerModalProps {
  player: UniversalPlayer | null;
  onClose: () => void;
  onOpenCompare?: (player: UniversalPlayer) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  onClose,
  onOpenCompare,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-dark/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-modal border border-slate-200/80 overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-card-dark p-6 text-white relative border-b border-navy-border">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-10">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-royal-pink to-pink-500 text-white font-extrabold text-2xl shadow-royal shrink-0">
                {player.player_name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-display font-extrabold tracking-tight text-white">
                    {player.player_name}
                  </h2>
                  {player.batter_ranking && (
                    <span className="rounded-full bg-royal-pink px-2.5 py-0.5 text-[11px] font-black text-white shadow-sm">
                      Rank #{player.batter_ranking.rank} Batter
                    </span>
                  )}
                  {player.bowler_ranking && (
                    <span className="rounded-full bg-indigo-500 px-2.5 py-0.5 text-[11px] font-black text-white shadow-sm">
                      Rank #{player.bowler_ranking.rank} Bowler
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-300">
                  <span className="font-bold text-pink-300">{player.team}</span>
                  <span className="text-slate-500">•</span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-slate-200 font-medium">{player.role}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-mono text-[11px]">ID: {player.player_id}</span>
                </div>
              </div>
            </div>

            {onOpenCompare && (
              <button
                onClick={() => {
                  onOpenCompare(player);
                  onClose();
                }}
                className="inline-flex items-center space-x-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 text-xs font-bold transition-all border border-white/20 shadow-sm"
              >
                <span>Add to Comparison</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Eligibility & Ranking Overview Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Batter Status Card */}
            <div className={`rounded-2xl p-4 border transition-all ${
              player.is_bat_eligible 
                ? 'bg-pink-50/50 border-pink-200/80 shadow-sm' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Swords className={`h-4 w-4 ${player.is_bat_eligible ? 'text-royal-pink' : 'text-slate-400'}`} />
                  <span className="text-xs font-extrabold uppercase tracking-wide text-slate-800">
                    Batting Reliability Status
                  </span>
                </div>
                {player.is_bat_eligible ? (
                  <span className="flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Eligible (Rank #{player.batter_ranking?.rank})
                  </span>
                ) : (
                  <span className="flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <ShieldAlert className="h-3.5 w-3.5 mr-1" /> Ineligible
                  </span>
                )}
              </div>

              {player.batter_ranking ? (
                <div className="space-y-2 mt-3 pt-2 border-t border-slate-200/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Adjusted Pressure Score:</span>
                    <span className="font-mono font-black text-royal-pink text-base">
                      {player.batter_ranking.adjusted_gap_score.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">High-Pressure Strike Rate:</span>
                    <span className="font-mono font-bold text-slate-800">{player.batter_ranking.high_sr.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Pressure Lift (vs Normal):</span>
                    <span className={`font-mono font-bold ${
                      player.batter_ranking.pressure_lift && player.batter_ranking.pressure_lift > 0 
                        ? 'text-emerald-600' 
                        : 'text-red-500'
                    }`}>
                      {player.batter_ranking.pressure_lift 
                        ? `${player.batter_ranking.pressure_lift > 0 ? '+' : ''}${player.batter_ranking.pressure_lift.toFixed(1)}` 
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Baseline Evidence Quality:</span>
                    <span className="font-medium text-slate-700">
                      {player.batter_ranking.baseline_quality} (Weight: {player.batter_ranking.baseline_reliability.toFixed(2)})
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {player.bat_ineligibility_reason || "Threshold not met: player has fewer than 60 high-pressure balls or 8 matches in IPL second-innings chases."}
                </p>
              )}
            </div>

            {/* Bowler Status Card */}
            <div className={`rounded-2xl p-4 border transition-all ${
              player.is_bowl_eligible 
                ? 'bg-indigo-50/50 border-indigo-200/80 shadow-sm' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Target className={`h-4 w-4 ${player.is_bowl_eligible ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-extrabold uppercase tracking-wide text-slate-800">
                    Bowling Reliability Status
                  </span>
                </div>
                {player.is_bowl_eligible ? (
                  <span className="flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Eligible (Rank #{player.bowler_ranking?.rank})
                  </span>
                ) : (
                  <span className="flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <ShieldAlert className="h-3.5 w-3.5 mr-1" /> Ineligible
                  </span>
                )}
              </div>

              {player.bowler_ranking ? (
                <div className="space-y-2 mt-3 pt-2 border-t border-slate-200/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Composite Gap Score:</span>
                    <span className="font-mono font-black text-indigo-700 text-base">
                      {player.bowler_ranking.gap_score.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">High-Pressure Economy:</span>
                    <span className="font-mono font-bold text-slate-800">{player.bowler_ranking.high_economy.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Dot-Ball Percentage:</span>
                    <span className="font-mono font-bold text-emerald-600">{player.bowler_ranking.dot_pct.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Boundary Conceded %:</span>
                    <span className="font-mono font-bold text-slate-800">{player.bowler_ranking.boundary_pct.toFixed(1)}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {player.bowl_ineligibility_reason || "Threshold not met: player has fewer than 60 high-pressure legal balls or 8 matches in IPL second-innings chases."}
                </p>
              )}
            </div>
          </div>

          {/* Batting Pressure Breakdown */}
          {player.total_batting.balls > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <Flame className="h-4 w-4 text-royal-pink" />
                <h3 className="text-xs font-bold text-deep-navy uppercase tracking-wider">
                  Batting Performance By Pressure Tier (Second-Innings Chases)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3.5 py-2.5">Pressure Tier</th>
                      <th className="px-3.5 py-2.5 text-right">Runs</th>
                      <th className="px-3.5 py-2.5 text-right">Balls</th>
                      <th className="px-3.5 py-2.5 text-right">Strike Rate</th>
                      <th className="px-3.5 py-2.5 text-right">Fours</th>
                      <th className="px-3.5 py-2.5 text-right">Sixes</th>
                      <th className="px-3.5 py-2.5 text-right">Dismissals</th>
                      <th className="px-3.5 py-2.5 text-right">Matches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-mono text-[11px]">
                    {['High', 'Medium', 'Normal'].map((tier) => {
                      const stats = player.batting_stats[tier as keyof typeof player.batting_stats];
                      const tierStyle =
                        tier === 'High'
                          ? 'text-royal-pink font-bold bg-pink-50/30'
                          : tier === 'Medium'
                          ? 'text-amber-800'
                          : 'text-slate-700';

                      return (
                        <tr key={tier} className={tierStyle}>
                          <td className="px-3.5 py-2.5 flex items-center space-x-1.5 font-sans font-semibold">
                            <span className={`w-2 h-2 rounded-full ${
                              tier === 'High' ? 'bg-royal-pink' : tier === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <span>{tier} Pressure</span>
                          </td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? stats.runs : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? stats.balls : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums font-black text-slate-900">
                            {stats ? stats.strike_rate.toFixed(1) : '—'}
                          </td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? stats.fours : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? stats.sixes : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? stats.dismissals : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? stats.matches : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bowling Pressure Breakdown */}
          {player.total_bowling.legal_balls > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <Target className="h-4 w-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-deep-navy uppercase tracking-wider">
                  Bowling Performance By Pressure Tier (Second-Innings Chases)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3.5 py-2.5">Pressure Tier</th>
                      <th className="px-3.5 py-2.5 text-right">Legal Balls</th>
                      <th className="px-3.5 py-2.5 text-right">Overs</th>
                      <th className="px-3.5 py-2.5 text-right">Runs</th>
                      <th className="px-3.5 py-2.5 text-right">Wickets</th>
                      <th className="px-3.5 py-2.5 text-right">Economy</th>
                      <th className="px-3.5 py-2.5 text-right">Dot Ball %</th>
                      <th className="px-3.5 py-2.5 text-right">Boundary %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-mono text-[11px]">
                    {['High', 'Medium', 'Normal'].map((tier) => {
                      const stats = player.bowling_stats[tier as keyof typeof player.bowling_stats];
                      const tierStyle =
                        tier === 'High'
                          ? 'text-indigo-700 font-bold bg-indigo-50/30'
                          : tier === 'Medium'
                          ? 'text-amber-800'
                          : 'text-slate-700';

                      return (
                        <tr key={tier} className={tierStyle}>
                          <td className="px-3.5 py-2.5 flex items-center space-x-1.5 font-sans font-semibold">
                            <span className={`w-2 h-2 rounded-full ${
                              tier === 'High' ? 'bg-indigo-600' : tier === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <span>{tier} Pressure</span>
                          </td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? stats.legal_balls : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">
                            {stats ? (stats.legal_balls / 6).toFixed(1) : '—'}
                          </td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? stats.runs_conceded : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums font-black text-emerald-600">{stats ? stats.wickets : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums font-black text-slate-900">{stats ? stats.economy.toFixed(2) : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums text-emerald-700 font-semibold">{stats ? `${stats.dot_pct.toFixed(1)}%` : '—'}</td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums">{stats ? `${stats.boundary_pct.toFixed(1)}%` : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Strategic RR 2027 Auction Context */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
            <h4 className="text-xs font-bold text-deep-navy uppercase tracking-wider mb-1 flex items-center">
              <Zap className="h-3.5 w-3.5 text-royal-pink mr-1.5" />
              Rajasthan Royals Strategic Takeaway (IPL 2027 Strategy)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {player.is_bat_eligible && player.batter_ranking && player.batter_ranking.rank <= 10
                ? `${player.player_name} is ranked #${player.batter_ranking.rank} in the RR Final Shortlist with a ${player.batter_ranking.adjusted_gap_score.toFixed(1)} pressure score. Fills RR's critical ${player.role} vacancy with exceptional clutch strike rate (${player.batter_ranking.high_sr.toFixed(1)}) across ${player.batter_ranking.high_balls} high-pressure deliveries.`
                : player.is_bowl_eligible && player.bowler_ranking && player.bowler_ranking.rank <= 10
                ? `${player.player_name} is ranked #${player.bowler_ranking.rank} in the RR Final Shortlist with a ${player.bowler_ranking.gap_score.toFixed(1)} pressure score. Offers elite death/clutch bowling control with a ${player.bowler_ranking.high_economy.toFixed(2)} economy and ${player.bowler_ranking.dot_pct.toFixed(1)}% dot balls.`
                : `${player.player_name} provides squad depth. Evaluated in the broader IPL & T20I second-innings chase pool (${player.total_batting.balls} balls faced, ${player.total_bowling.legal_balls} legal deliveries bowled).`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/80 px-6 py-3.5 bg-slate-50/80 flex justify-between items-center">
          <div className="text-[11px] text-slate-500 font-mono">
            Source: <code className="text-slate-700">ball_by_ball.csv</code> • Super Over Excluded
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-deep-navy px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
