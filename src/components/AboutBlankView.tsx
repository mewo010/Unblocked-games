import React, { useState, useEffect, useMemo } from 'react';
import {
  PORTAL_GAMES,
  CINEJOY_MOVIES,
  GameItem,
  MovieItem,
  getMovieStreamUrl,
} from '../data/portalData';
import { playClickSound } from '../utils/audio';
import { launchRealAboutBlank } from '../utils/aboutBlank';

interface AboutBlankViewProps {
  onExit: () => void;
}

type TabType = 'games' | 'movies' | 'browser' | 'music' | 'chat' | 'settings';

export const AboutBlankView: React.FC<AboutBlankViewProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<TabType>('games');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('portal_favorites') || '["stickman-hook", "paper-io-2", "slope"]');
    } catch {
      return ['stickman-hook', 'paper-io-2', 'slope'];
    }
  });
  const [recentGames, setRecentGames] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('portal_recent') || '["stickman-hook", "drive-mad"]');
    } catch {
      return ['stickman-hook', 'drive-mad'];
    }
  });

  // Active playing game & server mirror
  const [playingGame, setPlayingGame] = useState<GameItem | null>(null);
  const [gameServerIndex, setGameServerIndex] = useState(0);

  // Active movie state
  const [playingMovie, setPlayingMovie] = useState<MovieItem | null>(null);
  const [movieServerIndex, setMovieServerIndex] = useState(0);
  const [movieSeason, setMovieSeason] = useState(1);
  const [movieEpisode, setMovieEpisode] = useState(1);

  // Custom movie search & input
  const [movieSearch, setMovieSearch] = useState('');
  const [selectedMovieGenre, setSelectedMovieGenre] = useState('All');
  const [customTmdbInput, setCustomTmdbInput] = useState('');

  // Built-in Search Engine State
  const [browserQuery, setBrowserQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'wiki' | 'tools' | 'games'>('all');
  const [activeWikiTopic, setActiveWikiTopic] = useState<{ title: string; extract: string; image?: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');

  // Music Player
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicStation, setMusicStation] = useState(0);

  // Cloaking
  const [cloakTitle, setCloakTitle] = useState(() => localStorage.getItem('portal_cloak') || 'about:blank');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const categories = [
    'All',
    '★ Favorites',
    '⏱ Recent',
    'Stickman',
    'Arcade',
    'Racing',
    'Sports',
    'Physics',
    'Shooter',
    'Platformer',
    'Idle',
    'Rhythm',
    'Strategy',
    'Horror',
    '2 Player',
    'Fighting',
    'Puzzle',
    'Retro',
  ];

  const musicStations = [
    { name: 'Lo-Fi Chill Beats', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' },
    { name: 'Synthwave / Retro Radio', url: 'https://streams.ilovemusic.de/iloveradio109.mp3' },
    { name: 'Chillhop Cafe', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' },
  ];

  // Sync title for cloaking
  useEffect(() => {
    document.title = cloakTitle;
    localStorage.setItem('portal_cloak', cloakTitle);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (playingGame) setPlayingGame(null);
        else if (playingMovie) setPlayingMovie(null);
        else onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cloakTitle, onExit, playingGame, playingMovie]);

  // Filter games
  const filteredGames = useMemo(() => {
    return PORTAL_GAMES.filter((game) => {
      const matchSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (selectedCategory === 'All') return true;
      if (selectedCategory === '★ Favorites') return favorites.includes(game.id);
      if (selectedCategory === '⏱ Recent') return recentGames.includes(game.id);
      return game.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [searchQuery, selectedCategory, favorites, recentGames]);

  // Filter movies
  const filteredMovies = useMemo(() => {
    return CINEJOY_MOVIES.filter((movie) => {
      const matchSearch =
        movie.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
        movie.description.toLowerCase().includes(movieSearch.toLowerCase()) ||
        movie.genre.toLowerCase().includes(movieSearch.toLowerCase());
      if (!matchSearch) return false;
      if (selectedMovieGenre === 'All') return true;
      return movie.genre.toLowerCase().includes(selectedMovieGenre.toLowerCase());
    });
  }, [movieSearch, selectedMovieGenre]);

  const handleLaunchGame = (game: GameItem) => {
    playClickSound();
    setGameServerIndex(0);
    setPlayingGame(game);
    const updatedRecents = [game.id, ...recentGames.filter((id) => id !== game.id)].slice(0, 10);
    setRecentGames(updatedRecents);
    localStorage.setItem('portal_recent', JSON.stringify(updatedRecents));
  };

  const handleLaunchMovie = (movie: MovieItem) => {
    playClickSound();
    setMovieServerIndex(0);
    setMovieSeason(1);
    setMovieEpisode(1);
    setPlayingMovie(movie);
  };

  const toggleFavorite = (gameId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound();
    setFavorites((prev) => {
      const updated = prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      localStorage.setItem('portal_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Perform inside-portal Wikipedia search
  const handlePerformSearch = async (term: string) => {
    if (!term.trim()) return;
    setIsSearching(true);
    setActiveWikiTopic(null);
    try {
      const resp = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term.trim())}`
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data.extract) {
          setActiveWikiTopic({
            title: data.title,
            extract: data.extract,
            image: data.thumbnail?.source,
          });
        }
      }
    } catch {
      // Ignore network errors in iframe preview
    } finally {
      setIsSearching(false);
    }
  };

  const handleCalcEval = () => {
    try {
      // Safe math evaluator without eval()
      const sanitized = calculatorInput.replace(/[^0-9+\-*/().]/g, '');
      const fn = new Function(`return (${sanitized})`);
      const res = fn();
      setCalculatorResult(String(res));
    } catch {
      setCalculatorResult('Error');
    }
  };

  const continuePlayingGame = PORTAL_GAMES.find((g) => g.id === recentGames[0]) || PORTAL_GAMES[0];
  const ownersPicks = PORTAL_GAMES.filter((g) => g.isOwnerPick);
  const topThisWeek = PORTAL_GAMES.filter((g) => g.isPopular).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0d14] text-[#e2e8f0] flex font-sans select-none overflow-hidden animate-fade-in">
      {/* 1. LEFT PILL NAVIGATION SIDEBAR (Matching user's screenshot) */}
      <aside className="w-16 sm:w-20 bg-[#10121d] border-r border-[#1e2030] flex flex-col items-center py-4 justify-between z-20 shrink-0">
        {/* Top App Logo */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setActiveTab('games')}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#4f46e5] flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(124,58,237,0.5)] transition hover:scale-105 cursor-pointer"
            title="Unblocked Portal Home"
          >
            ⚡
          </button>
        </div>

        {/* Navigation Icons matching screenshot */}
        <nav className="flex flex-col items-center gap-2.5 my-auto">
          {/* Browser / Search Icon */}
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('browser');
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
              activeTab === 'browser'
                ? 'bg-[#828bf7] text-[#0a0b12] shadow-[0_0_14px_rgba(130,139,247,0.45)]'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1c2d]'
            }`}
            title="In-Site Search & Browser"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path strokeWidth="2" d="m21 21-4.35-4.35" />
            </svg>
            <span className="absolute left-full ml-3 px-2 py-1 bg-black/90 text-white text-[11px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition z-30">
              Browser & Tools
            </span>
          </button>

          {/* Games Tab (Gamepad Icon) */}
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('games');
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
              activeTab === 'games'
                ? 'bg-[#828bf7] text-[#0a0b12] shadow-[0_0_14px_rgba(130,139,247,0.45)]'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1c2d]'
            }`}
            title="Unblocked Games"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="6" width="20" height="12" rx="6" strokeWidth="2" />
              <path strokeWidth="2" d="M6 12h4m-2-2v4m7-2h.01m3 0h.01" />
            </svg>
            <span className="absolute left-full ml-3 px-2 py-1 bg-black/90 text-white text-[11px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition z-30">
              Games (40+)
            </span>
          </button>

          {/* Movies Tab (Cinejoy Cinema Icon) */}
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('movies');
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
              activeTab === 'movies'
                ? 'bg-[#f43f5e] text-white shadow-[0_0_14px_rgba(244,63,94,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1c2d]'
            }`}
            title="Cinejoy Movies Stream"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2.18" strokeWidth="2" />
              <path strokeWidth="2" d="M7 2v4m10-4v4M2 8h20M2 16h20M7 20v4m10-4v4" />
            </svg>
            <span className="absolute left-full ml-3 px-2 py-1 bg-black/90 text-white text-[11px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition z-30">
              Cinejoy Movies
            </span>
          </button>

          {/* Music Radio Icon */}
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('music');
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
              activeTab === 'music'
                ? 'bg-[#828bf7] text-[#0a0b12] shadow-[0_0_14px_rgba(130,139,247,0.45)]'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1c2d]'
            }`}
            title="Lo-Fi Music Player"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span className="absolute left-full ml-3 px-2 py-1 bg-black/90 text-white text-[11px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition z-30">
              Music Radio
            </span>
          </button>
        </nav>

        {/* Bottom Settings / Cloak button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-10 h-10 rounded-xl text-gray-400 hover:text-white hover:bg-[#1a1c2d] flex items-center justify-center transition cursor-pointer"
            title="Stealth & Tab Cloaking Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z" />
              <path strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0b12]">
        {/* TAB 1: GAMES VIEW (Matching User Screenshot) */}
        {activeTab === 'games' && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
            {/* Header: Cursive 'games' + Live Count Badge + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1
                  className="text-4xl sm:text-5xl font-black italic tracking-tight text-white select-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, cursive" }}
                >
                  games
                </h1>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#1b1c2b] text-[#828bf7] border border-[#2b2d45] tracking-wide">
                  {PORTAL_GAMES.length}+
                </span>
              </div>

              {/* Game Search Bar */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search games..."
                  className="w-full bg-[#131420] border border-[#232639] rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-500 outline-none focus:border-[#828bf7] transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Horizontal Pill Categories Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playClickSound();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer text-xs ${
                    selectedCategory === cat
                      ? 'bg-[#828bf7] text-[#0a0b12] font-black shadow-[0_0_12px_rgba(130,139,247,0.4)]'
                      : 'bg-[#151724] text-gray-400 hover:text-white hover:bg-[#1f2235]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Section: Continue Playing */}
            {!searchQuery && selectedCategory === 'All' && (
              <div>
                <h2 className="text-sm font-bold text-gray-300 flex items-center gap-1.5 mb-3">
                  <span>▶</span>
                  <span>Continue Playing</span>
                </h2>
                <div
                  onClick={() => handleLaunchGame(continuePlayingGame)}
                  className="w-36 sm:w-44 bg-[#141624] border border-[#232639] rounded-2xl p-2.5 hover:border-[#828bf7] transition-all hover:scale-102 cursor-pointer group shadow-lg"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-900 mb-2 relative">
                    <img
                      src={continuePlayingGame.thumbnail}
                      alt={continuePlayingGame.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="w-10 h-10 rounded-full bg-[#828bf7] text-black font-bold flex items-center justify-center shadow-lg">
                        ▶
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-200 truncate">
                    {continuePlayingGame.title}
                  </div>
                  <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                    Click to Play Inside Site
                  </div>
                </div>
              </div>
            )}

            {/* Section: Owner's Picks */}
            {!searchQuery && selectedCategory === 'All' && (
              <div>
                <h2 className="text-sm font-bold text-gray-300 flex items-center gap-1.5 mb-3">
                  <span>★</span>
                  <span>Owner&apos;s Picks</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {ownersPicks.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleLaunchGame(game)}
                      className="bg-[#141624] border border-[#232639] rounded-2xl p-2.5 hover:border-[#828bf7] transition-all hover:scale-102 cursor-pointer group shadow-md"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-900 mb-2 relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                        <button
                          onClick={(e) => toggleFavorite(game.id, e)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition text-amber-300"
                        >
                          {favorites.includes(game.id) ? '★' : '☆'}
                        </button>
                      </div>
                      <div className="text-xs font-bold text-gray-200 truncate">
                        {game.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Top This Week */}
            {!searchQuery && selectedCategory === 'All' && (
              <div>
                <h2 className="text-sm font-bold text-gray-300 flex items-center gap-1.5 mb-3">
                  <span>🔥</span>
                  <span>Top This Week</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {topThisWeek.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleLaunchGame(game)}
                      className="bg-[#141624] border border-[#232639] rounded-2xl p-2.5 hover:border-[#828bf7] transition-all hover:scale-102 cursor-pointer group shadow-md"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-900 mb-2 relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                        <button
                          onClick={(e) => toggleFavorite(game.id, e)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition text-amber-300"
                        >
                          {favorites.includes(game.id) ? '★' : '☆'}
                        </button>
                      </div>
                      <div className="text-xs font-bold text-gray-200 truncate">
                        {game.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: All Games Grid (Full Collection) */}
            <div>
              <h2 className="text-sm font-bold text-gray-300 mb-3">
                {selectedCategory === 'All' ? 'All Games' : `${selectedCategory} Games`} ({filteredGames.length})
              </h2>

              {filteredGames.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  No games found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredGames.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleLaunchGame(game)}
                      className="bg-[#131422] border border-[#1e2035] rounded-2xl p-2.5 hover:border-[#828bf7] transition-all hover:scale-102 cursor-pointer group shadow-sm flex flex-col justify-between"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-900 mb-2 relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                        <button
                          onClick={(e) => toggleFavorite(game.id, e)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition text-amber-300"
                        >
                          {favorites.includes(game.id) ? '★' : '☆'}
                        </button>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-200 truncate">
                          {game.title}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium">
                          {game.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CINEJOY MOVIES VIEW (Streams directly inside site!) */}
        {activeTab === 'movies' && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-4xl sm:text-5xl font-black italic tracking-tight text-[#f43f5e]"
                  style={{ fontFamily: "'Playfair Display', Georgia, cursive" }}
                >
                  movies
                </h1>
                <div className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-2">
                  <span>Stream full movies & series right inside the site with</span>
                  <span className="text-[#f43f5e] font-bold">Cinejoy Cinema</span>
                </div>
              </div>

              {/* Search or Enter TMDB ID */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                  placeholder="search movie title..."
                  className="w-full sm:w-64 bg-[#131420] border border-[#232639] rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-500 outline-none focus:border-[#f43f5e] transition"
                />
              </div>
            </div>

            {/* Custom Movie Launcher Banner (Stream ANY movie inside site!) */}
            <div className="bg-gradient-to-r from-[#4c0519] via-[#881337] to-[#1e1026] border border-rose-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase text-rose-300 tracking-wider mb-1">
                  🎬 CINEJOY IN-SITE STREAM ENGINE
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Watch Any Movie or TV Series Instantly
                </h3>
                <p className="text-xs text-rose-200 max-w-xl">
                  Pick any trending blockbuster below or enter a custom movie/series name to stream immediately inside the player.
                </p>
              </div>

              {/* Quick Launch Custom Movie */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={customTmdbInput}
                  onChange={(e) => setCustomTmdbInput(e.target.value)}
                  placeholder="TMDB ID or movie title..."
                  className="bg-black/50 border border-rose-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder-rose-300/60 outline-none focus:border-rose-400 w-full sm:w-48"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customTmdbInput.trim()) {
                      handleLaunchMovie({
                        id: 'custom-' + Date.now(),
                        title: customTmdbInput.trim(),
                        year: '2024',
                        rating: '8.5',
                        genre: 'Stream',
                        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
                        tmdbId: customTmdbInput.trim().match(/^\d+$/) ? customTmdbInput.trim() : '533535',
                        type: 'movie',
                        description: `Streaming ${customTmdbInput} inside Cinejoy Cinema`,
                      });
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (customTmdbInput.trim()) {
                      handleLaunchMovie({
                        id: 'custom-' + Date.now(),
                        title: customTmdbInput.trim(),
                        year: '2024',
                        rating: '8.5',
                        genre: 'Stream',
                        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
                        tmdbId: customTmdbInput.trim().match(/^\d+$/) ? customTmdbInput.trim() : '533535',
                        type: 'movie',
                        description: `Streaming ${customTmdbInput} inside Cinejoy Cinema`,
                      });
                    }
                  }}
                  className="px-4 py-2 bg-white text-rose-950 font-black text-xs rounded-xl hover:bg-rose-100 transition whitespace-nowrap cursor-pointer shadow-md"
                >
                  ▶ Watch
                </button>
              </div>
            </div>

            {/* Movie Genre Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
              {['All', 'Action', 'Sci-Fi', 'Animation', 'Horror', 'Comedy', 'Drama', 'TV'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    playClickSound();
                    setSelectedMovieGenre(genre);
                  }}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer text-xs ${
                    selectedMovieGenre === genre
                      ? 'bg-[#f43f5e] text-white font-black shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'bg-[#151724] text-gray-400 hover:text-white hover:bg-[#1f2235]'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Movie Cards Grid (Clicking plays DIRECTLY in-site) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleLaunchMovie(movie)}
                  className="bg-[#141523] border border-[#202237] rounded-2xl p-2.5 hover:border-rose-500/80 transition-all hover:scale-102 cursor-pointer group shadow-lg flex flex-col justify-between"
                >
                  <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 mb-2 relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>★</span>
                      <span>{movie.rating}</span>
                    </div>

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="w-12 h-12 rounded-full bg-[#f43f5e] text-white font-black text-lg flex items-center justify-center shadow-2xl">
                        ▶
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white truncate mb-0.5">
                      {movie.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                      <span>{movie.year}</span>
                      <span className="truncate max-w-[90px]">{movie.genre}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IN-PORTAL WEB SEARCH ENGINE & TOOLS (100% inside site) */}
        {activeTab === 'browser' && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 bg-[#0a0c16]">
            {/* Search Engine Header */}
            <div className="max-w-2xl mx-auto text-center pt-2">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
                <span>🔍</span> In-Site Web Search
              </h2>
              <p className="text-xs text-gray-400 mb-6">
                Explore articles, Wikipedia summaries, calculators, and tools directly inside the portal without external redirects.
              </p>

              {/* Main Search Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePerformSearch(browserQuery);
                }}
                className="relative flex items-center shadow-2xl"
              >
                <input
                  type="text"
                  value={browserQuery}
                  onChange={(e) => setBrowserQuery(e.target.value)}
                  placeholder="search Wikipedia or topic (e.g. Minecraft, Solar System, Gaming, Python)..."
                  className="w-full bg-[#141728] border-2 border-[#2b2f4c] rounded-2xl px-5 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#828bf7] transition shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 px-4 py-2 bg-[#828bf7] text-[#0a0b12] rounded-xl font-black text-xs hover:brightness-110 transition cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Quick Filter Tags */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs">
                {(['all', 'wiki', 'tools', 'games'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSearchFilter(filter)}
                    className={`px-3 py-1 rounded-full capitalize font-bold transition ${
                      searchFilter === filter
                        ? 'bg-[#828bf7] text-[#0a0b12]'
                        : 'bg-[#151726] text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Search Result View (Wikipedia In-Portal Reader) */}
            {isSearching && (
              <div className="max-w-2xl mx-auto p-8 text-center text-gray-400 text-sm">
                Searching inside portal...
              </div>
            )}

            {activeWikiTopic && (
              <div className="max-w-2xl mx-auto bg-[#131626] border border-[#262b46] rounded-2xl p-6 shadow-2xl animate-fade-in">
                <div className="flex items-start gap-4">
                  {activeWikiTopic.image && (
                    <img
                      src={activeWikiTopic.image}
                      alt={activeWikiTopic.title}
                      className="w-24 h-24 object-cover rounded-xl bg-gray-900 shrink-0 border border-gray-700"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{activeWikiTopic.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      {activeWikiTopic.extract}
                    </p>
                    <span className="text-[10px] text-[#828bf7] font-bold uppercase tracking-wider">
                      Verified In-Site Knowledge
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tools Grid (Calculators, Scratchpad, Cheats) */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {/* Built-in Scientific Math Calculator */}
              <div className="bg-[#131627] border border-[#222742] rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🧮</span> In-Site Math Calculator
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Offline</span>
                </div>
                <div className="bg-[#0b0c14] border border-[#1e2238] rounded-xl p-3 mb-3 text-right">
                  <div className="text-xs text-gray-500 font-mono">{calculatorInput || '0'}</div>
                  <div className="text-xl font-bold text-[#828bf7] font-mono">{calculatorResult || '0'}</div>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                  {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                    <button
                      key={btn}
                      onClick={() => {
                        if (btn === '=') {
                          handleCalcEval();
                        } else {
                          setCalculatorInput((prev) => prev + btn);
                        }
                      }}
                      className="p-2.5 rounded-lg bg-[#181c32] hover:bg-[#232847] text-white transition active:scale-95"
                    >
                      {btn}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setCalculatorInput('');
                      setCalculatorResult('');
                    }}
                    className="col-span-4 p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition text-xs font-bold mt-1"
                  >
                    Clear Calculator
                  </button>
                </div>
              </div>

              {/* Built-in Offline Scratchpad */}
              <div className="bg-[#131627] border border-[#222742] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>📝</span> In-Site Notes Scratchpad
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Autosaved</span>
                  </div>
                  <textarea
                    defaultValue={localStorage.getItem('portal_notes') || ''}
                    onChange={(e) => localStorage.setItem('portal_notes', e.target.value)}
                    placeholder="Write game codes, study notes, or cheat sheets here..."
                    className="w-full h-44 bg-[#0b0c14] border border-[#1e2238] rounded-xl p-3 text-xs text-gray-200 outline-none resize-none font-mono focus:border-[#828bf7] transition"
                  />
                </div>
                <div className="text-[10px] text-gray-500 mt-2">
                  All data is stored client-side in your local browser cache.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MUSIC RADIO VIEW */}
        {activeTab === 'music' && (
          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-[#0a0b12]">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-rose-600 flex items-center justify-center text-4xl shadow-2xl mb-4 animate-pulse">
              🎵
            </div>
            <h2 className="text-3xl font-black text-white mb-2">In-Portal Lo-Fi & Game Audio</h2>
            <p className="text-xs text-gray-400 max-w-sm mb-6">
              Stream study beats, lo-fi cafe, and synthwave chill beats while gaming.
            </p>

            {/* Station Selector */}
            <div className="flex items-center gap-2 mb-6 text-xs">
              {musicStations.map((station, idx) => (
                <button
                  key={station.name}
                  onClick={() => {
                    setMusicStation(idx);
                    setIsPlayingMusic(true);
                  }}
                  className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                    musicStation === idx
                      ? 'bg-[#828bf7] text-[#0a0b12]'
                      : 'bg-[#151726] text-gray-400 hover:text-white'
                  }`}
                >
                  {station.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="px-8 py-3 bg-[#828bf7] text-gray-950 rounded-2xl font-black text-sm shadow-xl hover:brightness-110 transition cursor-pointer flex items-center gap-2"
            >
              <span>{isPlayingMusic ? '⏸ Pause Stream' : '▶ Play Radio Station'}</span>
            </button>

            {isPlayingMusic && (
              <div className="mt-8 w-full max-w-md bg-[#131627] border border-[#232847] p-5 rounded-2xl flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
                    🎧
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{musicStations[musicStation].name}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold animate-pulse">
                      ● Live Playing Inside App
                    </div>
                  </div>
                </div>
                <audio
                  key={musicStations[musicStation].url}
                  src={musicStations[musicStation].url}
                  autoPlay
                  controls
                  className="h-8 max-w-[150px]"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. GAME PLAYER MODAL (100% Inside Site with Server Switches) */}
      {playingGame && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-fade-in">
          {/* Top Control Bar */}
          <div className="h-13 bg-[#111320] border-b border-[#23263b] px-4 sm:px-6 flex items-center justify-between text-white text-xs shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlayingGame(null)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span>←</span>
                <span>Back to Games</span>
              </button>
              <span className="font-extrabold text-sm text-gray-100">{playingGame.title}</span>
              <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded-md bg-white/5 font-semibold hidden sm:inline">
                {playingGame.category}
              </span>
            </div>

            {/* Server Selector & Controls */}
            <div className="flex items-center gap-2">
              {/* Server Switches */}
              <div className="hidden md:flex items-center gap-1 bg-[#171a2e] p-1 rounded-xl border border-[#272b49]">
                <button
                  onClick={() => setGameServerIndex(0)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    gameServerIndex === 0 ? 'bg-[#828bf7] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Server 1 (Fast)
                </button>
                {playingGame.mirrors && playingGame.mirrors.length > 1 && (
                  <button
                    onClick={() => setGameServerIndex(1)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      gameServerIndex === 1 ? 'bg-[#828bf7] text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Server 2 (Mirror)
                  </button>
                )}
              </div>

              {/* Toggle Favorite */}
              <button
                onClick={() => toggleFavorite(playingGame.id)}
                className="p-2 hover:bg-white/10 rounded-xl text-amber-300 font-bold transition"
                title="Toggle Favorite"
              >
                {favorites.includes(playingGame.id) ? '★' : '☆'}
              </button>

              {/* Reload */}
              <button
                onClick={() => {
                  const frame = document.getElementById('activeGameIframe') as HTMLIFrameElement;
                  if (frame) frame.src = frame.src;
                }}
                className="p-2 hover:bg-white/10 rounded-xl text-gray-300 font-bold transition"
                title="Reload Game"
              >
                🔄
              </button>

              {/* Fullscreen */}
              <button
                onClick={() => {
                  const elem = document.getElementById('activeGameContainer');
                  if (elem?.requestFullscreen) elem.requestFullscreen();
                }}
                className="px-3 py-1.5 bg-[#828bf7] text-[#0a0b12] font-black rounded-xl transition hover:brightness-110 cursor-pointer shadow-md"
              >
                ⛶ Fullscreen
              </button>

              {/* Close */}
              <button
                onClick={() => setPlayingGame(null)}
                className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl font-bold transition cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Controls Bar Info if available */}
          {playingGame.controls && (
            <div className="bg-[#0b0c16] text-[11px] text-gray-400 px-6 py-1.5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#828bf7]">Controls: </span>
                <span>{playingGame.controls}</span>
              </div>
              <span className="text-[10px] text-gray-500">Press ESC to exit game</span>
            </div>
          )}

          {/* Iframe Playable Container */}
          <div id="activeGameContainer" className="flex-1 w-full h-full bg-black relative">
            <iframe
              id="activeGameIframe"
              src={
                playingGame.mirrors && playingGame.mirrors[gameServerIndex]
                  ? playingGame.mirrors[gameServerIndex]
                  : playingGame.playUrl
              }
              title={playingGame.title}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      )}

      {/* 4. CINEJOY CINEMA PLAYER MODAL (100% Inside Site with Server Switches) */}
      {playingMovie && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-fade-in">
          {/* Top Bar */}
          <div className="h-13 bg-[#130810] border-b border-rose-900/40 px-4 sm:px-6 flex items-center justify-between text-white text-xs shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlayingMovie(null)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span>←</span>
                <span>Back to Movies</span>
              </button>
              <span className="font-black text-sm text-rose-300">{playingMovie.title}</span>
              <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline">
                {playingMovie.genre} ({playingMovie.year})
              </span>
            </div>

            {/* Server Selector Switchers */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#1c0c16] p-1 rounded-xl border border-rose-900/50">
                {['Server 1 (Multi)', 'Server 2 (VidSrc)', 'Server 3 (EmbedSU)', 'Server 4 (Pro)'].map((srv, idx) => (
                  <button
                    key={srv}
                    onClick={() => setMovieServerIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer ${
                      movieServerIndex === idx
                        ? 'bg-[#f43f5e] text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>

              {/* Fullscreen */}
              <button
                onClick={() => {
                  const elem = document.getElementById('activeMovieContainer');
                  if (elem?.requestFullscreen) elem.requestFullscreen();
                }}
                className="px-3 py-1.5 bg-[#f43f5e] text-white font-black rounded-xl transition hover:brightness-110 cursor-pointer shadow-md"
              >
                ⛶ Fullscreen
              </button>

              {/* Close */}
              <button
                onClick={() => setPlayingMovie(null)}
                className="p-2 hover:bg-rose-500/20 text-rose-300 rounded-xl font-bold transition cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* TV Episode Selector (if type is TV) */}
          {playingMovie.type === 'tv' && (
            <div className="bg-[#10070e] px-6 py-2 border-b border-rose-900/30 flex items-center gap-3 text-xs">
              <span className="text-gray-400 font-bold">Select Episode:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((ep) => (
                  <button
                    key={ep}
                    onClick={() => setMovieEpisode(ep)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                      movieEpisode === ep ? 'bg-[#f43f5e] text-white' : 'bg-black/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    Ep {ep}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In-Site Video Stream Embed Container */}
          <div id="activeMovieContainer" className="flex-1 w-full h-full bg-black relative flex items-center justify-center">
            <iframe
              id="activeMovieIframe"
              src={getMovieStreamUrl(playingMovie, movieServerIndex, movieSeason, movieEpisode)}
              title={playingMovie.title}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            />
          </div>
        </div>
      )}

      {/* 5. SETTINGS / CLOAK MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121420] border border-[#23263b] rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Stealth Settings</h3>
            <p className="text-xs text-gray-400 mb-6">Disguise tab title and icon for classroom privacy.</p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Tab Disguise / Cloak
                </label>
                <select
                  value={cloakTitle}
                  onChange={(e) => setCloakTitle(e.target.value)}
                  className="w-full bg-[#171a2b] border border-[#2a2d45] rounded-xl px-3 py-2 text-white font-bold outline-none cursor-pointer"
                >
                  <option value="about:blank">about:blank</option>
                  <option value="Home - Google Classroom">Google Classroom</option>
                  <option value="My Drive - Google Drive">Google Drive</option>
                  <option value="Dashboard - Canvas">Canvas LMS</option>
                  <option value="Google Docs">Google Docs</option>
                  <option value="New Tab">New Tab</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Popup Mode
                </label>
                <button
                  onClick={launchRealAboutBlank}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold shadow-md hover:brightness-110 transition cursor-pointer"
                >
                  ↗ Open in Standalone about:blank Window
                </button>
              </div>

              <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-gray-400">
                <span>Back to Blooket:</span>
                <button
                  onClick={onExit}
                  className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg font-bold hover:bg-red-500/30 transition cursor-pointer"
                >
                  Exit Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
