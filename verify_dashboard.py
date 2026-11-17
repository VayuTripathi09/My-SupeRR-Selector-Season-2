import json
import pandas as pd
import numpy as np

print("Running rigorous verification on SupeRR Selector dashboard data and outputs...")

# Load generated data
with open("src/data/overview_data.json", "r", encoding="utf-8") as f:
    overview = json.load(f)

with open("src/data/batters_ranking.json", "r", encoding="utf-8") as f:
    batters = json.load(f)

with open("src/data/bowlers_ranking.json", "r", encoding="utf-8") as f:
    bowlers = json.load(f)

with open("src/data/universal_players.json", "r", encoding="utf-8") as f:
    players = json.load(f)

# Load original Top 10 files
orig_bat_top10 = pd.read_csv("RR_Final_Role_Balanced_Batter_Top10.csv")
orig_bowl_top10 = pd.read_csv("RR_Final_Role_Balanced_Bowler_Top10.csv")

# 1. Verify Top 10 Batters
print("\n--- TEST 1: TOP 10 BATTERS VERIFICATION ---")
assert len(orig_bat_top10) == 10, "Original batter top 10 does not have 10 rows"
for i, orig_row in orig_bat_top10.iterrows():
    calc_row = batters[i]
    assert orig_row["striker_name"] == calc_row["striker_name"], f"Mismatch at rank {i+1}: expected {orig_row['striker_name']}, got {calc_row['striker_name']}"
    assert round(orig_row["adjusted_gap_score"], 2) == round(calc_row["adjusted_gap_score"], 2), f"Score mismatch for {orig_row['striker_name']}: {orig_row['adjusted_gap_score']} vs {calc_row['adjusted_gap_score']}"
    print(f"Rank {i+1}: {calc_row['striker_name']} | Score: {calc_row['adjusted_gap_score']} | High SR: {calc_row['high_sr']} | Balls: {calc_row['high_balls']} [VERIFIED]")

# 2. Verify Top 10 Bowlers
print("\n--- TEST 2: TOP 10 BOWLERS VERIFICATION ---")
assert len(orig_bowl_top10) == 10, "Original bowler top 10 does not have 10 rows"
for i, orig_row in orig_bowl_top10.iterrows():
    calc_row = bowlers[i]
    assert orig_row["bowler_name"] == calc_row["bowler_name"], f"Mismatch at rank {i+1}: expected {orig_row['bowler_name']}, got {calc_row['bowler_name']}"
    assert round(orig_row["gap_score"], 2) == round(calc_row["gap_score"], 2), f"Score mismatch for {orig_row['bowler_name']}: {orig_row['gap_score']} vs {calc_row['gap_score']}"
    print(f"Rank {i+1}: {calc_row['bowler_name']} | Score: {calc_row['gap_score']} | Economy: {calc_row['high_economy']} | Wickets: {calc_row['high_wickets']} [VERIFIED]")

# 3. Verify Overview Metrics
print("\n--- TEST 3: OVERVIEW KPI VERIFICATION ---")
print("Total Players Analysed:", overview["total_players_analysed"], "[842 expected]")
assert overview["total_players_analysed"] == 842, "Total players mismatch"

print("Total Matches Analysed:", overview["total_matches_analysed"], "[837 expected]")
assert overview["total_matches_analysed"] == 837, "Total matches mismatch"

print("Total Deliveries Analysed:", overview["total_deliveries_analysed"], "[193,988 expected]")
assert overview["total_deliveries_analysed"] == 193988, "Total deliveries mismatch"

print("High-Pressure Deliveries:", overview["high_pressure_deliveries"], "[25,712 expected]")
assert overview["high_pressure_deliveries"] == 25712, "High-pressure deliveries mismatch"

print("Eligible Batters Count:", overview["number_of_eligible_batters"], "[45 expected]")
assert overview["number_of_eligible_batters"] == 45, "Eligible batters count mismatch"

print("Eligible Bowlers Count:", overview["number_of_eligible_bowlers"], "[56 expected]")
assert overview["number_of_eligible_bowlers"] == 56, "Eligible bowlers count mismatch"

print("Top Batter:", overview["top_rated_batter"]["striker_name"], overview["top_rated_batter"]["adjusted_gap_score"])
assert overview["top_rated_batter"]["striker_name"] == "Namboori Tilak Varma"

print("Top Bowler:", overview["top_rated_bowler"]["bowler_name"], overview["top_rated_bowler"]["gap_score"])
assert overview["top_rated_bowler"]["bowler_name"] == "Eshan Malinga"

# 4. Verify Universal Players Dataset
print("\n--- TEST 4: UNIVERSAL PLAYER INTEGRITY ---")
assert len(players) == 842, "Player count mismatch in universal database"
sample_ineligible = [p for p in players if not p["is_bat_eligible"] and not p["is_bowl_eligible"]]
print(f"Found {len(sample_ineligible)} players not eligible for top rankings.")
assert len(sample_ineligible) > 0, "No ineligible players found"
sample_p = sample_ineligible[0]
print(f"Sample Ineligible Player: {sample_p['player_name']}")
print(f"Batting Reason: {sample_p['bat_ineligibility_reason']}")
print(f"Bowling Reason: {sample_p['bowl_ineligibility_reason']}")
assert sample_p["bat_ineligibility_reason"] is not None, "Missing ineligibility reason"

# 5. Pressure Distribution Verification
print("\n--- TEST 5: PRESSURE DISTRIBUTION ---")
high_pct = overview["pressure_distribution"]["High"]["pct"]
med_pct = overview["pressure_distribution"]["Medium"]["pct"]
norm_pct = overview["pressure_distribution"]["Normal"]["pct"]
print(f"High: {high_pct}% | Medium: {med_pct}% | Normal: {norm_pct}% | Sum: {high_pct + med_pct + norm_pct:.2f}%")
assert abs((high_pct + med_pct + norm_pct) - 100.0) < 0.1, "Pressure percentages do not sum to 100%"

print("\nALL 5 AUDIT VERIFICATION TESTS PASSED PERFECTLY!")
