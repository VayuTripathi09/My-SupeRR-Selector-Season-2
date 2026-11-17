import React, { useState } from 'react';
import {
  Database,
  FileSpreadsheet,
  Calendar,
  Users,
  ShieldAlert,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Server,
  FileText,
  Terminal,
  Activity
} from 'lucide-react';

export const DataModelInfoPage: React.FC = () => {
  const [expandedFile, setExpandedFile] = useState<string | null>('ball_by_ball.csv');

  const datasets = [
    {
      file: 'ball_by_ball.csv',
      rows: '200,999',
      size: '41.1 MB',
      type: 'Telemetry Core',
      description: 'Granular delivery-level records including match_id, over, ball, bowler, striker, extras, wickets, and run events.',
      primaryKeys: ['match_id', 'innings', 'overid', 'over_ball_num'],
      columns: [
        { name: 'match_id', type: 'int64', role: 'Match foreign key identifier' },
        { name: 'innings', type: 'int64', role: 'Innings ordinal (1 or 2; 2 isolates chases)' },
        { name: 'overid', type: 'int64', role: 'Over number (0 to 19)' },
        { name: 'over_ball_num', type: 'int64', role: 'Ball number within over (1 to 6+)' },
        { name: 'innings_ball_num', type: 'int64', role: 'Sequential ball in innings' },
        { name: 'striker_id', type: 'int64', role: 'Batter on strike ID' },
        { name: 'striker_name', type: 'string', role: 'Official batter roster name' },
        { name: 'bowler_id', type: 'int64', role: 'Delivery bowler ID' },
        { name: 'bowler_name', type: 'string', role: 'Official bowler roster name' },
        { name: 'runs', type: 'int64', role: 'Runs scored off the bat' },
        { name: 'extras_type', type: 'string', role: 'wides, noballs, legbyes, byes, penalty' },
        { name: 'is_four', type: 'boolean', role: 'Boundary four hit' },
        { name: 'is_six', type: 'boolean', role: 'Boundary six hit' },
        { name: 'is_wicket', type: 'boolean', role: 'Dismissal event on delivery' },
        { name: 'dismissal_type', type: 'string', role: 'bowled, caught, lbw, run_out, etc.' },
      ]
    },
    {
      file: 'matches.csv',
      rows: '883',
      size: '123.8 KB',
      type: 'Match Metadata',
      description: 'Match-level fixtures, dates, venues, teams, revised overs (DLS), targets, and victory margins.',
      primaryKeys: ['match_id'],
      columns: [
        { name: 'match_id', type: 'int64', role: 'Unique match identifier' },
        { name: 'comp_id', type: 'int64', role: 'Competition foreign key' },
        { name: 'match_date', type: 'date', role: 'ISO 8601 match date' },
        { name: 'venue_name', type: 'string', role: 'Stadium / ground name' },
        { name: 'venue_city', type: 'string', role: 'Host city' },
        { name: 'home_team', type: 'string', role: 'Franchise / country 1' },
        { name: 'away_team', type: 'string', role: 'Franchise / country 2' },
        { name: 'win_team_id', type: 'int64', role: 'Winning team identifier' },
        { name: 'revised_target', type: 'float64', role: 'DLS adjusted target score' },
      ]
    },
    {
      file: 'playing_eleven.csv',
      rows: '28,381',
      size: '966.2 KB',
      type: 'Team Lineups',
      description: 'Team rosters per match, batting orders, captaincy, wicketkeeping designation, and impact-sub records.',
      primaryKeys: ['match_id', 'player_id'],
      columns: [
        { name: 'match_id', type: 'int64', role: 'Match foreign key' },
        { name: 'team_id', type: 'int64', role: 'Team foreign key' },
        { name: 'player_id', type: 'int64', role: 'Player identifier' },
        { name: 'batting_order', type: 'int64', role: 'Nominated batting slot (1–11)' },
        { name: 'is_played', type: 'boolean', role: 'Participated in match' },
        { name: 'is_captain', type: 'boolean', role: 'Squad captain' },
        { name: 'is_wk', type: 'boolean', role: 'Wicketkeeper' },
        { name: 'is_impact', type: 'boolean', role: 'Impact player introduced' },
      ]
    },
    {
      file: 'competition_team_player_mapping.csv',
      rows: '6,413',
      size: '462.9 KB',
      type: 'Entity Roster',
      description: 'Mappings associating individual player IDs with tournament franchises and national teams.',
      primaryKeys: ['comp_id', 'team_id', 'player_id'],
      columns: [
        { name: 'comp_id', type: 'int64', role: 'Tournament series key' },
        { name: 'comp_name', type: 'string', role: 'IPL 2024, ICC T20 WC, etc.' },
        { name: 'team_id', type: 'int64', role: 'Team key' },
        { name: 'team_name', type: 'string', role: 'Rajasthan Royals, India, etc.' },
        { name: 'player_id', type: 'int64', role: 'Player registry key' },
        { name: 'player_name', type: 'string', role: 'Canonical player name' },
      ]
    },
    {
      file: 'competitions.csv',
      rows: '141',
      size: '7.6 KB',
      type: 'Tournaments',
      description: 'Tournament definitions, seasons, format categories (IPL vs T20I), and series identities.',
      primaryKeys: ['comp_id'],
      columns: [
        { name: 'comp_id', type: 'int64', role: 'Competition primary key' },
        { name: 'comp_name', type: 'string', role: 'Competition title' },
        { name: 'match_format', type: 'string', role: 'IPL or T20I' },
        { name: 'season', type: 'string', role: 'Season year (2022–2026)' },
      ]
    },
    {
      file: 'teams.csv',
      rows: '353',
      size: '6.9 KB',
      type: 'Franchises',
      description: 'Master list of participating franchise and national team identities.',
      primaryKeys: ['comp_id', 'team_id'],
      columns: [
        { name: 'comp_id', type: 'int64', role: 'Competition key' },
        { name: 'team_id', type: 'int64', role: 'Team key' },
        { name: 'team_name', type: 'string', role: 'Team official display name' },
      ]
    },
  ];

  return (
    <div className="space-y-8 pb-14 max-w-6xl mx-auto">
      {/* Executive Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-dark via-navy-surface to-slate-950 p-8 sm:p-10 text-white shadow-xl border border-navy-border/80">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-royal-pink/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
              <Database className="h-3.5 w-3.5 text-royal-pink" />
              <span>Data & Systems Architecture</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/20">
              <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>All 6 Master Datasets Verified</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Data Catalog & System Telemetry
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Complete inventory of raw ingested tables, relational schemas, pipeline transformations, and computational boundary limitations powering the Rajasthan Royals SupeRR Selector platform.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Total Raw Volume</span>
              <span className="text-white font-bold font-mono text-sm">200,999 Deliveries</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Filtered Legal Balls</span>
              <span className="text-white font-bold font-mono text-sm">193,988 Balls</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Total Matches</span>
              <span className="text-royal-pink font-bold font-mono text-sm">837 Fixtures</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Tracked Players</span>
              <span className="text-lavender font-bold font-mono text-sm">842 Profiles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Inventory Cards */}
      <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-royal-pink">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-dark">Master Dataset Inventory</h3>
              <p className="text-xs text-slate-500">Workspace CSV source files audited and loaded into pipeline</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            6 Tables • 42.6 MB Total
          </span>
        </div>

        <div className="space-y-3">
          {datasets.map((ds) => {
            const isExpanded = expandedFile === ds.file;
            return (
              <div
                key={ds.file}
                className="rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50/80 transition-all overflow-hidden"
              >
                <div
                  onClick={() => setExpandedFile(isExpanded ? null : ds.file)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm text-royal-pink font-mono text-xs font-bold">
                      CSV
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-navy-dark">{ds.file}</span>
                        <span className="rounded bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-semibold">
                          {ds.size}
                        </span>
                        <span className="rounded bg-pink-50 text-royal-pink border border-pink-200 px-2 py-0.5 text-[10px] font-semibold">
                          {ds.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ds.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-navy-dark block">{ds.rows}</span>
                      <span className="text-[10px] text-slate-400">Rows</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Schema Table */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Schema Columns ({ds.columns.length})
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Primary Key: {ds.primaryKeys.join(', ')}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase text-slate-400">
                            <th className="pb-2">Column</th>
                            <th className="pb-2">Data Type</th>
                            <th className="pb-2">Description / Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                          {ds.columns.map((col) => (
                            <tr key={col.name} className="hover:bg-slate-50/50">
                              <td className="py-1.5 font-bold text-royal-pink">{col.name}</td>
                              <td className="py-1.5 text-slate-500">{col.type}</td>
                              <td className="py-1.5 font-sans text-slate-600">{col.role}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scope & Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-royal-pink">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-dark">Temporal & Competition Scope</h4>
              <p className="text-xs text-slate-500">Filtering boundaries applied during ingestion</p>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Indian Premier League (IPL):</strong> Seasons 2022 to 2026 inclusive. All league and playoff matches.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>International T20s (T20I):</strong> ICC Men's T20 World Cups, Asia Cups, and bilateral series (2022–2026).</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Exclusions:</strong> Abandoned games without play, exhibition matches, and Super Overs (isolated from regular 20-over rate metrics).</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-dark">Eligible Cohort Funnel</h4>
              <p className="text-xs text-slate-500">Strict qualification gates preventing noise</p>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700">Total Unique Players Tracked</span>
              <span className="font-mono font-bold text-navy-dark">842</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/50 border border-pink-100">
              <span className="text-slate-700">Eligible Batters (≥60 balls, ≥8 matches)</span>
              <span className="font-mono font-bold text-royal-pink">45 (5.3%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <span className="text-slate-700">Eligible Bowlers (≥60 balls, ≥8 matches)</span>
              <span className="font-mono font-bold text-indigo-600">56 (6.6%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Spec: Deterministic Pipeline */}
      <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-navy-dark">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-navy-dark">Model Architecture & Computational Telemetry</h4>
            <p className="text-xs text-slate-500">Deterministic scoring versus machine-learning binary artifacts</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed space-y-3">
          <p>
            Comprehensive workspace analysis confirms <strong>no machine-learning binary files (such as .pkl, .joblib, .pt, or .onnx)</strong> exist in this project. All predictive and ranking capability is powered by a verified mathematical pipeline:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-[11px]">
            <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2">
              <span className="font-bold text-pink-300 block">Batting Pipeline Inputs:</span>
              <div className="space-y-1 text-slate-300">
                <p>• <code>high_sr</code>: Strike Rate under high pressure (RRR≥12 etc.)</p>
                <p>• <code>high_balls</code>: Legal balls faced in high pressure</p>
                <p>• <code>normal_sr</code>: Strike Rate under standard chase conditions</p>
                <p>• <code>normal_balls</code>: Normal volume for Bayes shrinkage</p>
                <p>• <code>total_matches</code>: Experience across distinct chases</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2">
              <span className="font-bold text-indigo-300 block">Bowling Pipeline Inputs:</span>
              <div className="space-y-1 text-slate-300">
                <p>• <code>high_economy</code>: Runs conceded per 6 legal balls</p>
                <p>• <code>wickets_per_over</code>: Wickets per 6 legal deliveries</p>
                <p>• <code>dot_pct</code>: Percentage of 0-run legal deliveries</p>
                <p>• <code>boundary_pct</code>: Percentage of 4s and 6s conceded</p>
                <p>• <code>high_balls</code>: High-pressure delivery sample size</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Limitations */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-6 space-y-3">
        <div className="flex items-center space-x-2 text-navy-dark">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Data Quality Audit & Known Technical Constraints
          </h4>
        </div>
        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            <strong>1. Second-Innings Chase Restriction:</strong> In 1st innings, pressure is inherently subjective due to differing pitch par scores. Restricting pressure modelling strictly to chases provides mathematically verified target horizons.
          </p>
          <p>
            <strong>2. Specialist Finisher Sample Asymmetry:</strong> Lower-order batters face limited normal-pressure balls. Our empirical Bayes shrinkage (pseudo-count k=100) resolves this without producing misleading negative or inflated lifts.
          </p>
          <p>
            <strong>3. Extras Sanitation:</strong> Non-delivery penalties (e.g., 5 runs awarded for ball hitting helmet) were identified and isolated, guaranteeing that player balls-faced and overs-bowled counts match verified official scorecards.
          </p>
        </div>
      </div>
    </div>
  );
};
