import pandas as pd
import numpy as np

print("Loading raw CSVs...")
balls = pd.read_csv('ball_by_ball.csv')
matches = pd.read_csv('matches.csv')
playing = pd.read_csv('playing_eleven.csv')
mapping = pd.read_csv('competition_team_player_mapping.csv')
competitions = pd.read_csv('competitions.csv')
teams = pd.read_csv('teams.csv')

print(f"Original ball_by_ball rows: {len(balls)}")
print(f"Original matches rows: {len(matches)}")

# Clean extras & legal ball status
clean = balls.copy()
clean['extras_type_clean'] = clean['extras_type'].astype('string').str.strip().str.lower()
clean['is_penalty_event'] = clean['extras_type_clean'].eq('penalty').fillna(False)
clean['is_missing_extras_anomaly'] = clean['extras_type'].isna() & (clean['extras1_runs'].fillna(0).ne(0) | clean['extras_2_runs'].fillna(0).ne(0))
clean['is_unresolved_other'] = clean['extras_type_clean'].eq('other').fillna(False)

conditions = [
    clean['is_penalty_event'].to_numpy(dtype=bool),
    clean['extras_type_clean'].isin(['wide', 'overstep']).to_numpy(dtype=bool),
    clean['extras_type_clean'].isin(['byes', 'legbyes']).to_numpy(dtype=bool),
    clean['is_unresolved_other'].to_numpy(dtype=bool),
    clean['is_missing_extras_anomaly'].to_numpy(dtype=bool)
]

clean['legal_ball_status'] = np.select(
    conditions,
    ['not_a_delivery', 'illegal', 'legal', 'unresolved', 'unresolved'],
    default='provisional_legal'
)

bowler_dismissals = ['Bowled', 'Caught', 'LBW', 'Stump', 'Hit Wicket']
clean['bowler_wicket'] = clean['is_wicket'].fillna(False).astype(bool) & clean['dismissal_type'].isin(bowler_dismissals)
clean['batter_four'] = clean['runs'].eq(4)
clean['batter_six'] = clean['runs'].eq(6)
clean['include_in_player_delivery_stats'] = ~clean['is_penalty_event']

# Innings reconstruction
innings_data = clean.merge(matches[['match_id', 'comp_id', 'match_date', 'venue_country']], on='match_id', how='left')
innings_data = innings_data.merge(competitions[['comp_id', 'comp_name', 'match_format', 'season']], on='comp_id', how='left')
team_lookup = teams[['comp_id', 'team_id', 'team_name']].drop_duplicates()
innings_data = innings_data.merge(team_lookup.rename(columns={'team_id': 'batting_team_id', 'team_name': 'batting_team'}), on=['comp_id', 'batting_team_id'], how='left')
innings_data['total_delivery_runs'] = innings_data['runs'].fillna(0) + innings_data['extras1_runs'].fillna(0) + innings_data['extras_2_runs'].fillna(0)

ipl_comp_ids = competitions.loc[competitions['comp_name'].str.contains(r'\bIPL\b', case=False, na=False), 'comp_id'].unique()
t20i_comp_ids = competitions.loc[competitions['match_format'].eq('T20I'), 'comp_id'].unique()

innings_data['analysis_format'] = np.where(innings_data['comp_id'].isin(ipl_comp_ids), 'IPL', np.where(innings_data['comp_id'].isin(t20i_comp_ids), 'T20I', 'Other'))

analysis = innings_data[innings_data['innings'].isin([1, 2]) & innings_data['comp_id'].isin(list(ipl_comp_ids) + list(t20i_comp_ids))].copy()
print(f"Analysis deliveries (IPL + T20I, innings 1&2): {len(analysis)}")
print(f"Analysis matches: {analysis['match_id'].nunique()}")

# Second-innings chase context
match_innings = (
    analysis.groupby(["match_id", "innings"], as_index=False)
    .agg(
        innings_runs=("total_delivery_runs", "sum"),
        innings_wickets=("is_wicket", "sum"),
        batting_team_id=("batting_team_id", "first"),
        competition=("analysis_format", "first"),
        comp_id=("comp_id", "first")
    )
)

first_innings = (
    match_innings[match_innings["innings"] == 1]
    [["match_id", "innings_runs", "batting_team_id"]]
    .rename(columns={
        "innings_runs": "first_innings_runs",
        "batting_team_id": "first_batting_team_id"
    })
)

second_innings = (
    match_innings[match_innings["innings"] == 2]
    [["match_id", "innings_runs", "batting_team_id"]]
    .rename(columns={
        "innings_runs": "second_innings_runs",
        "batting_team_id": "second_batting_team_id"
    })
)

chase_context = (
    matches[[
        "match_id", "revised_target", "first_inn_revised_overs",
        "second_inn_revised_overs", "win_team_id", "result"
    ]]
    .merge(first_innings, on="match_id", how="inner")
    .merge(second_innings, on="match_id", how="inner")
)

chase_context["target"] = np.where(
    chase_context["revised_target"].notna(),
    chase_context["revised_target"],
    chase_context["first_innings_runs"] + 1
)

chase_balls = analysis[analysis["innings"].eq(2)].copy()
context_cols = ["match_id", "target", "second_inn_revised_overs", "result"]
chase_balls = chase_balls.merge(chase_context[context_cols], on="match_id", how="left")
chase_balls = chase_balls[
    chase_balls["target"].notna()
    & chase_balls["result"].notna()
    & ~chase_balls["result"].str.contains("No Result|Abandoned|Cancelled", case=False, na=False)
].copy()

chase_balls["chase_ball_limit"] = chase_balls["second_inn_revised_overs"].fillna(120)
chase_balls = chase_balls.sort_values(["match_id", "innings_ball_num", "overid", "over_ball_num"]).copy()
chase_balls["legal_ball"] = (chase_balls["legal_ball_status"].isin(["legal", "provisional_legal"])).astype(int)

chase_balls["score_before"] = chase_balls.groupby("match_id")["total_delivery_runs"].cumsum() - chase_balls["total_delivery_runs"]
chase_balls["wickets_before"] = chase_balls.groupby("match_id")["is_wicket"].cumsum() - chase_balls["is_wicket"].astype(int)
chase_balls["legal_balls_used_before"] = chase_balls.groupby("match_id")["legal_ball"].cumsum() - chase_balls["legal_ball"]

chase_balls["runs_required_before"] = (chase_balls["target"] - chase_balls["score_before"]).clip(lower=0)
chase_balls["balls_remaining_before"] = (chase_balls["chase_ball_limit"] - chase_balls["legal_balls_used_before"]).clip(lower=0)
chase_balls["wickets_remaining_before"] = (10 - chase_balls["wickets_before"]).clip(lower=0)
chase_balls["required_run_rate_before"] = (
    6 * chase_balls["runs_required_before"] / chase_balls["balls_remaining_before"].replace(0, float("nan"))
)

pressure_audit = chase_balls[
    (chase_balls["balls_remaining_before"] > 0) & (chase_balls["runs_required_before"] > 0)
].copy()

print(f"Qualifying chase deliveries: {len(pressure_audit)}")

# Pressure classification v2
rrr = pressure_audit["required_run_rate_before"]
wkts = pressure_audit["wickets_remaining_before"]
balls_rem = pressure_audit["balls_remaining_before"]

high_v2 = (
    (rrr >= 12) |
    ((rrr >= 10) & (wkts <= 4)) |
    ((balls_rem <= 30) & (wkts <= 4))
)

medium_v2 = (
    (rrr >= 9) |
    (wkts <= 4) |
    (balls_rem <= 30)
)

pressure_audit["pressure_level_v2"] = np.select(
    [high_v2, medium_v2],
    ["High", "Medium"],
    default="Normal"
)

p2 = pressure_audit.copy()

print("\n--- PRESSURE DISTRIBUTION V2 ---")
print(p2["pressure_level_v2"].value_counts())
print(p2["pressure_level_v2"].value_counts(normalize=True) * 100)

print("\n--- PRESSURE BY FORMAT ---")
print(pd.crosstab(p2["analysis_format"], p2["pressure_level_v2"], margins=True))

# Check Batters
delivery_keys = ["match_id", "innings", "innings_ball_num"]
batting_data = p2[delivery_keys + ["pressure_level_v2"]].merge(
    analysis[[
        "match_id", "innings", "innings_ball_num",
        "striker_id", "striker_name", "runs",
        "is_wicket", "dismissed_player_id",
        "extras_type_clean", "legal_ball_status",
        "is_penalty_event", "include_in_player_delivery_stats",
        "analysis_format"
    ]],
    on=delivery_keys,
    how="inner"
)

batting_data = batting_data[batting_data["include_in_player_delivery_stats"] == True].copy()
batting_data["ball_faced"] = batting_data["extras_type_clean"].ne("wide").fillna(True) & ~batting_data["is_penalty_event"].fillna(False)
batting_data["batter_dismissed"] = batting_data["is_wicket"].fillna(False) & (batting_data["dismissed_player_id"] == batting_data["striker_id"]).fillna(False)

# IPL Batters pool
b = batting_data[(batting_data["analysis_format"] == "IPL")].copy()
b["high"] = b["pressure_level_v2"].eq("High")
b["normal"] = b["pressure_level_v2"].eq("Normal")

bat_pool = b.groupby(["striker_id", "striker_name"]).agg(
    high_balls=("ball_faced", lambda x: x[b.loc[x.index, "high"]].sum()),
    high_runs=("runs", lambda x: x[b.loc[x.index, "high"]].sum()),
    high_matches=("match_id", lambda x: b.loc[x.index[b.loc[x.index, "high"]], "match_id"].nunique()),
    normal_balls=("ball_faced", lambda x: x[b.loc[x.index, "normal"]].sum()),
    normal_runs=("runs", lambda x: x[b.loc[x.index, "normal"]].sum()),
    total_runs=("runs", "sum"),
    total_balls=("ball_faced", "sum"),
    total_matches=("match_id", "nunique")
).reset_index()

bat_pool = bat_pool[(bat_pool["high_balls"] >= 60) & (bat_pool["high_matches"] >= 8)].copy()
print(f"\nEligible IPL Batters: {len(bat_pool)}")

bat_pool["high_sr"] = 100 * bat_pool["high_runs"] / bat_pool["high_balls"]
bat_pool["normal_sr"] = 100 * bat_pool["normal_runs"] / bat_pool["normal_balls"].replace(0, np.nan)
bat_pool["pressure_lift"] = bat_pool["high_sr"] - bat_pool["normal_sr"]

for col in ["high_sr", "high_balls", "pressure_lift"]:
    bat_pool[col + "_pct"] = bat_pool[col].rank(pct=True) * 100

bat_pool["total_matches_pct"] = bat_pool["total_matches"].rank(pct=True) * 100
bat_pool["gap_score"] = (
    0.40 * bat_pool["high_sr_pct"]
    + 0.30 * bat_pool["high_balls_pct"]
    + 0.15 * bat_pool["pressure_lift_pct"].fillna(50)
    + 0.15 * bat_pool["total_matches_pct"]
)

# Reliability adjusted
bat_pool["baseline_reliability"] = bat_pool["normal_balls"].fillna(0) / (bat_pool["normal_balls"].fillna(0) + 100)
bat_pool["reliable_pressure_lift"] = bat_pool["pressure_lift"] * bat_pool["baseline_reliability"]
bat_pool["reliable_lift_pct"] = bat_pool["reliable_pressure_lift"].rank(pct=True) * 100
bat_pool["adjusted_gap_score"] = (
    0.40 * bat_pool["high_sr_pct"]
    + 0.30 * bat_pool["high_balls_pct"]
    + 0.15 * bat_pool["reliable_lift_pct"]
    + 0.15 * bat_pool["total_matches_pct"]
)

bat_pool["baseline_quality"] = np.select(
    [
        bat_pool["normal_balls"] >= 100,
        bat_pool["normal_balls"] >= 50
    ],
    ["Strong", "Moderate"],
    default="Limited"
)

top10_batters = bat_pool.sort_values("adjusted_gap_score", ascending=False).head(10)
print("\nTop 10 Batters (Adjusted Gap Score):")
print(top10_batters[["striker_name", "adjusted_gap_score", "high_sr", "high_balls", "high_matches", "baseline_quality"]].to_string())

# Bowlers
bowling_source = [
    "match_id", "innings", "innings_ball_num",
    "bowler_id", "bowler_name",
    "runs", "extras1_runs", "extras_2_runs",
    "extras_type_clean", "is_wicket",
    "dismissal_type", "bowler_wicket",
    "is_penalty_event",
    "include_in_player_delivery_stats",
    "analysis_format"
]

bowling_data = p2[delivery_keys + ["pressure_level_v2"]].merge(
    analysis[bowling_source],
    on=delivery_keys,
    how="inner"
)
bowling_data = bowling_data[bowling_data["include_in_player_delivery_stats"].fillna(False)].copy()
bowling_data["bowler_runs_conceded"] = bowling_data["runs"].fillna(0) + bowling_data["extras1_runs"].fillna(0) + bowling_data["extras_2_runs"].fillna(0)
bowling_data.loc[
    bowling_data["extras_type_clean"].isin(["byes", "legbyes"]),
    "bowler_runs_conceded"
] -= (
    bowling_data["extras1_runs"].fillna(0)
    + bowling_data["extras_2_runs"].fillna(0)
)[bowling_data["extras_type_clean"].isin(["byes", "legbyes"])]

bowling_data["legal_bowler_ball"] = (
    bowling_data["extras_type_clean"].isna()
    | bowling_data["extras_type_clean"].isin(["byes", "legbyes"])
)
bowling_data.loc[
    bowling_data["extras_type_clean"].isin(["other"])
    | (bowling_data["extras_type_clean"].isna() & (bowling_data["extras1_runs"].fillna(0).ne(0) | bowling_data["extras_2_runs"].fillna(0).ne(0))),
    "legal_bowler_ball"
] = False
bowling_data.loc[bowling_data["is_penalty_event"].fillna(False), "legal_bowler_ball"] = False

bowling_data["dot_ball"] = (
    bowling_data["runs"].fillna(0).eq(0)
    & bowling_data["bowler_runs_conceded"].eq(0)
    & bowling_data["legal_bowler_ball"]
)
bowling_data["boundary_conceded"] = bowling_data["runs"].fillna(0).isin([4, 6])
bowling_data["bowler_wicket_clean"] = bowling_data["bowler_wicket"].fillna(False)

w = bowling_data[bowling_data["analysis_format"] == "IPL"].copy()
w["high"] = w["pressure_level_v2"].eq("High")

bowl_pool = w.groupby(["bowler_id", "bowler_name"]).agg(
    high_balls=("legal_bowler_ball", lambda x: x[w.loc[x.index, "high"]].sum()),
    high_runs=("bowler_runs_conceded", lambda x: x[w.loc[x.index, "high"]].sum()),
    high_wickets=("bowler_wicket_clean", lambda x: x[w.loc[x.index, "high"]].sum()),
    high_matches=("match_id", lambda x: w.loc[x.index[w.loc[x.index, "high"]], "match_id"].nunique()),
    high_dots=("dot_ball", lambda x: x[w.loc[x.index, "high"]].sum()),
    high_boundaries=("boundary_conceded", lambda x: x[w.loc[x.index, "high"]].sum()),
    total_matches=("match_id", "nunique")
).reset_index()

bowl_pool = bowl_pool[(bowl_pool["high_balls"] >= 60) & (bowl_pool["high_matches"] >= 8)].copy()
print(f"\nEligible IPL Bowlers: {len(bowl_pool)}")

bowl_pool["high_economy"] = 6 * bowl_pool["high_runs"] / bowl_pool["high_balls"]
bowl_pool["wickets_per_over"] = 6 * bowl_pool["high_wickets"] / bowl_pool["high_balls"]
bowl_pool["dot_pct"] = 100 * bowl_pool["high_dots"] / bowl_pool["high_balls"]
bowl_pool["boundary_pct"] = 100 * bowl_pool["high_boundaries"] / bowl_pool["high_balls"]

bowl_pool["economy_pct"] = bowl_pool["high_economy"].rank(pct=True, ascending=False) * 100
bowl_pool["wicket_pct"] = bowl_pool["wickets_per_over"].rank(pct=True) * 100
bowl_pool["dot_pct_score"] = bowl_pool["dot_pct"].rank(pct=True) * 100
bowl_pool["boundary_pct_score"] = bowl_pool["boundary_pct"].rank(pct=True, ascending=False) * 100

bowl_pool["gap_score"] = (
    0.30 * bowl_pool["economy_pct"]
    + 0.30 * bowl_pool["wicket_pct"]
    + 0.20 * bowl_pool["dot_pct_score"]
    + 0.10 * bowl_pool["boundary_pct_score"]
    + 0.10 * bowl_pool["high_balls"].rank(pct=True) * 100
)

top10_bowlers = bowl_pool.sort_values("gap_score", ascending=False).head(10)
print("\nTop 10 Bowlers (Gap Score):")
print(top10_bowlers[["bowler_name", "gap_score", "high_economy", "high_wickets", "high_balls", "high_matches"]].to_string())
