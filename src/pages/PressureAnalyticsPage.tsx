import React, { useState } from 'react';
import { OverviewMetrics } from '../types';
import {
  Gauge,
  Flame,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PressureAnalyticsPageProps {
  overview: OverviewMetrics;
}

export const PressureAnalyticsPage: React.FC<PressureAnalyticsPageProps> = ({ overview }) => {
  const [selectedFormat, setSelectedFormat] = useState<'All' | 'IPL' | 'T20I'>('All');

  const distributionData = [
    {
      name: 'High Pressure',
      deliveries:
        selectedFormat === 'IPL'
          ? overview.format_breakdown.IPL.High
          : selectedFormat === 'T20I'
          ? overview.format_breakdown.T20I.High
          : overview.pressure_distribution.High.count,
      color: '#EA1B85',
      definition: 'RRR ≥ 12 OR (RRR ≥ 10 & Wkts ≤ 4) OR (Balls ≤ 30 & Wkts ≤ 4)',
      role: 'Extreme clutch situations where single errors decide match outcomes.',
    },
    {
      name: 'Medium Pressure',
      deliveries:
        selectedFormat === 'IPL'
          ? overview.format_breakdown.IPL.Medium
          : selectedFormat === 'T20I'
          ? overview.format_breakdown.T20I.Medium
          : overview.pressure_distribution.Medium.count,
      color: '#F59E0B',
      definition: 'RRR ≥ 9 OR Wkts ≤ 4 OR Balls ≤ 30 (Excluding High Pressure)',
      role: 'Heightened tension requiring accelerated scoring or defensive consolidation.',
    },
    {
      name: 'Normal Pressure',
      deliveries:
        selectedFormat === 'IPL'
          ? overview.format_breakdown.IPL.Normal
          : selectedFormat === 'T20I'
          ? overview.format_breakdown.T20I.Normal
          : overview.pressure_distribution.Normal.count,
      color: '#64748B',
      definition: 'All other qualifying second-innings chase deliveries',
      role: 'Control baseline representing standard baseline execution in chases.',
    },
  ];

  const totalFormatDeliveries = distributionData.reduce((acc, curr) => acc + curr.deliveries, 0);

  const severityData = [
    { name: 'Competitive High (RRR ≤ 18)', count: overview.severity_breakdown.Competitive_High, color: '#EA1B85' },
    { name: 'Severe High (18 < RRR ≤ 24)', count: overview.severity_breakdown.Severe_High, color: '#BE185D' },
    { name: 'Extreme High (RRR > 24)', count: overview.severity_breakdown.Extreme_High, color: '#831843' },
  ];

  const phaseData = [
    {
      phase: 'Powerplay (Overs 1–6)',
      High: overview.phase_breakdown.Powerplay.High,
      Medium: overview.phase_breakdown.Powerplay.Medium,
      Normal: overview.phase_breakdown.Powerplay.Normal,
    },
    {
      phase: 'Middle (Overs 7–15)',
      High: overview.phase_breakdown.Middle.High,
      Medium: overview.phase_breakdown.Middle.Medium,
      Normal: overview.phase_breakdown.Middle.Normal,
    },
    {
      phase: 'Death (Overs 16–20)',
      High: overview.phase_breakdown.Death.High,
      Medium: overview.phase_breakdown.Death.Medium,
      Normal: overview.phase_breakdown.Death.Normal,
    },
  ];

  return (
    <div className="space-y-7 pb-12 max-w-7xl mx-auto">
      {/* Methodological Clarity Banner */}
      <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-5 text-amber-950 shadow-sm flex items-start space-x-3.5">
        <Info className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <p className="font-bold text-amber-950 text-sm">
            Methodology Standard: Second-Innings Chase Specificity
          </p>
          <p className="text-amber-900">
            Pressure classification in this system is calculated strictly on <strong>second-innings chases</strong>. In first innings, par scores and target expectations fluctuate based on pitch deterioration and weather conditions. In chases, the target is deterministic, establishing unambiguous mathematical required run rates (RRR), balls remaining, and wickets remaining on every delivery.
          </p>
        </div>
      </div>

      {/* Pressure Model Definition Cards */}
      <div className="space-y-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-[22px] font-heading font-bold text-deep-navy tracking-tight">
            Deterministic Pressure Rules (Model v2)
          </h2>
          <span className="self-start sm:self-auto text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Validated on 837 Chases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* High Pressure Rule */}
          <div className="rounded-2xl bg-white p-6 shadow-card border-2 border-pink-200/90 hover:border-royal-pink transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center space-x-2 text-royal-pink font-semibold text-[15px] uppercase tracking-wide">
                  <Flame className="h-4 w-4 text-royal-pink" />
                  <span>High Pressure</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-pale-pink border border-royal-pink/20 px-3 py-0.5 text-[13px] font-semibold text-royal-pink tabular-nums">
                  {overview.pressure_distribution.High.pct}%
                </span>
              </div>

              {/* Mathematical Conditions */}
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

            <p className="text-[13px] text-slate-500 leading-[1.6]">
              Deliveries where the batting side faces an extreme run deficit or tail-end wickets under immediate threat of match loss.
            </p>
          </div>

          {/* Medium Pressure Rule */}
          <div className="rounded-2xl bg-white p-6 shadow-card border-2 border-amber-200/90 hover:border-amber-400 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center space-x-2 text-amber-700 font-semibold text-[15px] uppercase tracking-wide">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <span>Medium Pressure</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-[13px] font-semibold text-amber-800 tabular-nums">
                  {overview.pressure_distribution.Medium.pct}%
                </span>
              </div>

              {/* Mathematical Conditions */}
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

            <p className="text-[13px] text-slate-500 leading-[1.6]">
              Active leverage points where the chase has departed equilibrium and errors can quickly precipitate collapse.
            </p>
          </div>

          {/* Normal Pressure Rule */}
          <div className="rounded-2xl bg-white p-6 shadow-card border-2 border-slate-200 hover:border-deep-navy/40 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center space-x-2 text-deep-navy font-semibold text-[15px] uppercase tracking-wide">
                  <CheckCircle2 className="h-4 w-4 text-deep-navy" />
                  <span>Normal Pressure</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[13px] font-semibold text-deep-navy tabular-nums">
                  {overview.pressure_distribution.Normal.pct}%
                </span>
              </div>

              {/* Mathematical Conditions */}
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

            <p className="text-[13px] text-slate-500 leading-[1.6]">
              The baseline control group used to establish individual player reliability baselines and compute empirical pressure lift.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs for Format */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center space-x-2 text-sm font-bold text-deep-navy">
          <Layers className="h-4 w-4 text-royal-pink" />
          <span>Delivery Volume Breakdown by Competition Format</span>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 shadow-sm">
          {(['All', 'IPL', 'T20I'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                selectedFormat === fmt
                  ? 'bg-deep-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-deep-navy'
              }`}
            >
              {fmt === 'All' ? 'Combined (91.8k)' : fmt === 'IPL' ? 'IPL (42.0k)' : 'T20I (49.8k)'}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Counts Cards by Selected Format */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {distributionData.map((d) => {
          const pct = ((d.deliveries / totalFormatDeliveries) * 100).toFixed(1);
          return (
            <div key={d.name} className="rounded-2xl bg-white p-5 shadow-card border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">{d.name}</span>
                <span
                  className="rounded px-2 py-0.5 text-xs font-mono font-black text-white"
                  style={{ backgroundColor: d.color }}
                >
                  {pct}%
                </span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-display font-black text-deep-navy tabular-nums">
                  {d.deliveries.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">deliveries in {selectedFormat} chases</div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 leading-tight">
                {d.role}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase Distribution Chart & Secondary Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase-Wise Pressure Concentration */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80">
          <h3 className="text-xs font-bold text-deep-navy uppercase tracking-wider mb-1">
            Phase-Wise Pressure Profile
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            Comparison of Powerplay (1–6), Middle (7–15) and Death (16–20)
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="phase" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#14213D', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="High" fill="#EA1B85" name="High Pressure" />
                <Bar dataKey="Medium" fill="#F59E0B" name="Medium Pressure" />
                <Bar dataKey="Normal" fill="#94A3B8" name="Normal Pressure" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Severity Breakdown */}
        <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80">
          <h3 className="text-xs font-bold text-deep-navy uppercase tracking-wider mb-1">
            High-Pressure Severity Sub-Tiers
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            Required Run Rate gradient across the 25,712 high-pressure balls
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={severityData}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#14213D' }} width={140} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} balls`, 'Deliveries']}
                  contentStyle={{ backgroundColor: '#14213D', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#EA1B85" radius={[0, 4, 4, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Evolution & Audit Narrative */}
      <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-200/80 space-y-3">
        <h3 className="text-sm font-bold text-deep-navy uppercase tracking-wider">
          Audit Discovery: Transition from Model v1 to Model v2
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          During initial validation of Model v1 (which required RRR ≥ 10 for balls ≤ 30 to trigger High Pressure), our match audit flagged 6 classic close finishes (e.g. Match 23673, Match 24822) that ended with 1–2 wickets or within the final over, yet registered 0% high pressure because early wickets depressed the target to an achievable required rate (e.g. 7.5 RRR with only 2 wickets remaining).
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          To correct this distortion, <strong>Model v2</strong> introduced the third clause: <code>(Balls ≤ 30 &amp; Wickets ≤ 4)</code>. This ensured that late-stage tail-ender vulnerability is mathematically captured even when the required run rate is moderate, creating an authentic representation of true match tension.
        </p>
      </div>
    </div>
  );
};
