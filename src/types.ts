export type Page =
  | 'overview'
  | 'pressure-analytics'
  | 'batter-rankings'
  | 'bowler-rankings'
  | 'player-explorer'
  | 'player-comparison'
  | 'pressure-predictor'
  | 'methodology'
  | 'data-info';

export interface BatterRanking {
  rank: number;
  striker_id: number;
  striker_name: string;
  team: string;
  role: string;
  adjusted_gap_score: number;
  pressure_score: number;
  high_sr: number;
  normal_sr: number | null;
  pressure_lift: number | null;
  high_balls: number;
  high_runs: number;
  high_matches: number;
  normal_balls: number;
  normal_runs: number;
  total_matches: number;
  total_runs: number;
  total_balls: number;
  baseline_reliability: number;
  baseline_quality: string;
  high_sr_pct: number;
  high_balls_pct: number;
  reliable_lift_pct: number;
  total_matches_pct: number;
  is_top10: boolean;
  eligible: boolean;
}

export interface BowlerRanking {
  rank: number;
  bowler_id: number;
  bowler_name: string;
  team: string;
  role: string;
  gap_score: number;
  pressure_score: number;
  high_economy: number;
  high_wickets: number;
  high_balls: number;
  high_runs: number;
  high_matches: number;
  high_dots: number;
  high_boundaries: number;
  total_matches: number;
  dot_pct: number;
  boundary_pct: number;
  wickets_per_over: number;
  economy_pct: number;
  wicket_pct: number;
  dot_pct_score: number;
  boundary_pct_score: number;
  is_top10: boolean;
  eligible: boolean;
}

export interface BattingPressureStats {
  runs: number;
  balls: number;
  dismissals: number;
  fours: number;
  sixes: number;
  matches: number;
  strike_rate: number;
}

export interface BowlingPressureStats {
  runs_conceded: number;
  legal_balls: number;
  wickets: number;
  dots: number;
  boundaries: number;
  matches: number;
  economy: number;
  wickets_per_over: number;
  dot_pct: number;
  boundary_pct: number;
}

export interface UniversalPlayer {
  player_id: number;
  player_name: string;
  team: string;
  role: string;
  batting_stats: {
    High?: BattingPressureStats;
    Medium?: BattingPressureStats;
    Normal?: BattingPressureStats;
  };
  total_batting: {
    runs: number;
    balls: number;
    strike_rate: number;
    dismissals: number;
  };
  bowling_stats: {
    High?: BowlingPressureStats;
    Medium?: BowlingPressureStats;
    Normal?: BowlingPressureStats;
  };
  total_bowling: {
    runs_conceded: number;
    legal_balls: number;
    wickets: number;
    economy: number;
    dot_pct: number;
  };
  batter_ranking: BatterRanking | null;
  bowler_ranking: BowlerRanking | null;
  is_bat_eligible: boolean;
  is_bowl_eligible: boolean;
  bat_ineligibility_reason: string | null;
  bowl_ineligibility_reason: string | null;
}

export interface OverviewMetrics {
  total_players_analysed: number;
  total_matches_analysed: number;
  total_deliveries_analysed: number;
  high_pressure_deliveries: number;
  medium_pressure_deliveries: number;
  normal_pressure_deliveries: number;
  qualifying_chase_deliveries: number;
  raw_balls_count: number;
  raw_matches_count: number;
  number_of_eligible_batters: number;
  number_of_eligible_bowlers: number;
  top_rated_batter: BatterRanking;
  top_rated_bowler: BowlerRanking;
  top5_batters: BatterRanking[];
  top5_bowlers: BowlerRanking[];
  pressure_distribution: {
    High: { count: number; pct: number };
    Medium: { count: number; pct: number };
    Normal: { count: number; pct: number };
  };
  format_breakdown: {
    IPL: { High: number; Medium: number; Normal: number; Total: number };
    T20I: { High: number; Medium: number; Normal: number; Total: number };
  };
  phase_breakdown: {
    Powerplay: { High: number; Medium: number; Normal: number; Total: number };
    Middle: { High: number; Medium: number; Normal: number; Total: number };
    Death: { High: number; Medium: number; Normal: number; Total: number };
  };
  severity_breakdown: {
    Competitive_High: number;
    Severe_High: number;
    Extreme_High: number;
  };
  cohort_benchmarks: {
    batter_high_avg_sr: number;
    batter_normal_avg_sr: number;
    bowler_high_avg_econ: number;
    bowler_high_avg_dot_pct: number;
  };
}
