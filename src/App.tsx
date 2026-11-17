import React, { useState, useEffect } from 'react';
import { Page, UniversalPlayer, OverviewMetrics, BatterRanking, BowlerRanking } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PlayerModal } from './components/PlayerModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { PressureAnalyticsPage } from './pages/PressureAnalyticsPage';
import { BatterRankingsPage } from './pages/BatterRankingsPage';
import { BowlerRankingsPage } from './pages/BowlerRankingsPage';
import { PlayerExplorerPage } from './pages/PlayerExplorerPage';
import { PlayerComparisonPage } from './pages/PlayerComparisonPage';
import { PressurePredictorPage } from './pages/PressurePredictorPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { DataModelInfoPage } from './pages/DataModelInfoPage';

// Data imports
import overviewJson from './data/overview_data.json';
import battersJson from './data/batters_ranking.json';
import bowlersJson from './data/bowlers_ranking.json';
import universalPlayersJson from './data/universal_players.json';

import { Search, X, Swords, Target, ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<UniversalPlayer | null>(null);
  const [compareInitialPlayer, setCompareInitialPlayer] = useState<UniversalPlayer | null>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const overview: OverviewMetrics = overviewJson as unknown as OverviewMetrics;
  const batters: BatterRanking[] = battersJson as unknown as BatterRanking[];
  const bowlers: BowlerRanking[] = bowlersJson as unknown as BowlerRanking[];
  const players: UniversalPlayer[] = universalPlayersJson as unknown as UniversalPlayer[];

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCompare = (player: UniversalPlayer) => {
    setCompareInitialPlayer(player);
    setCurrentPage('player-comparison');
  };

  const quickSearchResults = quickSearchQuery.trim()
    ? players
        .filter(
          (p) =>
            p.player_name.toLowerCase().includes(quickSearchQuery.toLowerCase()) ||
            p.team.toLowerCase().includes(quickSearchQuery.toLowerCase())
        )
        .slice(0, 10)
    : players.slice(0, 8);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onQuickSearch={() => setQuickSearchOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {currentPage === 'overview' && (
            <OverviewPage
              overview={overview}
              onSelectPlayer={setSelectedPlayer}
              onNavigate={setCurrentPage}
              allPlayers={players}
            />
          )}

          {currentPage === 'pressure-analytics' && (
            <PressureAnalyticsPage overview={overview} />
          )}

          {currentPage === 'batter-rankings' && (
            <BatterRankingsPage
              batters={batters}
              allPlayers={players}
              onSelectPlayer={setSelectedPlayer}
            />
          )}

          {currentPage === 'bowler-rankings' && (
            <BowlerRankingsPage
              bowlers={bowlers}
              allPlayers={players}
              onSelectPlayer={setSelectedPlayer}
            />
          )}

          {currentPage === 'player-explorer' && (
            <PlayerExplorerPage
              players={players}
              overview={overview}
              onOpenCompare={handleOpenCompare}
            />
          )}

          {currentPage === 'player-comparison' && (
            <PlayerComparisonPage
              players={players}
              initialPlayer={compareInitialPlayer}
            />
          )}

          {currentPage === 'pressure-predictor' && (
            <PressurePredictorPage
              players={players}
              overview={overview}
            />
          )}

          {currentPage === 'methodology' && <MethodologyPage />}

          {currentPage === 'data-info' && <DataModelInfoPage />}
        </main>
      </div>

      {/* Detailed Player Modal Dialog */}
      <PlayerModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onOpenCompare={handleOpenCompare}
      />

      {/* Quick Search Dialog (Ctrl+K) */}
      {quickSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setQuickSearchOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10">
            <div className="p-4 border-b border-slate-100 flex items-center space-x-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search any player in the dataset..."
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setQuickSearchOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
              {quickSearchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No players found matching "{quickSearchQuery}".
                </div>
              ) : (
                quickSearchResults.map((p) => (
                  <div
                    key={p.player_id}
                    onClick={() => {
                      setSelectedPlayer(p);
                      setQuickSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl flex items-center justify-between hover:bg-pink-50/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-deep-navy text-white text-xs font-bold flex items-center justify-center">
                        {p.player_name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-royal-pink transition-colors">
                          {p.player_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {p.team} • {p.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {p.batter_ranking && (
                        <span className="text-[10px] font-bold text-royal-pink bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                          #{p.batter_ranking.rank} Bat
                        </span>
                      )}
                      {p.bowler_ranking && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          #{p.bowler_ranking.rank} Bowl
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
              <span>Press ESC to close</span>
              <span>{players.length} players loaded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
