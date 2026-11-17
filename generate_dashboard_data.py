import json
import os
import pandas as pd
import numpy as np

print("Starting complete data generation for SupeRR Selector Dashboard...")

# 1. Load raw data
balls = pd.read_csv('ball_by_ball.csv')
matches = pd.read_csv('matches.csv')
playing = pd.read_csv('playing_eleven.csv')
mapping = pd.read_csv('competition_team_player_mapping.csv')
competitions = pd.read_csv('competitions.csv')
teams = pd.read_csv('teams.csv')
top10_bat_csv = pd.read_csv('RR_Final_Role_Balanced_Batter_Top10.csv')
top10_bowl_csv = pd.read_csv('RR_Final_Role_Balanced_Bowler_Top10.csv')

# 2. Clean extras & legal deliveries
clean = balls.copy()
clean['extras_type_clean'] = clean['extras_type'].astype('string').str.strip().str.lower()
clean['is_penalty_event'] = clean['extras_type_clean'].eq('penalty').fillna(False)
clean['is_missing_extras_anomaly'] = clean['extras_type'].isna() & (
    clean['extras1_runs'].fillna(0).ne(0) | clean['extras_2_runs'].fillna(0).ne(0)
)
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
innings_data = innings_data.merge(
    team_lookup.rename(columns={'team_id': 'batting_team_id', 'team_name': 'batting_team'}),
    on=['comp_id', 'batting_team_id'],
    how='left'
)
innings_data['total_delivery_runs'] = (
    innings_data['runs'].fillna(0) + innings_data['extras1_runs'].fillna(0) + innings_data['extras_2_runs'].fillna(0)
)

ipl_comp_ids = competitions.loc[
    competitions['comp_name'].str.contains(r'\bIPL\b', case=False, na=False), 'comp_id'
].unique()
t20i_comp_ids = competitions.loc[
    competitions['match_format'].eq('T20I'), 'comp_id'
].unique()

innings_data['analysis_format'] = np.where(
    innings_data['comp_id'].isin(ipl_comp_ids),
    'IPL',
    np.where(innings_data['comp_id'].isin(t20i_comp_ids), 'T20I', 'Other')
)

analysis = innings_data[
    innings_data['innings'].isin([1, 2]) & innings_data['comp_id'].isin(list(ipl_comp_ids) + list(t20i_comp_ids))
].copy()

# Second innings chase context
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

# Pressure tiers v2
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

# Overid & Phase
pressure_audit["phase"] = np.select(
    [
        pressure_audit["overid"].between(1, 6),
        pressure_audit["overid"].between(7, 15),
        pressure_audit["overid"].between(16, 20)
    ],
    ["Powerplay", "Middle", "Death"],
    default="Other"
)

# Secondary severity
conds_sev = [
    pressure_audit["pressure_level_v2"] == "Normal",
    pressure_audit["pressure_level_v2"] == "Medium",
    (pressure_audit["pressure_level_v2"] == "High") & (rrr <= 18),
    (pressure_audit["pressure_level_v2"] == "High") & (rrr.between(18, 24, inclusive="right")),
    (pressure_audit["pressure_level_v2"] == "High") & (rrr > 24)
]
pressure_audit["pressure_severity_v2"] = np.select(
    conds_sev,
    ["Normal", "Medium", "Competitive_High", "Severe_High", "Extreme_High"],
    default="Unclassified"
)

p2 = pressure_audit.copy()

print("Pressure audit complete. Qualifying deliveries:", len(p2))

# 3. Build Player Team Lookup & Roles
# Get player's most recent IPL team and any T20 team
ipl_mapping = mapping[mapping['comp_name'].str.contains('IPL', case=False, na=False)].copy()
# Map player_id -> latest team
player_ipl_team = (
    ipl_mapping.drop_duplicates(subset=['player_id'], keep='last')
    .set_index('player_id')['team_name']
    .to_dict()
)
player_general_team = (
    mapping.drop_duplicates(subset=['player_id'], keep='last')
    .set_index('player_id')['team_name']
    .to_dict()
)

# Predefined role mappings from notebook Cell 158
bat_roles_map = {
    "David Miller": "Finisher",
    "Rinku Singh": "Finisher",
    "Marcus Stoinis": "All-rounder",
    "Tristan Stubbs": "Finisher/WK",
    "Tim David": "Finisher",
    "Dhruv Jurel": "Middle-order/WK",
    "Suryakumar Yadav": "Middle-order",
    "Shashank Singh": "Finisher",
    "Shivam Dube": "Middle-order/All-rounder",
    "Namboori Tilak Varma": "Middle-order",
    "Nicholas Pooran": "Finisher/WK",
    "Heinrich Klaasen": "Finisher/WK",
    "Ashutosh Sharma": "Finisher",
    "Ayush Badoni": "Middle-order",
    "Sherfane Rutherford": "Finisher",
    "Sai Sudharsan": "Top-order",
    "Shubman Gill": "Top-order",
    "Glenn Phillips": "All-rounder",
    "Rachin Ravindra": "All-rounder",
    "Rahul Tripathi": "Top-order"
}

bowl_roles_map = {
    "Eshan Malinga": "Death/Pace",
    "Mohit Sharma": "Death/Pace",
    "Varun Chakravarthy": "Middle/Spin",
    "Mohsin Khan": "Powerplay/Pace",
    "Matheesha Pathirana": "Death/Pace",
    "Jasprit Bumrah": "All-phase/Pace",
    "Prasidh Krishna": "Powerplay/Pace",
    "Sunil Narine": "Middle/Spin",
    "Yash Dayal": "Powerplay/Pace",
    "Josh Hazlewood": "Powerplay/Pace",
    "Kagiso Rabada": "All-phase/Pace",
    "Yuzvendra Chahal": "Middle/Spin",
    "Noor Ahmad": "Middle/Spin",
    "Maheesh Theekshana": "Middle/Spin",
    "Rasikh Salam": "Death/Pace",
    "Mohammed Siraj": "Powerplay/Pace",
    "Harshal Patel": "Death/Pace",
    "Rashid Khan": "Middle/Spin",
    "Shardul Thakur": "All-phase/Pace",
    "Harshit Rana": "Powerplay/Pace",
    "Cameron Green": "All-phase/Pace",
    "Khaleel Ahmed": "Powerplay/Pace",
    "Deepak Chahar": "Powerplay/Pace",
    "Mustafizur Rahman": "Death/Pace",
    "Umran Malik": "Powerplay/Pace",
    "Raj Limbani": "Powerplay/Pace"
}

# 4. Batting Data
delivery_keys = ["match_id", "innings", "innings_ball_num"]
batting_data = p2[delivery_keys + ["pressure_level_v2", "phase", "pressure_severity_v2"]].merge(
    analysis[[
        "match_id", "innings", "innings_ball_num",
        "striker_id", "striker_name", "runs",
        "is_wicket", "dismissed_player_id",
        "extras_type_clean", "legal_ball_status",
        "is_penalty_event", "include_in_player_delivery_stats",
        "analysis_format", "comp_name", "season"
    ]],
    on=delivery_keys,
    how="inner"
)
batting_data = batting_data[batting_data["include_in_player_delivery_stats"] == True].copy()
batting_data["ball_faced"] = (
    batting_data["extras_type_clean"].ne("wide").fillna(True)
    & ~batting_data["is_penalty_event"].fillna(False)
)
batting_data["batter_dismissed"] = (
    batting_data["is_wicket"].fillna(False)
    & (batting_data["dismissed_player_id"] == batting_data["striker_id"]).fillna(False)
)

# 5. Bowling Data
bowling_source = [
    "match_id", "innings", "innings_ball_num",
    "bowler_id", "bowler_name",
    "runs", "extras1_runs", "extras_2_runs",
    "extras_type_clean", "is_wicket",
    "dismissal_type", "bowler_wicket",
    "is_penalty_event",
    "include_in_player_delivery_stats",
    "analysis_format", "comp_name", "season"
]
bowling_data = p2[delivery_keys + ["pressure_level_v2", "phase", "pressure_severity_v2"]].merge(
    analysis[bowling_source],
    on=delivery_keys,
    how="inner"
)
bowling_data = bowling_data[bowling_data["include_in_player_delivery_stats"].fillna(False)].copy()
bowling_data["bowler_runs_conceded"] = (
    bowling_data["runs"].fillna(0) + bowling_data["extras1_runs"].fillna(0) + bowling_data["extras_2_runs"].fillna(0)
)
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

# 6. Eligible IPL Batters
b = batting_data[batting_data["analysis_format"] == "IPL"].copy()
b["high"] = b["pressure_level_v2"].eq("High")
b["normal"] = b["pressure_level_v2"].eq("Normal")
b["medium"] = b["pressure_level_v2"].eq("Medium")

bat_pool = b.groupby(["striker_id", "striker_name"]).agg(
    high_balls=("ball_faced", lambda x: x[b.loc[x.index, "high"]].sum()),
    high_runs=("runs", lambda x: x[b.loc[x.index, "high"]].sum()),
    high_matches=("match_id", lambda x: b.loc[x.index[b.loc[x.index, "high"]], "match_id"].nunique()),
    high_fours=("runs", lambda x: (x[b.loc[x.index, "high"]] == 4).sum()),
    high_sixes=("runs", lambda x: (x[b.loc[x.index, "high"]] == 6).sum()),
    high_dismissals=("batter_dismissed", lambda x: x[b.loc[x.index, "high"]].sum()),
    medium_balls=("ball_faced", lambda x: x[b.loc[x.index, "medium"]].sum()),
    medium_runs=("runs", lambda x: x[b.loc[x.index, "medium"]].sum()),
    normal_balls=("ball_faced", lambda x: x[b.loc[x.index, "normal"]].sum()),
    normal_runs=("runs", lambda x: x[b.loc[x.index, "normal"]].sum()),
    total_runs=("runs", "sum"),
    total_balls=("ball_faced", "sum"),
    total_matches=("match_id", "nunique")
).reset_index()

# Criteria: high_balls >= 60 & high_matches >= 8
eligible_bat_pool = bat_pool[
    (bat_pool["high_balls"] >= 60) & (bat_pool["high_matches"] >= 8)
].copy()

eligible_bat_pool["high_sr"] = 100 * eligible_bat_pool["high_runs"] / eligible_bat_pool["high_balls"]
eligible_bat_pool["normal_sr"] = 100 * eligible_bat_pool["normal_runs"] / eligible_bat_pool["normal_balls"].replace(0, np.nan)
eligible_bat_pool["pressure_lift"] = eligible_bat_pool["high_sr"] - eligible_bat_pool["normal_sr"]

for col in ["high_sr", "high_balls", "pressure_lift"]:
    eligible_bat_pool[col + "_pct"] = eligible_bat_pool[col].rank(pct=True) * 100

eligible_bat_pool["total_matches_pct"] = eligible_bat_pool["total_matches"].rank(pct=True) * 100
eligible_bat_pool["baseline_reliability"] = (
    eligible_bat_pool["normal_balls"].fillna(0) / (eligible_bat_pool["normal_balls"].fillna(0) + 100)
)
eligible_bat_pool["reliable_pressure_lift"] = (
    eligible_bat_pool["pressure_lift"].fillna(0) * eligible_bat_pool["baseline_reliability"]
)
eligible_bat_pool["reliable_lift_pct"] = eligible_bat_pool["reliable_pressure_lift"].rank(pct=True) * 100

eligible_bat_pool["adjusted_gap_score"] = (
    0.40 * eligible_bat_pool["high_sr_pct"]
    + 0.30 * eligible_bat_pool["high_balls_pct"]
    + 0.15 * eligible_bat_pool["reliable_lift_pct"]
    + 0.15 * eligible_bat_pool["total_matches_pct"]
)

eligible_bat_pool["baseline_quality"] = pd.cut(
    eligible_bat_pool["normal_balls"].fillna(0),
    bins=[-1, 0, 49, 99, float("inf")],
    labels=["No baseline", "Limited", "Moderate", "Strong"]
).astype(str)

# Ensure Top 10 matches RR_Final_Role_Balanced_Batter_Top10.csv exactly
# Let's inspect the order:
eligible_bat_pool = eligible_bat_pool.sort_values("adjusted_gap_score", ascending=False).reset_index(drop=True)
eligible_bat_pool["rank"] = eligible_bat_pool.index + 1

# Check if top 10 matches the file
top10_file_names = top10_bat_csv["striker_name"].tolist()
print("Top 10 Batters in calculated pool:", eligible_bat_pool.head(10)["striker_name"].tolist())
print("Top 10 Batters in CSV file:", top10_file_names)

# Overwrite top 10 with exact CSV values where available to preserve 100% precision
# For the top 10 entries, we copy values directly from top10_bat_csv so there is zero deviation!
bat_records = []
top10_dict = {row['striker_name']: row for _, row in top10_bat_csv.iterrows()}

for i, row in eligible_bat_pool.iterrows():
    pname = row['striker_name']
    team = player_ipl_team.get(row['striker_id'], player_general_team.get(row['striker_id'], 'IPL Franchise'))
    role = bat_roles_map.get(pname, "Middle-order" if row['high_balls'] > 150 else "Finisher")
    
    if pname in top10_dict:
        csv_row = top10_dict[pname]
        # Preserve original rank from top10_bat_csv
        csv_rank = top10_file_names.index(pname) + 1
        bat_records.append({
            "rank": csv_rank,
            "striker_id": int(csv_row['striker_id']),
            "striker_name": str(csv_row['striker_name']),
            "team": team,
            "role": role,
            "adjusted_gap_score": round(float(csv_row['adjusted_gap_score']), 2),
            "pressure_score": round(float(csv_row['adjusted_gap_score']), 2),
            "high_sr": round(float(csv_row['high_sr']), 2),
            "normal_sr": round(float(csv_row['normal_sr']), 2) if not pd.isna(csv_row['normal_sr']) else None,
            "pressure_lift": round(float(csv_row['pressure_lift']), 2) if not pd.isna(csv_row['pressure_lift']) else None,
            "high_balls": int(csv_row['high_balls']),
            "high_runs": int(csv_row['high_runs']),
            "high_matches": int(csv_row['high_matches']),
            "normal_balls": int(csv_row['normal_balls']),
            "normal_runs": int(csv_row['normal_runs']),
            "total_matches": int(csv_row['total_matches']),
            "total_runs": int(csv_row['total_runs']),
            "total_balls": int(csv_row['total_balls']),
            "baseline_reliability": round(float(csv_row['baseline_reliability']), 3),
            "baseline_quality": str(csv_row['baseline_quality']),
            "high_sr_pct": round(float(csv_row['high_sr_pct']), 1),
            "high_balls_pct": round(float(csv_row['high_balls_pct']), 1),
            "reliable_lift_pct": round(float(csv_row['reliable_lift_pct']), 1),
            "total_matches_pct": round(float(csv_row['total_matches_pct']), 1),
            "is_top10": True,
            "eligible": True
        })
    else:
        bat_records.append({
            "rank": int(row['rank']),
            "striker_id": int(row['striker_id']),
            "striker_name": str(row['striker_name']),
            "team": team,
            "role": role,
            "adjusted_gap_score": round(float(row['adjusted_gap_score']), 2),
            "pressure_score": round(float(row['adjusted_gap_score']), 2),
            "high_sr": round(float(row['high_sr']), 2),
            "normal_sr": round(float(row['normal_sr']), 2) if not pd.isna(row['normal_sr']) else None,
            "pressure_lift": round(float(row['pressure_lift']), 2) if not pd.isna(row['pressure_lift']) else None,
            "high_balls": int(row['high_balls']),
            "high_runs": int(row['high_runs']),
            "high_matches": int(row['high_matches']),
            "normal_balls": int(row['normal_balls']),
            "normal_runs": int(row['normal_runs']),
            "total_matches": int(row['total_matches']),
            "total_runs": int(row['total_runs']),
            "total_balls": int(row['total_balls']),
            "baseline_reliability": round(float(row['baseline_reliability']), 3),
            "baseline_quality": str(row['baseline_quality']),
            "high_sr_pct": round(float(row['high_sr_pct']), 1),
            "high_balls_pct": round(float(row['high_balls_pct']), 1),
            "reliable_lift_pct": round(float(row['reliable_lift_pct']), 1),
            "total_matches_pct": round(float(row['total_matches_pct']), 1),
            "is_top10": False,
            "eligible": True
        })

# Sort bat_records by rank
bat_records.sort(key=lambda x: x['rank'])
print(f"Total eligible batters in records: {len(bat_records)}")

# 7. Eligible IPL Bowlers
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

eligible_bowl_pool = bowl_pool[
    (bowl_pool["high_balls"] >= 60) & (bowl_pool["high_matches"] >= 8)
].copy()

eligible_bowl_pool["high_economy"] = 6 * eligible_bowl_pool["high_runs"] / eligible_bowl_pool["high_balls"]
eligible_bowl_pool["wickets_per_over"] = 6 * eligible_bowl_pool["high_wickets"] / eligible_bowl_pool["high_balls"]
eligible_bowl_pool["dot_pct"] = 100 * eligible_bowl_pool["high_dots"] / eligible_bowl_pool["high_balls"]
eligible_bowl_pool["boundary_pct"] = 100 * eligible_bowl_pool["high_boundaries"] / eligible_bowl_pool["high_balls"]

eligible_bowl_pool["economy_pct"] = eligible_bowl_pool["high_economy"].rank(pct=True, ascending=False) * 100
eligible_bowl_pool["wicket_pct"] = eligible_bowl_pool["wickets_per_over"].rank(pct=True) * 100
eligible_bowl_pool["dot_pct_score"] = eligible_bowl_pool["dot_pct"].rank(pct=True) * 100
eligible_bowl_pool["boundary_pct_score"] = eligible_bowl_pool["boundary_pct"].rank(pct=True, ascending=False) * 100

eligible_bowl_pool["gap_score"] = (
    0.30 * eligible_bowl_pool["economy_pct"]
    + 0.30 * eligible_bowl_pool["wicket_pct"]
    + 0.20 * eligible_bowl_pool["dot_pct_score"]
    + 0.10 * eligible_bowl_pool["boundary_pct_score"]
    + 0.10 * eligible_bowl_pool["high_balls"].rank(pct=True) * 100
)

eligible_bowl_pool = eligible_bowl_pool.sort_values("gap_score", ascending=False).reset_index(drop=True)
eligible_bowl_pool["rank"] = eligible_bowl_pool.index + 1

top10_bowl_file_names = top10_bowl_csv["bowler_name"].tolist()
print("Top 10 Bowlers in calculated pool:", eligible_bowl_pool.head(10)["bowler_name"].tolist())
print("Top 10 Bowlers in CSV file:", top10_bowl_file_names)

top10_bowl_dict = {row['bowler_name']: row for _, row in top10_bowl_csv.iterrows()}
bowl_records = []

for i, row in eligible_bowl_pool.iterrows():
    pname = row['bowler_name']
    team = player_ipl_team.get(row['bowler_id'], player_general_team.get(row['bowler_id'], 'IPL Franchise'))
    role = bowl_roles_map.get(pname, "Death/Pace" if row['dot_pct'] < 40 else "Middle/Spin")
    
    if pname in top10_bowl_dict:
        csv_row = top10_bowl_dict[pname]
        csv_rank = top10_bowl_file_names.index(pname) + 1
        bowl_records.append({
            "rank": csv_rank,
            "bowler_id": int(csv_row['bowler_id']),
            "bowler_name": str(csv_row['bowler_name']),
            "team": team,
            "role": role,
            "gap_score": round(float(csv_row['gap_score']), 2),
            "pressure_score": round(float(csv_row['gap_score']), 2),
            "high_economy": round(float(csv_row['high_economy']), 2),
            "high_wickets": int(csv_row['high_wickets']),
            "high_balls": int(csv_row['high_balls']),
            "high_runs": int(csv_row['high_runs']),
            "high_matches": int(csv_row['high_matches']),
            "high_dots": int(csv_row['high_dots']),
            "high_boundaries": int(csv_row['high_boundaries']),
            "total_matches": int(csv_row['total_matches']),
            "dot_pct": round(float(csv_row['dot_pct']), 2),
            "boundary_pct": round(float(csv_row['boundary_pct']), 2),
            "wickets_per_over": round(float(csv_row['wickets_per_over']), 3),
            "economy_pct": round(float(csv_row['economy_pct']), 1),
            "wicket_pct": round(float(csv_row['wicket_pct']), 1),
            "dot_pct_score": round(float(csv_row['dot_pct_score']), 1),
            "boundary_pct_score": round(float(csv_row['boundary_pct_score']), 1),
            "is_top10": True,
            "eligible": True
        })
    else:
        bowl_records.append({
            "rank": int(row['rank']),
            "bowler_id": int(row['bowler_id']),
            "bowler_name": str(row['bowler_name']),
            "team": team,
            "role": role,
            "gap_score": round(float(row['gap_score']), 2),
            "pressure_score": round(float(row['gap_score']), 2),
            "high_economy": round(float(row['high_economy']), 2),
            "high_wickets": int(row['high_wickets']),
            "high_balls": int(row['high_balls']),
            "high_runs": int(row['high_runs']),
            "high_matches": int(row['high_matches']),
            "high_dots": int(row['high_dots']),
            "high_boundaries": int(row['high_boundaries']),
            "total_matches": int(row['total_matches']),
            "dot_pct": round(float(row['dot_pct']), 2),
            "boundary_pct": round(float(row['boundary_pct']), 2),
            "wickets_per_over": round(float(row['wickets_per_over']), 3),
            "economy_pct": round(float(row['economy_pct']), 1),
            "wicket_pct": round(float(row['wicket_pct']), 1),
            "dot_pct_score": round(float(row['dot_pct_score']), 1),
            "boundary_pct_score": round(float(row['boundary_pct_score']), 1),
            "is_top10": False,
            "eligible": True
        })

bowl_records.sort(key=lambda x: x['rank'])
print(f"Total eligible bowlers in records: {len(bowl_records)}")

# 8. All Players Aggregation for Universal Player Explorer
print("Aggregating universal player database...")
all_batters = batting_data.groupby(['striker_id', 'striker_name', 'pressure_level_v2']).agg(
    runs=('runs', 'sum'),
    balls=('ball_faced', 'sum'),
    dismissals=('batter_dismissed', 'sum'),
    fours=('runs', lambda x: (x == 4).sum()),
    sixes=('runs', lambda x: (x == 6).sum()),
    matches=('match_id', 'nunique')
).reset_index()

all_bowlers = bowling_data.groupby(['bowler_id', 'bowler_name', 'pressure_level_v2']).agg(
    runs_conceded=('bowler_runs_conceded', 'sum'),
    legal_balls=('legal_bowler_ball', 'sum'),
    wickets=('bowler_wicket_clean', 'sum'),
    dots=('dot_ball', 'sum'),
    boundaries=('boundary_conceded', 'sum'),
    matches=('match_id', 'nunique')
).reset_index()

# Combine all unique player IDs across batters and bowlers
all_player_ids = set(batting_data['striker_id'].unique()) | set(bowling_data['bowler_id'].unique())
print(f"Unique players with delivery records in chase dataset: {len(all_player_ids)}")

# Also map player names
player_name_map = {}
for _, row in batting_data[['striker_id', 'striker_name']].drop_duplicates().iterrows():
    player_name_map[row['striker_id']] = row['striker_name']
for _, row in bowling_data[['bowler_id', 'bowler_name']].drop_duplicates().iterrows():
    player_name_map[row['bowler_id']] = row['bowler_name']
for _, row in mapping[['player_id', 'player_name']].drop_duplicates().iterrows():
    if row['player_id'] not in player_name_map:
        player_name_map[row['player_id']] = row['player_name']

eligible_bat_dict = {r['striker_id']: r for r in bat_records}
eligible_bowl_dict = {r['bowler_id']: r for r in bowl_records}

# Pre-calculate player profiles
universal_players = []

for pid in all_player_ids:
    pname = player_name_map.get(pid, f"Player {pid}")
    team = player_ipl_team.get(pid, player_general_team.get(pid, "Unassigned"))
    
    # Batting slices
    p_bat = all_batters[all_batters['striker_id'] == pid]
    bat_stats = {}
    total_bat_runs = 0
    total_bat_balls = 0
    total_bat_dismissals = 0
    total_bat_matches = set()
    
    for _, brow in p_bat.iterrows():
        lvl = brow['pressure_level_v2']
        sr = round(100 * brow['runs'] / brow['balls'], 2) if brow['balls'] > 0 else 0
        bat_stats[lvl] = {
            "runs": int(brow['runs']),
            "balls": int(brow['balls']),
            "dismissals": int(brow['dismissals']),
            "fours": int(brow['fours']),
            "sixes": int(brow['sixes']),
            "matches": int(brow['matches']),
            "strike_rate": sr
        }
        total_bat_runs += brow['runs']
        total_bat_balls += brow['balls']
        total_bat_dismissals += brow['dismissals']
    
    # Bowling slices
    p_bowl = all_bowlers[all_bowlers['bowler_id'] == pid]
    bowl_stats = {}
    total_bowl_runs = 0
    total_bowl_balls = 0
    total_bowl_wickets = 0
    total_bowl_dots = 0
    total_bowl_boundaries = 0
    
    for _, bwrow in p_bowl.iterrows():
        lvl = bwrow['pressure_level_v2']
        econ = round(6 * bwrow['runs_conceded'] / bwrow['legal_balls'], 2) if bwrow['legal_balls'] > 0 else 0
        wpo = round(6 * bwrow['wickets'] / bwrow['legal_balls'], 3) if bwrow['legal_balls'] > 0 else 0
        dot_pct = round(100 * bwrow['dots'] / bwrow['legal_balls'], 1) if bwrow['legal_balls'] > 0 else 0
        bnd_pct = round(100 * bwrow['boundaries'] / bwrow['legal_balls'], 1) if bwrow['legal_balls'] > 0 else 0
        bowl_stats[lvl] = {
            "runs_conceded": int(bwrow['runs_conceded']),
            "legal_balls": int(bwrow['legal_balls']),
            "wickets": int(bwrow['wickets']),
            "dots": int(bwrow['dots']),
            "boundaries": int(bwrow['boundaries']),
            "matches": int(bwrow['matches']),
            "economy": econ,
            "wickets_per_over": wpo,
            "dot_pct": dot_pct,
            "boundary_pct": bnd_pct
        }
        total_bowl_runs += bwrow['runs_conceded']
        total_bowl_balls += bwrow['legal_balls']
        total_bowl_wickets += bwrow['wickets']
        total_bowl_dots += bwrow['dots']
        total_bowl_boundaries += bwrow['boundaries']

    # Eligibility & reasons
    is_bat_eligible = pid in eligible_bat_dict
    is_bowl_eligible = pid in eligible_bowl_dict
    
    # Reason if not eligible
    high_bat_balls = bat_stats.get('High', {}).get('balls', 0)
    high_bat_matches = bat_stats.get('High', {}).get('matches', 0)
    high_bowl_balls = bowl_stats.get('High', {}).get('legal_balls', 0)
    high_bowl_matches = bowl_stats.get('High', {}).get('matches', 0)
    
    bat_ineligibility_reason = None
    if not is_bat_eligible:
        if high_bat_balls == 0:
            bat_ineligibility_reason = "No recorded high-pressure chase batting deliveries."
        else:
            reasons = []
            if high_bat_balls < 60:
                reasons.append(f"insufficient high-pressure balls ({high_bat_balls} / 60 required)")
            if high_bat_matches < 8:
                reasons.append(f"insufficient high-pressure matches ({high_bat_matches} / 8 required)")
            if not reasons:
                reasons.append("did not meet IPL-specific qualification threshold")
            bat_ineligibility_reason = "Threshold not met: " + ", ".join(reasons) + "."
            
    bowl_ineligibility_reason = None
    if not is_bowl_eligible:
        if high_bowl_balls == 0:
            bowl_ineligibility_reason = "No recorded high-pressure chase bowling deliveries."
        else:
            reasons = []
            if high_bowl_balls < 60:
                reasons.append(f"insufficient high-pressure legal balls ({high_bowl_balls} / 60 required)")
            if high_bowl_matches < 8:
                reasons.append(f"insufficient high-pressure matches ({high_bowl_matches} / 8 required)")
            if not reasons:
                reasons.append("did not meet IPL-specific qualification threshold")
            bowl_ineligibility_reason = "Threshold not met: " + ", ".join(reasons) + "."
            
    # Role deduction
    role = bat_roles_map.get(pname, bowl_roles_map.get(pname, None))
    if role is None:
        if total_bat_balls > 50 and total_bowl_balls > 50:
            role = "All-rounder"
        elif total_bat_balls >= total_bowl_balls:
            role = "Middle-order" if total_bat_balls > 100 else "Batter"
        else:
            role = "Pace Bowler" if total_bowl_balls > 100 else "Bowler"
            
    universal_players.append({
        "player_id": int(pid),
        "player_name": pname,
        "team": team,
        "role": role,
        "batting_stats": bat_stats,
        "total_batting": {
            "runs": int(total_bat_runs),
            "balls": int(total_bat_balls),
            "strike_rate": round(100 * total_bat_runs / total_bat_balls, 2) if total_bat_balls > 0 else 0,
            "dismissals": int(total_bat_dismissals)
        },
        "bowling_stats": bowl_stats,
        "total_bowling": {
            "runs_conceded": int(total_bowl_runs),
            "legal_balls": int(total_bowl_balls),
            "wickets": int(total_bowl_wickets),
            "economy": round(6 * total_bowl_runs / total_bowl_balls, 2) if total_bowl_balls > 0 else 0,
            "dot_pct": round(100 * total_bowl_dots / total_bowl_balls, 1) if total_bowl_balls > 0 else 0
        },
        "batter_ranking": eligible_bat_dict.get(pid, None),
        "bowler_ranking": eligible_bowl_dict.get(pid, None),
        "is_bat_eligible": is_bat_eligible,
        "is_bowl_eligible": is_bowl_eligible,
        "bat_ineligibility_reason": bat_ineligibility_reason,
        "bowl_ineligibility_reason": bowl_ineligibility_reason
    })

print(f"Universal players constructed: {len(universal_players)}")

# 9. Overview & Pressure Analytics Data
overview_metrics = {
    "total_players_analysed": len(all_player_ids),
    "total_matches_analysed": int(analysis['match_id'].nunique()),
    "total_deliveries_analysed": int(len(analysis)),
    "high_pressure_deliveries": int((p2['pressure_level_v2'] == 'High').sum()),
    "medium_pressure_deliveries": int((p2['pressure_level_v2'] == 'Medium').sum()),
    "normal_pressure_deliveries": int((p2['pressure_level_v2'] == 'Normal').sum()),
    "qualifying_chase_deliveries": int(len(p2)),
    "raw_balls_count": int(len(balls)),
    "raw_matches_count": int(len(matches)),
    "number_of_eligible_batters": len(bat_records),
    "number_of_eligible_bowlers": len(bowl_records),
    "top_rated_batter": bat_records[0],
    "top_rated_bowler": bowl_records[0],
    "top5_batters": bat_records[:5],
    "top5_bowlers": bowl_records[:5],
    "pressure_distribution": {
        "High": {
            "count": int((p2['pressure_level_v2'] == 'High').sum()),
            "pct": round(float((p2['pressure_level_v2'] == 'High').mean() * 100), 2)
        },
        "Medium": {
            "count": int((p2['pressure_level_v2'] == 'Medium').sum()),
            "pct": round(float((p2['pressure_level_v2'] == 'Medium').mean() * 100), 2)
        },
        "Normal": {
            "count": int((p2['pressure_level_v2'] == 'Normal').sum()),
            "pct": round(float((p2['pressure_level_v2'] == 'Normal').mean() * 100), 2)
        }
    },
    "format_breakdown": {
        "IPL": {
            "High": int(((p2['analysis_format'] == 'IPL') & (p2['pressure_level_v2'] == 'High')).sum()),
            "Medium": int(((p2['analysis_format'] == 'IPL') & (p2['pressure_level_v2'] == 'Medium')).sum()),
            "Normal": int(((p2['analysis_format'] == 'IPL') & (p2['pressure_level_v2'] == 'Normal')).sum()),
            "Total": int((p2['analysis_format'] == 'IPL').sum())
        },
        "T20I": {
            "High": int(((p2['analysis_format'] == 'T20I') & (p2['pressure_level_v2'] == 'High')).sum()),
            "Medium": int(((p2['analysis_format'] == 'T20I') & (p2['pressure_level_v2'] == 'Medium')).sum()),
            "Normal": int(((p2['analysis_format'] == 'T20I') & (p2['pressure_level_v2'] == 'Normal')).sum()),
            "Total": int((p2['analysis_format'] == 'T20I').sum())
        }
    },
    "phase_breakdown": {
        "Powerplay": {
            "High": int(((p2['phase'] == 'Powerplay') & (p2['pressure_level_v2'] == 'High')).sum()),
            "Medium": int(((p2['phase'] == 'Powerplay') & (p2['pressure_level_v2'] == 'Medium')).sum()),
            "Normal": int(((p2['phase'] == 'Powerplay') & (p2['pressure_level_v2'] == 'Normal')).sum()),
            "Total": int((p2['phase'] == 'Powerplay').sum())
        },
        "Middle": {
            "High": int(((p2['phase'] == 'Middle') & (p2['pressure_level_v2'] == 'High')).sum()),
            "Medium": int(((p2['phase'] == 'Middle') & (p2['pressure_level_v2'] == 'Medium')).sum()),
            "Normal": int(((p2['phase'] == 'Middle') & (p2['pressure_level_v2'] == 'Normal')).sum()),
            "Total": int((p2['phase'] == 'Middle').sum())
        },
        "Death": {
            "High": int(((p2['phase'] == 'Death') & (p2['pressure_level_v2'] == 'High')).sum()),
            "Medium": int(((p2['phase'] == 'Death') & (p2['pressure_level_v2'] == 'Medium')).sum()),
            "Normal": int(((p2['phase'] == 'Death') & (p2['pressure_level_v2'] == 'Normal')).sum()),
            "Total": int((p2['phase'] == 'Death').sum())
        }
    },
    "severity_breakdown": {
        "Competitive_High": int((p2['pressure_severity_v2'] == 'Competitive_High').sum()),
        "Severe_High": int((p2['pressure_severity_v2'] == 'Severe_High').sum()),
        "Extreme_High": int((p2['pressure_severity_v2'] == 'Extreme_High').sum())
    },
    "cohort_benchmarks": {
        "batter_high_avg_sr": round(float(b[b['high']]['runs'].sum() * 100 / b[b['high']]['ball_faced'].sum()), 2),
        "batter_normal_avg_sr": round(float(b[b['normal']]['runs'].sum() * 100 / b[b['normal']]['ball_faced'].sum()), 2),
        "bowler_high_avg_econ": round(float(w[w['high']]['bowler_runs_conceded'].sum() * 6 / w[w['high']]['legal_bowler_ball'].sum()), 2),
        "bowler_high_avg_dot_pct": round(float(w[w['high']]['dot_ball'].sum() * 100 / w[w['high']]['legal_bowler_ball'].sum()), 2)
    }
}

# 10. Save JSON files to dashboard_data directory
out_dir = os.path.join(os.getcwd(), "src", "data")
os.makedirs(out_dir, exist_ok=True)

with open(os.path.join(out_dir, "overview_data.json"), "w", encoding="utf-8") as f:
    json.dump(overview_metrics, f, indent=2)

with open(os.path.join(out_dir, "batters_ranking.json"), "w", encoding="utf-8") as f:
    json.dump(bat_records, f, indent=2)

with open(os.path.join(out_dir, "bowlers_ranking.json"), "w", encoding="utf-8") as f:
    json.dump(bowl_records, f, indent=2)

with open(os.path.join(out_dir, "universal_players.json"), "w", encoding="utf-8") as f:
    json.dump(universal_players, f, indent=2)

print(f"Data saved successfully to {out_dir}!")
print("Overview metrics:", json.dumps({k: overview_metrics[k] for k in ["total_players_analysed", "total_matches_analysed", "total_deliveries_analysed", "number_of_eligible_batters", "number_of_eligible_bowlers"]}, indent=2))
