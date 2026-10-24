// Helper to open a real browser window/tab with the URL "about:blank" and inject the cool UI

export function generateAboutBlankHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>about:blank</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=JetBrains+Mono:wght@400;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0c0d14;
      color: #e2e8f0;
      font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      background: #11131f;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-title {
      font-family: 'Caveat', cursive;
      font-size: 32px;
      color: #fff;
    }
    .badge {
      background: #7c3aed;
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 9999px;
    }
    .search-box {
      flex: 1;
      max-width: 550px;
      margin: 0 20px;
      position: relative;
    }
    .search-input {
      width: 100%;
      background: #1a1d2e;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      padding: 10px 20px;
      color: #fff;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    }
    .search-input:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
    }
    .nav-tabs {
      display: flex;
      gap: 8px;
    }
    .nav-tab-btn {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background: rgba(255, 255, 255, 0.05);
      color: #94a3b8;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-tab-btn.active, .nav-tab-btn:hover {
      background: #7c3aed;
      color: #fff;
    }
    .main-wrap {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      flex: 1;
    }
    .section-title {
      font-size: 18px;
      font-weight: 800;
      color: #f1f5f9;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .game-card {
      background: #151828;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }
    .game-card:hover {
      transform: translateY(-4px);
      border-color: #8b5cf6;
      box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.3);
    }
    .game-thumb {
      width: 100%;
      height: 120px;
      object-fit: cover;
      background: #0f111d;
    }
    .game-info {
      padding: 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .game-name {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }
    .game-cat {
      font-size: 11px;
      color: #8b5cf6;
      font-weight: 700;
      text-transform: uppercase;
    }
    .iframe-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 100;
      display: none;
      flex-direction: column;
    }
    .modal-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      background: #11131f;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .modal-frame {
      flex: 1;
      width: 100%;
      border: none;
      background: #000;
    }
    .action-btn {
      background: #7c3aed;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 6px 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .movie-banner {
      background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%);
      border: 1px solid #7c3aed;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="logo-area">
      <span class="brand-title">games</span>
      <span class="badge" id="gameCount">40+</span>
    </div>

    <div class="search-box">
      <input type="text" id="omniInput" class="search-input" placeholder="Search games, movies or paste URL to browse...">
    </div>

    <div class="nav-tabs">
      <button class="nav-tab-btn active" onclick="showTab('games')">🎮 Games</button>
      <button class="nav-tab-btn" onclick="showTab('movies')">🎬 Cinejoy Movies</button>
      <button class="nav-tab-btn" onclick="showTab('browser')">🌐 Web Browser</button>
    </div>
  </div>

  <div class="main-wrap">
    <!-- GAMES TAB -->
    <div id="tab-games">
      <div class="section-title">⭐ Featured Unblocked Games</div>
      <div class="grid" id="gamesGrid"></div>
    </div>

    <!-- MOVIES TAB -->
    <div id="tab-movies" style="display: none;">
      <div class="movie-banner">
        <div>
          <h2 style="font-size: 24px; font-weight: 900; color: #fff;">🎬 Cinejoy.pk Stream Portal</h2>
          <p style="color: #c4b5fd; margin-top: 4px; font-size: 14px;">Watch trending blockbusters and movies powered by Cinejoy.pk</p>
        </div>
        <a href="https://cinejoy.pk" target="_blank" class="action-btn" style="text-decoration: none; padding: 10px 20px; font-size: 14px;">Open Cinejoy.pk ↗</a>
      </div>
      <div class="section-title">🍿 Trending Movies on Cinejoy</div>
      <div class="grid" id="moviesGrid"></div>
    </div>

    <!-- BROWSER TAB -->
    <div id="tab-browser" style="display: none; height: 80vh; flex-direction: column;">
      <iframe id="browserFrame" src="https://duckduckgo.com" style="width: 100%; height: 100%; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; background: #fff;"></iframe>
    </div>
  </div>

  <!-- PLAY MODAL -->
  <div class="iframe-modal" id="playModal">
    <div class="modal-bar">
      <span id="modalGameTitle" style="font-weight: 800; font-size: 16px;">Playing</span>
      <div style="display: flex; gap: 8px;">
        <button class="action-btn" onclick="toggleFullScreen()">⛶ Fullscreen</button>
        <button class="action-btn" style="background: #ef4444;" onclick="closePlayModal()">✕ Close</button>
      </div>
    </div>
    <iframe id="gameIframe" class="modal-frame" allow="autoplay; fullscreen; gamepad"></iframe>
  </div>

  <script>
    const GAMES = [
      { id: 'stickman-hook', title: 'Stickman Hook', category: 'Physics', url: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/bobydob/bobbydob.github.io@master/stickman-hook/index.xml', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80' },
      { id: 'paper-io-2', title: 'Paper.io 2', category: 'IO', url: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/bobydob/bobbydob.github.io@master/paper-io-2/index.xml', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
      { id: 'slope', title: 'Slope', category: 'Runner', url: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/bobydob/bobbydob.github.io@master/slope/index.xml', thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80' },
      { id: 'drive-mad', title: 'Drive Mad', category: 'Racing', url: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/bobydob/bobbydob.github.io@master/drive-mad/index.xml', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80' },
      { id: 'retro-bowl', title: 'Retro Bowl', category: 'Sports', url: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/bobydob/bobbydob.github.io@master/retro-bowl/index.xml', thumbnail: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&q=80' },
      { id: 'shell-shockers', title: 'Shell Shockers', category: 'Shooter', url: 'https://shellshock.io/', thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80' },
      { id: 'happy-wheels', title: 'Happy Wheels', category: 'Physics', url: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/bobydob/bobbydob.github.io@master/happy-wheels/index.xml', thumbnail: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&q=80' },
      { id: 'crossy-road', title: 'Crossy Road', category: 'Arcade', url: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/bobydob/bobbydob.github.io@master/crossy-road/index.xml', thumbnail: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&q=80' },
      { id: 'cookie-clicker', title: 'Cookie Clicker', category: 'Idle', url: 'https://orteil.dashnet.org/cookieclicker/', thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80' },
      { id: 'fnaf', title: 'Five Nights at Freddy\\'s', category: 'Horror', url: 'https://images-opensocial.googleusercontent.com/gadgets/ifr?url=https://cdn.jsdelivr.net/gh/bobydob/bobbydob.github.io@master/fnaf/index.xml', thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80' }
    ];

    const MOVIES = [
      { title: 'Deadpool & Wolverine', genre: 'Action / Sci-Fi', year: '2024', tmdbId: '533535', poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg' },
      { title: 'Dune: Part Two', genre: 'Sci-Fi / Adventure', year: '2024', tmdbId: '693134', poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
      { title: 'Inside Out 2', genre: 'Animation / Comedy', year: '2024', tmdbId: '1022789', poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg' },
      { title: 'Spider-Man: Across the Spider-Verse', genre: 'Animation', year: '2023', tmdbId: '569094', poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
      { title: 'Oppenheimer', genre: 'Biography / Drama', year: '2023', tmdbId: '872585', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
      { title: 'Alien: Romulus', genre: 'Horror / Sci-Fi', year: '2024', tmdbId: '945961', poster: 'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao8l3urQzxNi8mF.jpg' },
      { title: 'Avengers: Endgame', genre: 'Action / Fantasy', year: '2019', tmdbId: '299534', poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
      { title: 'Interstellar', genre: 'Sci-Fi / Drama', year: '2014', tmdbId: '157336', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' }
    ];

    function renderGames() {
      const grid = document.getElementById('gamesGrid');
      grid.innerHTML = GAMES.map(g => \`
        <div class="game-card" onclick="playGame('\${g.url}', '\${g.title}')">
          <img src="\${g.thumbnail}" class="game-thumb" alt="\${g.title}">
          <div class="game-info">
            <div class="game-name">\${g.title}</div>
            <div class="game-cat">\${g.category}</div>
          </div>
        </div>
      \`).join('');
    }

    function renderMovies() {
      const grid = document.getElementById('moviesGrid');
      grid.innerHTML = MOVIES.map(m => \`
        <div class="game-card" onclick="playGame('https://multiembed.mov/?video_id=' + m.tmdbId + '&tmdb=1', '\${m.title}')">
          <img src="\${m.poster}" class="game-thumb" alt="\${m.title}">
          <div class="game-info">
            <div class="game-name">\${m.title} (\${m.year})</div>
            <div class="game-cat">\${m.genre}</div>
          </div>
        </div>
      \`).join('');
    }

    function showTab(tab) {
      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('tab-games').style.display = tab === 'games' ? 'block' : 'none';
      document.getElementById('tab-movies').style.display = tab === 'movies' ? 'block' : 'none';
      document.getElementById('tab-browser').style.display = tab === 'browser' ? 'flex' : 'none';
    }

    function playGame(url, title) {
      document.getElementById('modalGameTitle').textContent = title;
      document.getElementById('gameIframe').src = url;
      document.getElementById('playModal').style.display = 'flex';
    }

    function closePlayModal() {
      document.getElementById('gameIframe').src = 'about:blank';
      document.getElementById('playModal').style.display = 'none';
    }

    function toggleFullScreen() {
      const frame = document.getElementById('gameIframe');
      if (frame.requestFullscreen) frame.requestFullscreen();
    }

    document.getElementById('omniInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = e.target.value.trim();
        if (!val) return;
        showTab('browser');
        if (val.startsWith('http')) {
          document.getElementById('browserFrame').src = val;
        } else if (val.includes('.') && !val.includes(' ')) {
          document.getElementById('browserFrame').src = 'https://' + val;
        } else {
          document.getElementById('browserFrame').src = 'https://duckduckgo.com/?q=' + encodeURIComponent(val);
        }
      }
    });

    renderGames();
    renderMovies();
  </script>
</body>
</html>`;
}

export function launchRealAboutBlank(): boolean {
  try {
    const win = window.open('about:blank', '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      return false;
    }
    win.document.open();
    win.document.write(generateAboutBlankHTML());
    win.document.close();
    return true;
  } catch {
    return false;
  }
}
