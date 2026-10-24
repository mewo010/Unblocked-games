import React, { useState, useEffect } from 'react';
import { playClickSound } from '../utils/audio';
import { launchRealAboutBlank } from '../utils/aboutBlank';

interface AboutBlankViewProps {
  onExit: () => void;
  wasOpenedInRealTab?: boolean;
}

export const AboutBlankView: React.FC<AboutBlankViewProps> = ({
  onExit,
  wasOpenedInRealTab = false,
}) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [customNote, setCustomNote] = useState(() => {
    return localStorage.getItem('about_blank_notes') || '';
  });
  const [cloakTitle, setCloakTitle] = useState('about:blank');
  const [activeTab, setActiveTab] = useState<'canvas' | 'terminal' | 'notes'>('canvas');
  const [commandInput, setCommandInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing stealth about:blank environment...',
    'Real browser address bar target: about:blank',
    'Status: Ready. Awaiting user instructions and custom modules.',
  ]);

  // Sync real document title and clock
  useEffect(() => {
    const prevTitle = document.title;
    document.title = cloakTitle;

    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.title = prevTitle;
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cloakTitle, onExit]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const cmd = commandInput.trim();
    setTerminalLogs((prev) => [...prev, `$ ${cmd}`]);

    if (cmd.toLowerCase() === 'help') {
      setTerminalLogs((prev) => [
        ...prev,
        'Available commands: clear, date, status, exit, open',
      ]);
    } else if (cmd.toLowerCase() === 'clear') {
      setTerminalLogs([]);
    } else if (cmd.toLowerCase() === 'exit') {
      onExit();
    } else if (cmd.toLowerCase() === 'open') {
      launchRealAboutBlank();
    } else if (cmd.toLowerCase() === 'date') {
      setTerminalLogs((prev) => [...prev, new Date().toISOString()]);
    } else if (cmd.toLowerCase() === 'status') {
      setTerminalLogs((prev) => [...prev, 'URL: about:blank | System: Ready']);
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        `Noted: "${cmd}". Ready to build custom modules as soon as requested!`,
      ]);
    }
    setCommandInput('');
  };

  const handleLaunchPopup = () => {
    playClickSound();
    launchRealAboutBlank();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090b12] text-gray-200 flex flex-col font-sans select-none overflow-hidden animate-fade-in">
      {/* Top Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0d101b]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>about:blank active</span>
          </div>

          <button
            onClick={handleLaunchPopup}
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
            title="Open in a dedicated new tab with URL about:blank"
          >
            <span>↗ Open Real about:blank Tab</span>
          </button>
        </div>

        {/* Tab Cloaker & Exit */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-bold hidden sm:inline">Disguise:</span>
            <select
              value={cloakTitle}
              onChange={(e) => setCloakTitle(e.target.value)}
              className="bg-[#141824] text-gray-200 text-xs px-2.5 py-1.5 rounded-lg border border-gray-700 outline-none cursor-pointer font-bold"
            >
              <option value="about:blank">about:blank</option>
              <option value="Home - Google Classroom">Google Classroom</option>
              <option value="My Drive - Google Drive">Google Drive</option>
              <option value="Dashboard - Canvas">Canvas LMS</option>
              <option value="New Tab">New Tab</option>
            </select>
          </div>

          <button
            onClick={onExit}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            title="Press ESC or click here"
          >
            Exit (ESC)
          </button>
        </div>
      </header>

      {/* Main Cool UI Workspace */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-between relative bg-radial from-[#151928] via-[#090b12] to-[#06070b]">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Center Hero Section */}
        <div className="relative z-10 w-full max-w-[850px] text-center pt-2">
          {/* Digital Clock */}
          <div className="inline-flex flex-col items-center mb-3">
            <div className="text-4xl sm:text-5xl font-mono font-bold tracking-wider text-cyan-400 drop-shadow-[0_0_16px_rgba(6,182,212,0.4)]">
              {time || '00:00:00'}
            </div>
            <div className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
              {date || 'about:blank'}
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md mb-2">
            about:<span className="text-cyan-400">blank</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-[550px] mx-auto leading-relaxed">
            Genuine stealth page active. Ready for whatever you would like to put here!
          </p>
        </div>

        {/* Central Workspace Card */}
        <div className="relative z-10 w-full max-w-[850px] my-6 bg-[#131622]/90 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Navigation Bar inside the card */}
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2.5 bg-[#0f111a]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'canvas'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Workspace Hub
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Quick Notes
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'terminal'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Terminal
              </button>
            </div>

            <button
              onClick={handleLaunchPopup}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Launch in Tab ↗</span>
            </button>
          </div>

          {/* Tab 1: Workspace Hub */}
          {activeTab === 'canvas' && (
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg mb-4">
                ✨
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Custom Workspace Ready
              </h3>
              <p className="text-sm text-gray-400 max-w-[500px] mb-6 leading-relaxed">
                Code <strong className="text-cyan-300 font-mono">0000</strong> confirmed. The actual address bar will be <span className="font-mono text-cyan-300">about:blank</span>! Tell me what you want placed here (games, tools, proxies, or secret dashboard) and I will code it in.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-[660px] text-left">
                <div className="bg-[#1a1e2e] p-4 rounded-xl border border-gray-800">
                  <div className="text-cyan-400 font-mono text-xs font-bold mb-1">01. REAL URL</div>
                  <div className="text-xs text-gray-300 font-semibold leading-relaxed">
                    Opens a true new browser tab with the actual address bar set to <span className="font-mono text-cyan-300">about:blank</span>.
                  </div>
                </div>
                <div className="bg-[#1a1e2e] p-4 rounded-xl border border-gray-800">
                  <div className="text-purple-400 font-mono text-xs font-bold mb-1">02. DISGUISED</div>
                  <div className="text-xs text-gray-300 font-semibold leading-relaxed">
                    Custom cloak title & icon (Google Classroom, Drive, Docs, Canvas).
                  </div>
                </div>
                <div className="bg-[#1a1e2e] p-4 rounded-xl border border-gray-800">
                  <div className="text-emerald-400 font-mono text-xs font-bold mb-1">03. EXTENSIBLE</div>
                  <div className="text-xs text-gray-300 font-semibold leading-relaxed">
                    Awaiting your instructions for whatever content you want to put here!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Notes / Scratchpad */}
          {activeTab === 'notes' && (
            <div className="p-4 sm:p-6 flex flex-col h-[280px]">
              <div className="flex items-center justify-between mb-2 text-xs font-bold text-gray-400">
                <span>OFFLINE SCRATCHPAD (AUTOSAVED)</span>
                <span>{customNote.length} characters</span>
              </div>
              <textarea
                value={customNote}
                onChange={(e) => {
                  setCustomNote(e.target.value);
                  localStorage.setItem('about_blank_notes', e.target.value);
                }}
                placeholder="Type temporary notes, cheat sheets, or ideas here..."
                className="flex-1 w-full bg-[#0d0f17] border border-gray-800 rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-cyan-500/60 resize-none font-mono"
              />
            </div>
          )}

          {/* Tab 3: Terminal */}
          {activeTab === 'terminal' && (
            <div className="p-4 font-mono text-xs text-left flex flex-col h-[280px]">
              <div className="flex-1 overflow-y-auto space-y-1 mb-2 pr-1 text-gray-300">
                {terminalLogs.map((log, i) => (
                  <div
                    key={i}
                    className={log.startsWith('$') ? 'text-cyan-300 font-bold' : 'text-gray-400'}
                  >
                    {log}
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2 border-t border-gray-800">
                <span className="text-cyan-400 font-bold">$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="type 'help' or enter command..."
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-[11px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-2.5 py-1 rounded transition cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 w-full max-w-[850px] flex items-center justify-between text-xs text-gray-500 py-2 border-t border-gray-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>about:blank Workspace Active</span>
          </div>

          <button
            onClick={onExit}
            className="text-gray-400 hover:text-white hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <span>Return to Blooket Game &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
