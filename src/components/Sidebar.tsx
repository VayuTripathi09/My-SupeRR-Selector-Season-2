import React from 'react';
import { Page } from '../types';
import {
  LayoutDashboard,
  Gauge,
  Swords,
  Target,
  UserSearch,
  Scale,
  Sparkles,
  BookOpen,
  Database,
  ChevronRight,
  ShieldCheck,
  Flame,
  PanelLeftClose,
  PanelLeftOpen,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onSelectPage: (page: Page) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  mobileOpen,
  setMobileOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const navItems: { id: Page; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pressure-analytics', label: 'Pressure Analytics', icon: Gauge },
    { id: 'batter-rankings', label: 'Batter Rankings', icon: Swords, badge: 'Top 10' },
    { id: 'bowler-rankings', label: 'Bowler Rankings', icon: Target, badge: 'Top 10' },
    { id: 'player-explorer', label: 'Player Explorer', icon: UserSearch, badge: '842' },
    { id: 'player-comparison', label: 'Player Comparison', icon: Scale },
    { id: 'pressure-predictor', label: 'Pressure Predictor', icon: Sparkles },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'data-info', label: 'Data & Model Info', icon: Database },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-dark/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-navy-dark text-white border-r border-navy-border/60 transition-all duration-300 ease-in-out lg:static ${
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        } ${mobileOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-royal-pink to-pink-500 shadow-royal">
              <Flame className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden transition-opacity duration-200">
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-extrabold tracking-wide text-white text-base">SupeRR</span>
                  <span className="rounded bg-royal-pink px-1.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
                    S2
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-tight truncate">
                  RR 2027 Auction Intelligence
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Campaign Banner (Shown when expanded) */}
        {!isCollapsed && (
          <div className="mx-3.5 my-3.5 rounded-xl bg-white/[0.04] p-3 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center space-x-1.5 text-royal-pink text-[11px] font-bold uppercase tracking-wider">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-royal-pink animate-pulse"></span>
                <span>Role-Balanced Strategy</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono">IPL 2027</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Identifying clutch performers under high chase pressure ($RRR \ge 12$).
            </p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-2.5 py-2 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <div className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Intelligence Modules
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  setMobileOpen(false);
                }}
                title={isCollapsed ? item.label : undefined}
                className={`group relative flex w-full items-center ${
                  isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
                } rounded-xl text-xs font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-royal-pink text-white shadow-royal'
                    : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-royal-pink'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center space-x-1.5">
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-tight ${
                          active
                            ? 'bg-white text-royal-pink'
                            : 'bg-white/10 text-slate-300 group-hover:bg-royal-pink/20 group-hover:text-royal-pink'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {active && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Integrity Verification Footer */}
        <div className="border-t border-white/[0.08] p-3">
          {isCollapsed ? (
            <div className="flex justify-center" title="100% Deterministic Verified Data">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
          ) : (
            <div className="flex items-center space-x-2.5 rounded-xl bg-white/[0.03] p-2.5 border border-white/[0.06]">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="text-[10px] text-slate-400 leading-tight">
                <span className="font-semibold text-slate-200">Verified Deterministic:</span> Original CSV rankings & exact research thresholds preserved.
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
