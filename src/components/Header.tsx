import React from 'react';
import { Page } from '../types';
import {
  Menu,
  Search,
  Flame,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';

interface HeaderProps {
  currentPage: Page;
  onOpenMobileMenu: () => void;
  onQuickSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobileMenu,
  onQuickSearch,
}) => {
  const pageMeta: Record<Page, { title: string; subtitle: string; category: string }> = {
    overview: {
      category: 'Executive Deck',
      title: 'Executive Intelligence Overview',
      subtitle: 'Rajasthan Royals IPL 2027 Auction Strategy • Pressure Performance Analysis',
    },
    'pressure-analytics': {
      category: 'Match Science',
      title: 'Pressure Classification & Dynamics',
      subtitle: 'Second-Innings Chase Tiers, Severity Calibration & Phase Distributions',
    },
    'batter-rankings': {
      category: 'Player Evaluation',
      title: 'Reliability-Adjusted Batter Leaderboard',
      subtitle: 'High-Pressure Strike Rate, Reliability Lift & Squad Gaps',
    },
    'bowler-rankings': {
      category: 'Player Evaluation',
      title: 'High-Pressure Bowler Leaderboard',
      subtitle: 'Death-Over Economy, Dot-Ball Rates & Bowling Wickets Under Pressure',
    },
    'player-explorer': {
      category: 'Talent Discovery',
      title: 'Universal Player Intelligence Explorer',
      subtitle: 'Search & Inspect All 842 Match-Active Players in the Dataset',
    },
    'player-comparison': {
      category: 'Talent Discovery',
      title: 'Head-to-Head Player Comparison',
      subtitle: 'Multi-Player Clutch Metrics, Radar Profiling & RR Role Suitability',
    },
    'pressure-predictor': {
      category: 'Scenario Engine',
      title: 'Interactive Pressure Scenario Analyser',
      subtitle: 'Deterministic Context Evaluation & Player Historical Pressure Breakdown',
    },
    methodology: {
      category: 'Documentation',
      title: 'Research Methodology & Scoring Architecture',
      subtitle: 'Full Documentation: Data Cleaning, Reliability Shrinkage & Role Balances',
    },
    'data-info': {
      category: 'Technical Specifications',
      title: 'Data & Technical Specifications',
      subtitle: 'Row Counts, Schema Definitions, Season Scope & Model Limitations',
    },
  };

  const current = pageMeta[currentPage] || pageMeta.overview;

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
      {/* Left: Breadcrumbs & Page Heading */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          {/* Breadcrumb Path */}
          <div className="flex items-center space-x-1.5 text-[11px] font-medium text-slate-400">
            <span>RR Intelligence</span>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-500 font-semibold">{current.category}</span>
          </div>
          {/* Page Title */}
          <h1 className="text-lg font-display font-extrabold tracking-tight text-deep-navy">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Search, Status Badges & Brand Pill */}
      <div className="flex items-center space-x-3">
        {/* Quick Search Trigger */}
        <button
          onClick={onQuickSearch}
          className="flex items-center space-x-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-royal-pink/50 hover:bg-white hover:text-royal-pink shadow-sm"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden md:inline text-[11px]">Quick Player Lookup...</span>
          <span className="inline md:hidden text-[11px]">Search</span>
          <kbd className="hidden md:inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500">
            Ctrl+K
          </kbd>
        </button>

        {/* Live System Status Pill */}
        <div className="hidden lg:flex items-center space-x-2 rounded-xl bg-slate-100/80 px-3 py-1.5 border border-slate-200/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-700 tracking-wide">
            837 Matches • 193.9k Balls
          </span>
        </div>

        {/* Franchise Accent Badge */}
        <div className="flex items-center space-x-1.5 rounded-xl bg-deep-navy px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
          <Flame className="h-3.5 w-3.5 text-royal-pink" />
          <span className="hidden sm:inline text-[11px] font-bold tracking-wide">Rajasthan Royals</span>
          <span className="sm:hidden text-[11px] font-bold">RR</span>
        </div>
      </div>
    </header>
  );
};
