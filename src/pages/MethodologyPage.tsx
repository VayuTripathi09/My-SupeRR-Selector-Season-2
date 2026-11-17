import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Swords,
  Target,
  Scale,
  ShieldCheck,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Info,
  ArrowRight,
  TrendingUp,
  FileCode,
  Sliders,
  HelpCircle
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'batting' | 'bowling' | 'roles'>('pipeline');

  return (
    <div className="space-y-8 pb-14 max-w-6xl mx-auto">
      {/* Enterprise Executive Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-dark via-navy-surface to-slate-950 p-8 sm:p-10 text-white shadow-xl border border-navy-border/80">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-royal-pink/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-lavender/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-royal-pink/20 px-3 py-1 text-xs font-semibold text-pink-300 border border-royal-pink/30">
              <BookOpen className="h-3.5 w-3.5 text-royal-pink" />
              <span>Scientific Documentation</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300 border border-white/10">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Deterministic Standard • Audited Codebase</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-mono text-slate-300 border border-white/10">
              v2.4.0-Production
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            SupeRR Selector Season 2: Methodology Architecture
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            A mathematically rigorous, peer-audited analytical framework designed specifically for the <span className="text-white font-semibold">Rajasthan Royals IPL 2027 Mega-Auction Strategy</span>. Isolating clutch reliability under extreme chase pressure through empirical Bayes shrinkage and role-balanced roster optimization.
          </p>

          {/* Quick Stats Banner */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Data Scope</span>
              <span className="text-white font-bold font-mono text-sm">2022–2026 IPL & T20I</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Audited Deliveries</span>
              <span className="text-white font-bold font-mono text-sm">193,988 Legal Balls</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Pressure Model</span>
              <span className="text-royal-pink font-bold font-mono text-sm">Rule Engine v2 (Chase)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Statistical Shrinkage</span>
              <span className="text-lavender font-bold font-mono text-sm">Empirical Bayes Prior</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Methodological Notice */}
      <div className="rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 p-5 text-slate-800 shadow-sm flex items-start space-x-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 mt-0.5 border border-amber-500/20">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="text-xs space-y-1.5 leading-relaxed">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-slate-900 text-sm">
              Core Methodological Pillar: Deterministic Percentile Scoring vs. Black-Box ML
            </h4>
            <span className="rounded bg-amber-200/60 text-amber-900 text-[10px] font-semibold px-2 py-0.5">
              Verified by Code Audit
            </span>
          </div>
          <p className="text-slate-700">
            Per strict audit of the research notebook (<code>SupeRR_PressureIQ_01_Data_Audit.ipynb</code>) and workspace assets, <strong>no black-box machine learning models (e.g. Neural Nets, Random Forests, XGBoost) were trained or serialized</strong>. The system employs an audited, multi-factor percentile ranking engine with empirical Bayes shrinkage to prevent small-sample overfitting.
          </p>
          <p className="text-slate-600">
            We explicitly decline to fabricate synthetic "probability" outputs. Every score, ranking, percentile, and simulated game-state output on this platform is completely reproducible from the uploaded CSV datasets.
          </p>
        </div>
      </div>

      {/* 4-Stage Architectural Pipeline Visualization */}
      <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-navy-dark">Analytical Execution Pipeline</h3>
            <p className="text-xs text-slate-500">From 200,999 raw ball-by-ball rows to role-balanced auction shortlist</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            4-Stage Pipeline Flow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 relative group hover:border-royal-pink/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stage 01</span>
              <span className="rounded bg-slate-200/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">Clean</span>
            </div>
            <h4 className="text-xs font-bold text-navy-dark">Ingestion & Sanitation</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              200,999 raw balls filtered to 193,988 legal balls. Penalty events isolated; wides and no-balls normalized.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-700">
              Output: <strong>837 Valid Matches</strong>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 relative group hover:border-royal-pink/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stage 02</span>
              <span className="rounded bg-pink-100 text-royal-pink px-1.5 py-0.5 font-mono text-[10px] font-semibold">Chases</span>
            </div>
            <h4 className="text-xs font-bold text-navy-dark">Chase Isolation</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Restricted to 2nd-innings chases (91,890 balls). Ground-truth Required Run Rate and horizon established.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-700">
              Output: <strong>91,890 Chase Balls</strong>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="rounded-xl border border-pink-200 bg-pink-50/30 p-4 relative group hover:border-royal-pink/60 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-royal-pink font-semibold">Stage 03</span>
              <span className="rounded bg-royal-pink text-white px-1.5 py-0.5 font-mono text-[10px] font-semibold">Engine v2</span>
            </div>
            <h4 className="text-xs font-bold text-navy-dark">Pressure Classification</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Dynamic rule vector: RRR ≥ 12 OR (RRR ≥ 10 & Wkts ≤ 4) OR (Balls ≤ 30 & Wkts ≤ 4).
            </p>
            <div className="mt-3 pt-2 border-t border-pink-200/60 font-mono text-[10px] text-royal-pink font-semibold">
              Output: <strong>25,712 High-Pressure</strong>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 relative group hover:border-indigo-400 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 font-semibold">Stage 04</span>
              <span className="rounded bg-indigo-600 text-white px-1.5 py-0.5 font-mono text-[10px] font-semibold">Bayes</span>
            </div>
            <h4 className="text-xs font-bold text-navy-dark">Shrinkage & Quotas</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Empirical Bayes shrinkage on pressure lift. Percentile ranking combined with RR auction positional quotas.
            </p>
            <div className="mt-3 pt-2 border-t border-indigo-200/60 font-mono text-[10px] text-indigo-700 font-semibold">
              Output: <strong>Top 10 Roles Shortlist</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Methodology Section Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'pipeline', label: '1. Ingestion & Pressure Engine v2', icon: Flame },
          { id: 'batting', label: '2. Batter Reliability & Bayes Shrinkage', icon: Swords },
          { id: 'bowling', label: '3. Bowler Multi-Metric Containment', icon: Target },
          { id: 'roles', label: '4. RR 2027 Role-Balanced Optimization', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-navy-dark text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-royal-pink' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Ingestion & Pressure Classification */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-royal-pink">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-dark">Pressure Classification Engine (Model v2)</h3>
                <p className="text-xs text-slate-500">Audited quantitative conditions identifying clutch chase deliveries</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In second-innings chases, every delivery is classified using objective state variables:
              <code>Required Run Rate (RRR)</code>, <code>Wickets Remaining (Wkts)</code>, and <code>Balls Remaining (Balls)</code>.
            </p>

            {/* Classification Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
              <div className="rounded-2xl border-2 border-pink-200/90 bg-white p-6 shadow-card hover:border-royal-pink transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center space-x-2 text-royal-pink font-semibold text-[15px] uppercase tracking-wide">
                      <Flame className="h-4 w-4 text-royal-pink" />
                      <span>High Pressure</span>
                    </span>
                    <span className="inline-flex items-center rounded-full bg-pale-pink border border-royal-pink/20 px-3 py-0.5 text-[13px] font-semibold text-royal-pink tabular-nums">
                      28.0%
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#FFF5FA] border border-pink-100/90 p-4 space-y-2.5 font-sans">
                    <div className="text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      Required Run Rate ≥ 12.0
                    </div>
                    <div className="border-t border-pink-200/50 pt-2.5 text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      <span className="font-semibold text-royal-pink mr-1.5">OR</span>Required Run Rate ≥ 10.0 <span className="font-medium text-slate-600">AND</span> Wickets Remaining ≤ 4
                    </div>
                    <div className="border-t border-pink-200/50 pt-2.5 text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      <span className="font-semibold text-royal-pink mr-1.5">OR</span>Balls Remaining ≤ 30 <span className="font-medium text-slate-600">AND</span> Wickets Remaining ≤ 4
                    </div>
                  </div>
                </div>
                <div className="text-[13px] text-slate-500 leading-[1.6]">
                  <strong className="text-deep-navy font-semibold">25,712 deliveries</strong> across 837 matches. Captures critical moments where any mistake swings win probability violently.
                </div>
              </div>

              <div className="rounded-2xl border-2 border-amber-200/90 bg-white p-6 shadow-card hover:border-amber-400 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center space-x-2 text-amber-700 font-semibold text-[15px] uppercase tracking-wide">
                      <AlertTriangle className="h-4 w-4 text-amber-700" />
                      <span>Medium Pressure</span>
                    </span>
                    <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-[13px] font-semibold text-amber-800 tabular-nums">
                      37.1%
                    </span>
                  </div>
                  <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4 space-y-2.5 font-sans">
                    <div className="text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      Required Run Rate ≥ 9.0
                    </div>
                    <div className="border-t border-amber-200/50 pt-2.5 text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      <span className="font-semibold text-amber-700 mr-1.5">OR</span>Wickets Remaining ≤ 4
                    </div>
                    <div className="border-t border-amber-200/50 pt-2.5 text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      <span className="font-semibold text-amber-700 mr-1.5">OR</span>Balls Remaining ≤ 30
                    </div>
                    <div className="pt-0.5 text-[12px] text-amber-700/80 font-medium">
                      *Excluding High Pressure deliveries
                    </div>
                  </div>
                </div>
                <div className="text-[13px] text-slate-500 leading-[1.6]">
                  <strong className="text-deep-navy font-semibold">34,093 deliveries</strong>. Captures building tension, middle-over collapses, and escalating run-rate pressure.
                </div>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-card hover:border-deep-navy/40 transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center space-x-2 text-deep-navy font-semibold text-[15px] uppercase tracking-wide">
                      <CheckCircle2 className="h-4 w-4 text-deep-navy" />
                      <span>Normal Pressure</span>
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[13px] font-semibold text-deep-navy tabular-nums">
                      34.9%
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-2.5 font-sans">
                    <div className="text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      All other qualifying second-innings deliveries
                    </div>
                    <div className="border-t border-slate-200/60 pt-2.5 text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      Runs Required &gt; 0 <span className="font-medium text-slate-600">AND</span> Balls Remaining &gt; 0
                    </div>
                    <div className="border-t border-slate-200/60 pt-2.5 text-[14px] text-slate-800 font-normal leading-[1.7] tracking-normal">
                      Wickets Remaining &gt; 4 <span className="font-medium text-slate-600">AND</span> Required Run Rate &lt; 9.0
                    </div>
                    <div className="pt-0.5 text-[12px] text-slate-500 font-medium">
                      *Innings 2 chase baseline control
                    </div>
                  </div>
                </div>
                <div className="text-[13px] text-slate-500 leading-[1.6]">
                  <strong className="text-deep-navy font-semibold">32,085 deliveries</strong>. Serves as each individual player's baseline standard for calculating pressure lift.
                </div>
              </div>
            </div>

            {/* Extras Sanitation Deep Dive */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 mt-4">
              <h4 className="text-xs font-bold text-navy-dark flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Audited Extras & Penalty Delivery Sanitation</span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Raw cricket telemetry frequently records administrative penalty events (5 penalty runs awarded for ball hitting discarded helmet, time delays, etc.). These events were isolated: they increment team totals but were stripped from legal delivery counts, batter balls faced, and bowler deliveries bowled. Wides and no-balls were correctly classified as non-legal deliveries that charge runs to bowlers but do not increment batters' balls faced.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Batter Reliability & Bayes Shrinkage */}
      {activeTab === 'batting' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-5">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-royal-pink">
                <Swords className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-dark">Batter Scoring Model & Empirical Bayes Shrinkage</h3>
                <p className="text-xs text-slate-500">Mathematical formulation for evaluating clutch batting under pressure</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Eligibility Box */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-dark">Qualification Horizon</span>
                  <span className="font-mono text-xs font-bold text-royal-pink">45 / 842 Qualified (5.3%)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  To eliminate micro-sample volatility, a batter must have faced:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div className="rounded-lg bg-white p-2 border border-slate-200 text-center">
                    <span className="block text-slate-400 text-[10px]">Volume Gate</span>
                    <strong className="text-navy-dark">≥ 60 High Balls</strong>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-slate-200 text-center">
                    <span className="block text-slate-400 text-[10px]">Experience Gate</span>
                    <strong className="text-navy-dark">≥ 8 High Matches</strong>
                  </div>
                </div>
              </div>

              {/* Bayes Shrinkage Problem Definition */}
              <div className="rounded-xl bg-pink-50/40 p-4 border border-pink-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-royal-pink">The "Finisher Baseline" Dilemma</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pure finishers (David Miller, Shashank Singh, Rinku Singh) enter exclusively in overs 16–20 under severe pressure. They rarely face normal-pressure balls. Taking raw <code>(High SR - Normal SR)</code> would arbitrarily punish them or distort their scores due to volatile 10-ball baselines.
                </p>
              </div>
            </div>

            {/* LaTeX Mathematical Formula Presentation */}
            <div className="rounded-2xl bg-navy-dark p-6 text-white space-y-4 shadow-lg border border-navy-border">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300">Mathematical Specifications</span>
                <span className="font-mono text-[11px] text-slate-400">Deterministic Formulation</span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">1. Empirical Bayes Reliability Weight</span>
                  <div className="mt-1.5 rounded-xl bg-white/5 p-3.5 font-mono text-xs text-pink-200 border border-white/10 leading-relaxed">
                    Reliability(Normal Balls) = Normal Balls / (Normal Balls + 100)
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Where prior pseudo-count k = 100 normal deliveries. Batters with small normal baselines have their lift pulled towards zero.
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">2. Reliable Pressure Lift</span>
                  <div className="mt-1.5 rounded-xl bg-white/5 p-3.5 font-mono text-xs text-pink-200 border border-white/10 leading-relaxed">
                    Reliable Lift = (High Pressure Strike Rate - Normal Pressure Strike Rate) × Reliability
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">3. Final Batter Pressure Score (4-Component Percentile)</span>
                  <div className="mt-1.5 rounded-xl bg-gradient-to-r from-royal-pink/20 to-purple-500/20 p-4 font-mono text-xs text-white border border-royal-pink/30 leading-relaxed">
                    Pressure Score = 0.40 × Percentile(High SR)
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.30 × Percentile(High Balls Faced)
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.15 × Percentile(Reliable Pressure Lift)
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.15 × Percentile(High-Pressure Matches)
                  </div>
                </div>
              </div>
            </div>

            {/* Weights Sensitivity Explanation */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-navy-dark">Component Weighting Sensitivity Rationalization:</h4>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                <li><strong>40% High SR:</strong> In high-pressure chases, run accumulation rate is paramount. A batter scoring at 130 SR in an RRR 12+ scenario is actively losing the match.</li>
                <li><strong>30% High Balls:</strong> Proves repeatability. Prevents a batter who had two lucky boundaries from outranking a batter who navigated 200 high-pressure balls.</li>
                <li><strong>15% Reliable Lift:</strong> Isolates the "clutch delta"—how much extra gear a batter finds when the game is on the line compared to standard conditions.</li>
                <li><strong>15% Match Exposure:</strong> Rewards consistency across distinct match environments, pitches, and bowling attacks.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bowler Multi-Metric Containment */}
      {activeTab === 'bowling' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-5">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-dark">Bowler Containment & Threat Model</h3>
                <p className="text-xs text-slate-500">Evaluating run suppression, breakthrough threat, and boundary resistance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-dark">Qualification Horizon</span>
                  <span className="font-mono text-xs font-bold text-indigo-600">56 / 842 Qualified (6.6%)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Bowlers must have delivered under high pressure:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div className="rounded-lg bg-white p-2 border border-slate-200 text-center">
                    <span className="block text-slate-400 text-[10px]">Volume Gate</span>
                    <strong className="text-navy-dark">≥ 60 Legal High Balls</strong>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-slate-200 text-center">
                    <span className="block text-slate-400 text-[10px]">Exposure Gate</span>
                    <strong className="text-navy-dark">≥ 8 High Matches</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50/40 p-4 border border-indigo-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Multi-Dimensional Defense</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  A pure dot-ball bowler who concedes a six on the last delivery loses matches. Conversely, a wicket-taker conceding 14 runs per over is unsustainable. Our composite score integrates containment, threat, and avoidance.
                </p>
              </div>
            </div>

            {/* Bowler Formula Box */}
            <div className="rounded-2xl bg-navy-dark p-6 text-white space-y-4 shadow-lg border border-navy-border">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Mathematical Formulation</span>
                <span className="font-mono text-[11px] text-slate-400">5-Metric Inverted Percentile</span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">Inverted Economy & Boundary Metrics</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    For Economy and Boundary %, lower values represent superior performance. Percentiles are inverted: <code>Percentile_Inverted(x) = 1.0 - Percentile(x)</code>.
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">Final Bowler Pressure Score Formula</span>
                  <div className="mt-1.5 rounded-xl bg-gradient-to-r from-indigo-900/40 to-slate-800 p-4 font-mono text-xs text-indigo-200 border border-indigo-500/30 leading-relaxed">
                    Bowler Score = 0.30 × InvertedPercentile(High Economy)
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.30 × Percentile(Wickets Per Over)
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 × Percentile(Dot Ball Percentage)
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.10 × InvertedPercentile(Boundary Percentage)
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.10 × Percentile(High Legal Balls Bowled)
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Roles breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                <span className="font-bold text-navy-dark block">Run Prevention (40%)</span>
                <span className="text-[11px] text-slate-600 mt-1 block">Economy (30%) + Boundary % (10%) penalizes boundaries that immediately collapse required run rates.</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                <span className="font-bold text-navy-dark block">Breakthrough Threat (30%)</span>
                <span className="text-[11px] text-slate-600 mt-1 block">Wickets Per Over (30%) measures ability to dismantle chasing partnerships and bring in lower orders.</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                <span className="font-bold text-navy-dark block">Pressure Building (30%)</span>
                <span className="text-[11px] text-slate-600 mt-1 block">Dot Ball % (20%) + High Ball Volume (10%) rewards sustained pressure without giving away release balls.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: RR 2027 Role-Balanced Optimization */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-5">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-royal-pink">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-dark">Rajasthan Royals IPL 2027 Roster Optimization</h3>
                <p className="text-xs text-slate-500">Algorithmic role quotas converting raw leaderboards into auction-ready targets</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In mega-auctions, recruiting 5 top-order anchors or 5 finger spinners results in structural squad failure. The <code>select_role_balanced</code> algorithm maps Rajasthan Royals' squad vulnerabilities after the 2026 season into specific role quotas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Batting Quotas */}
              <div className="rounded-xl border border-pink-200 bg-pink-50/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-royal-pink text-xs uppercase tracking-wide">Target Batting Quotas</span>
                  <span className="rounded bg-royal-pink text-white text-[10px] font-bold px-2 py-0.5">RR Needs</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-pink-100">
                    <span className="font-semibold text-slate-800">Finisher</span>
                    <span className="font-mono text-royal-pink font-bold">4 slots (Quota Priority: 100)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-pink-100">
                    <span className="font-semibold text-slate-800">Finisher / Wicketkeeper</span>
                    <span className="font-mono text-royal-pink font-bold">1 slot (Quota Priority: 100)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-pink-100">
                    <span className="font-semibold text-slate-800">Middle-Order Batter</span>
                    <span className="font-mono text-slate-700 font-bold">2 slots (Quota Priority: 90)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-pink-100">
                    <span className="font-semibold text-slate-800">Batting All-Rounder</span>
                    <span className="font-mono text-slate-700 font-bold">2 slots (Quota Priority: 85)</span>
                  </div>
                </div>
              </div>

              {/* Bowling Quotas */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 text-xs uppercase tracking-wide">Target Bowling Quotas</span>
                  <span className="rounded bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5">RR Needs</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-semibold text-slate-800">Death / Pace Bowler</span>
                    <span className="font-mono text-indigo-600 font-bold">3 slots (Quota Priority: 100)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-semibold text-slate-800">Powerplay / Pace Bowler</span>
                    <span className="font-mono text-indigo-600 font-bold">3 slots (Quota Priority: 95)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-semibold text-slate-800">Middle / Mystery Spin</span>
                    <span className="font-mono text-slate-700 font-bold">3 slots (Quota Priority: 90)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-semibold text-slate-800">All-Phase Pace Bowler</span>
                    <span className="font-mono text-slate-700 font-bold">1 slot (Quota Priority: 85)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Formula */}
            <div className="rounded-xl bg-slate-900 text-white p-4 font-mono text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Selection Objective Function</span>
              <p className="text-pink-300">
                Role Score = 0.75 × Pressure Performance Percentile + 0.25 × Role Priority Fit
              </p>
              <p className="text-slate-400 text-[10px] pt-1">
                Ensures that only high-calibre clutch performers fill RR's required positional vacancies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Methodological Sign-off Card */}
      <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-navy-dark">100% Verifiable & Reproducible</h4>
            <p className="text-[11px] text-slate-500">
              Generated directly from <code>SupeRR_PressureIQ_01_Data_Audit.ipynb</code>. No synthetic weights or unverifiable predictions.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0 font-mono text-xs text-slate-600">
          <span className="rounded bg-slate-100 px-2.5 py-1 font-bold">Python 3.10+</span>
          <span className="rounded bg-slate-100 px-2.5 py-1 font-bold">Pandas 2.0+</span>
        </div>
      </div>
    </div>
  );
};
