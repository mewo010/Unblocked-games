// Helper to open a real browser window/tab with the URL "about:blank" and inject the cool UI

export function generateAboutBlankHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>about:blank</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #090b12;
      color: #e2e8f0;
      font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-x: hidden;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
      background-size: 100% 100%, 100% 100%, 32px 32px;
    }
    .mono {
      font-family: 'JetBrains Mono', monospace;
    }
    header {
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(13, 16, 27, 0.7);
      backdrop-filter: blur(12px);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.3);
      color: #38bdf8;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 10px #38bdf8;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .cloak-bar {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cloak-select {
      background: #141824;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      outline: none;
      cursor: pointer;
    }
    .main-content {
      max-width: 960px;
      width: 100%;
      margin: 0 auto;
      padding: 32px 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .clock-display {
      font-size: 42px;
      font-weight: 700;
      color: #38bdf8;
      text-shadow: 0 0 24px rgba(56, 189, 248, 0.4);
      letter-spacing: 2px;
    }
    .date-display {
      font-size: 13px;
      color: #94a3b8;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 4px;
      margin-bottom: 24px;
    }
    .hero-title {
      font-size: 44px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 8px;
      text-align: center;
    }
    .hero-title span {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      font-size: 16px;
      color: #94a3b8;
      text-align: center;
      max-width: 580px;
      margin-bottom: 32px;
      line-height: 1.5;
    }
    .tabs-nav {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.04);
      padding: 4px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .tab-btn {
      padding: 8px 18px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: #38bdf8;
      color: #090b12;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.35);
    }
    .card {
      background: rgba(18, 22, 34, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 32px;
      width: 100%;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(16px);
    }
    .placeholder-box {
      border: 2px dashed rgba(56, 189, 248, 0.35);
      background: rgba(56, 189, 248, 0.03);
      border-radius: 16px;
      padding: 28px;
      text-align: center;
      margin-bottom: 24px;
    }
    .placeholder-box h3 {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .placeholder-box p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
    }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      width: 100%;
      margin-top: 16px;
    }
    .feature-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      padding: 18px;
      border-radius: 14px;
    }
    .feature-item h4 {
      font-size: 12px;
      color: #38bdf8;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .feature-item p {
      font-size: 13px;
      color: #cbd5e1;
      line-height: 1.4;
    }
    textarea {
      width: 100%;
      height: 220px;
      background: #0f131f;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 16px;
      color: #f1f5f9;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      outline: none;
      resize: vertical;
    }
    textarea:focus {
      border-color: #38bdf8;
    }
    .terminal-container {
      background: #0b0e17;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      height: 250px;
      display: flex;
      flex-direction: column;
    }
    .terminal-output {
      flex: 1;
      overflow-y: auto;
      line-height: 1.6;
      color: #94a3b8;
    }
    .terminal-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 10px;
      margin-top: 8px;
    }
    .terminal-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      outline: none;
    }
    footer {
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  </style>
</head>
<body>
  <header>
    <div class="badge mono">
      <span class="pulse-dot"></span>
      <span>about:blank stealth page</span>
    </div>

    <div class="cloak-bar">
      <label for="cloakSelector" style="font-size: 12px; color: #94a3b8; font-weight: 700;">Disguise Tab:</label>
      <select id="cloakSelector" class="cloak-select" onchange="applyCloak(this.value)">
        <option value="about:blank">about:blank</option>
        <option value="Google Classroom">Google Classroom</option>
        <option value="Google Drive">Google Drive</option>
        <option value="Google Docs">Google Docs</option>
        <option value="Canvas LMS">Canvas LMS</option>
        <option value="Edpuzzle">Edpuzzle</option>
        <option value="New Tab">New Tab</option>
      </select>
    </div>
  </header>

  <main class="main-content">
    <div class="clock-display mono" id="clock">00:00:00</div>
    <div class="date-display mono" id="date">LOADING...</div>

    <h1 class="hero-title">Welcome to <span>about:blank</span></h1>
    <p class="hero-desc">
      Your clean slate workspace is active. The actual URL of this browser tab is <strong>about:blank</strong>!
    </p>

    <div class="tabs-nav">
      <button class="tab-btn active" onclick="switchTab('workspace')">Workspace</button>
      <button class="tab-btn" onclick="switchTab('scratchpad')">Quick Notes</button>
      <button class="tab-btn" onclick="switchTab('terminal')">Terminal</button>
    </div>

    <div class="card" id="tab-workspace">
      <div class="placeholder-box">
        <h3>✨ Ready for Your Custom Content</h3>
        <p>
          You triggered code <strong>0000</strong>. Tell me what features, web apps, tools, or games you want to place in this tab, and they will be built right here!
        </p>
      </div>

      <div class="feature-grid">
        <div class="feature-item">
          <h4>01. REAL URL</h4>
          <p>The address bar of this window is genuine <span class="mono" style="color: #38bdf8;">about:blank</span>.</p>
        </div>
        <div class="feature-item">
          <h4>02. DISGUISED</h4>
          <p>Change tab title and icon to Google Classroom or Drive anytime using the selector above.</p>
        </div>
        <div class="feature-item">
          <h4>03. EXTENSIBLE</h4>
          <p>Ready to receive whatever custom tools, unblocked games, or apps you ask for next.</p>
        </div>
      </div>
    </div>

    <div class="card" id="tab-scratchpad" style="display: none;">
      <h3 style="font-size: 16px; margin-bottom: 8px; color: #fff;">Offline Scratchpad</h3>
      <textarea id="notesArea" placeholder="Write cheat sheets, notes, or code here... (autosaved locally)"></textarea>
    </div>

    <div class="card" id="tab-terminal" style="display: none;">
      <div class="terminal-container">
        <div class="terminal-output" id="termOutput">
          <div>Stealth environment initialized.</div>
          <div>Type 'help' for available commands.</div>
        </div>
        <div class="terminal-input-row">
          <span style="color: #38bdf8;">$</span>
          <input type="text" id="termInput" class="terminal-input" placeholder="enter command..." onkeydown="handleTerm(event)">
        </div>
      </div>
    </div>
  </main>

  <footer>
    about:blank Workspace &bull; All data runs client-side
  </footer>

  <script>
    function updateClock() {
      const now = new Date();
      document.getElementById('clock').textContent = now.toLocaleTimeString();
      document.getElementById('date').textContent = now.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
      });
    }
    setInterval(updateClock, 1000);
    updateClock();

    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      document.getElementById('tab-workspace').style.display = tabId === 'workspace' ? 'block' : 'none';
      document.getElementById('tab-scratchpad').style.display = tabId === 'scratchpad' ? 'block' : 'none';
      document.getElementById('tab-terminal').style.display = tabId === 'terminal' ? 'block' : 'none';
    }

    const cloaks = {
      'about:blank': { title: 'about:blank', icon: '🌐' },
      'Google Classroom': { title: 'Home - Google Classroom', icon: '🏫' },
      'Google Drive': { title: 'My Drive - Google Drive', icon: '📁' },
      'Google Docs': { title: 'Google Docs', icon: '📄' },
      'Canvas LMS': { title: 'Dashboard - Canvas', icon: '🎓' },
      'Edpuzzle': { title: 'Edpuzzle', icon: '🧩' },
      'New Tab': { title: 'New Tab', icon: '🔍' }
    };

    function applyCloak(name) {
      const c = cloaks[name] || cloaks['about:blank'];
      document.title = c.title;
      const link = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>" + c.icon + "</text></svg>";
      }
    }

    const notesArea = document.getElementById('notesArea');
    notesArea.value = localStorage.getItem('about_blank_notes') || '';
    notesArea.addEventListener('input', () => {
      localStorage.setItem('about_blank_notes', notesArea.value);
    });

    function handleTerm(e) {
      if (e.key === 'Enter') {
        const input = document.getElementById('termInput');
        const cmd = input.value.trim();
        if (!cmd) return;
        const out = document.getElementById('termOutput');
        
        const line = document.createElement('div');
        line.style.color = '#38bdf8';
        line.textContent = '$ ' + cmd;
        out.appendChild(line);

        const resp = document.createElement('div');
        if (cmd === 'help') {
          resp.textContent = 'Commands: clear, date, status, notes, help';
        } else if (cmd === 'clear') {
          out.innerHTML = '';
          input.value = '';
          return;
        } else if (cmd === 'date') {
          resp.textContent = new Date().toString();
        } else if (cmd === 'status') {
          resp.textContent = 'URL: about:blank | System: Operational';
        } else {
          resp.textContent = 'Command executed: ' + cmd;
        }
        out.appendChild(resp);
        out.scrollTop = out.scrollHeight;
        input.value = '';
      }
    }
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
