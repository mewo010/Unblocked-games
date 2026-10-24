import React, { useState } from 'react';
import { Blook, QuestionSet } from '../types/blooket';
import { BLOOKS, INITIAL_QUESTION_SETS } from '../data/blooketData';
import { playClickSound } from '../utils/audio';
import { launchRealAboutBlank } from '../utils/aboutBlank';

interface PlayBlooketJoinViewProps {
  onBackToHome: () => void;
  onEnterAboutBlank: () => void;
  onStartGame: (params: {
    questionSet: QuestionSet;
    playerBlook: Blook;
    nickname: string;
    gameMode: 'Gold Quest' | 'Classic';
  }) => void;
}

export const PlayBlooketJoinView: React.FC<PlayBlooketJoinViewProps> = ({
  onBackToHome,
  onEnterAboutBlank,
  onStartGame,
}) => {
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedBlook, setSelectedBlook] = useState<Blook>(BLOOKS[0]);
  const [gameMode, setGameMode] = useState<'Gold Quest' | 'Classic'>('Gold Quest');
  const [selectedSet, setSelectedSet] = useState<QuestionSet>(INITIAL_QUESTION_SETS[0]);
  const [step, setStep] = useState<'pin' | 'nickname'>('pin');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (!cleanPin) return;

    // Secret trigger: code 0000 -> launch real about:blank tab with actual about:blank URL
    if (cleanPin === '0000') {
      playClickSound();
      launchRealAboutBlank();
      onEnterAboutBlank();
      return;
    }

    if (cleanPin.length < 4) {
      setErrorMsg('Game ID must be at least 4 digits');
      return;
    }

    playClickSound();
    setErrorMsg('');
    setStep('nickname');
  };

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setErrorMsg('Please enter a nickname');
      return;
    }

    playClickSound();
    onStartGame({
      questionSet: selectedSet,
      playerBlook: selectedBlook,
      nickname: nickname.trim(),
      gameMode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#292929] select-none font-nunito">
      {/* Background with the extracted authentic Blooket checkerboard pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#292929]">
        <div
          className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 rotate-[15deg] opacity-[0.07] bg-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/images/BlookCheckers-e975c505.png')",
            backgroundSize: '550px',
          }}
        />
      </div>

      {/* Official Blooket Top Header Bar */}
      <div className="relative z-10 w-full h-[55px] bg-[#9a49aa] shadow-[inset_0_-6px_rgba(0,0,0,0.2)] px-5 flex items-center justify-between text-white">
        {/* Left: Blooket Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              onBackToHome();
            }}
            className="font-titan text-3xl text-white hover:opacity-90 transition cursor-pointer"
            title="Return to Blooket Homepage"
          >
            Blooket
          </button>
        </div>

        {/* Center: Join a Game */}
        <div className="absolute left-1/2 -translate-x-1/2 font-bold text-xl sm:text-2xl tracking-wide select-none">
          Join a Game
        </div>

        {/* Right: Home / Log In Link */}
        <div className="flex items-center gap-4 text-base sm:text-lg font-bold">
          <button
            onClick={() => {
              playClickSound();
              onBackToHome();
            }}
            className="hover:underline text-white cursor-pointer"
          >
            Home
          </button>
        </div>
      </div>

      {/* Main Join Game Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {step === 'pin' ? (
          /* Step 1: Game ID Entry (exact replica of extracted play.blooket.com form) */
          <form
            onSubmit={handlePinSubmit}
            className="flex flex-col items-center justify-center max-w-[480px] w-full animate-fade-in"
          >
            {/* Big 80px Title */}
            <h1 className="font-titan text-6xl sm:text-8xl text-white text-center drop-shadow-[4px_4px_rgba(0,0,0,0.25)] mb-8 select-none">
              Blooket
            </h1>

            {/* Input Row: Input box + Arrow Button */}
            <div className="flex items-center justify-center gap-3 w-full">
              <div className="shadow-[inset_0_-6px_rgba(0,0,0,0.2),0_0_4px_rgba(0,0,0,0.15)] rounded-lg bg-white h-[60px] w-[210px] sm:w-[240px] flex items-center justify-center overflow-hidden">
                <input
                  type="tel"
                  maxLength={7}
                  autoFocus
                  value={pin}
                  onChange={(e) => {
                    setErrorMsg('');
                    setPin(e.target.value.replace(/\D/g, ''));
                  }}
                  placeholder="Game ID"
                  aria-label="Enter Game ID"
                  className="w-full h-full text-center text-3xl sm:text-4xl font-bold text-[#5f5f5f] outline-none bg-transparent placeholder-[#8f8f8f]"
                />
              </div>

              {/* Submit Arrow Button */}
              <button
                type="submit"
                aria-label="Submit"
                className="shadow-[inset_0_-6px_rgba(0,0,0,0.2),0_0_4px_rgba(0,0,0,0.15)] rounded-lg bg-white h-[60px] w-[60px] flex items-center justify-center cursor-pointer hover:scale-95 transition-transform active:translate-y-1 text-[#5f5f5f] hover:text-[#0bc2cf]"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="w-6 h-6 fill-current"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                </svg>
              </button>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mt-4 text-rose-400 font-bold text-sm bg-black/40 px-4 py-1.5 rounded-xl border border-rose-500/30">
                {errorMsg}
              </div>
            )}

            {/* Hint / Helper */}
            <div className="mt-8 text-center text-gray-400 text-xs sm:text-sm font-semibold max-w-[340px]">
              Enter Game ID to join &bull; Tip: Enter{' '}
              <button
                type="button"
                onClick={() => setPin('0000')}
                className="text-[#0bc2cf] font-mono font-black underline hover:text-cyan-300 cursor-pointer"
              >
                0000
              </button>{' '}
              for <span className="font-mono text-cyan-300">about:blank</span>
            </div>
          </form>
        ) : (
          /* Step 2: Nickname & Blook Selection */
          <form
            onSubmit={handleNicknameSubmit}
            className="flex flex-col items-center justify-center max-w-[480px] w-full animate-fade-in"
          >
            <h1 className="font-titan text-5xl sm:text-7xl text-white text-center drop-shadow-[4px_4px_rgba(0,0,0,0.25)] mb-4 select-none">
              Blooket
            </h1>

            {/* Nickname Input Row */}
            <div className="flex items-center justify-center gap-3 w-full mb-4">
              <div className="shadow-[inset_0_-6px_rgba(0,0,0,0.2),0_0_4px_rgba(0,0,0,0.15)] rounded-lg bg-white h-[60px] w-[260px] sm:w-[300px] flex items-center justify-center overflow-hidden">
                <input
                  type="text"
                  maxLength={15}
                  autoFocus
                  value={nickname}
                  onChange={(e) => {
                    setErrorMsg('');
                    setNickname(e.target.value);
                  }}
                  placeholder="Nickname"
                  aria-label="Enter Nickname"
                  className="w-full h-full text-center text-2xl sm:text-3xl font-bold text-[#5f5f5f] outline-none bg-transparent placeholder-[#8f8f8f]"
                />
              </div>

              <button
                type="submit"
                aria-label="Submit"
                className="shadow-[inset_0_-6px_rgba(0,0,0,0.2),0_0_4px_rgba(0,0,0,0.15)] rounded-lg bg-white h-[60px] w-[60px] flex items-center justify-center cursor-pointer hover:scale-95 transition-transform active:translate-y-1 text-[#5f5f5f] hover:text-[#0bc2cf]"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="w-6 h-6 fill-current"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                </svg>
              </button>
            </div>

            {/* Blook avatar selection */}
            <div className="w-full max-w-[370px] bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 mb-4">
              <div className="text-xs font-black uppercase text-gray-300 text-center mb-2">
                Choose Your Avatar
              </div>
              <div className="grid grid-cols-5 gap-2 max-h-[110px] overflow-y-auto p-1">
                {BLOOKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedBlook(b);
                    }}
                    className={`p-1.5 rounded-xl text-center flex flex-col items-center transition border-2 ${
                      selectedBlook.id === b.id
                        ? 'border-[#0bc2cf] bg-cyan-900/60 scale-105 shadow'
                        : 'border-transparent hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{b.emoji}</span>
                    <span className="text-[9px] font-bold text-gray-200 truncate w-full">
                      {b.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode selection */}
            <div className="flex gap-2 w-full max-w-[370px] mb-4">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setGameMode('Gold Quest');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition ${
                  gameMode === 'Gold Quest'
                    ? 'bg-amber-400 text-amber-950 border-amber-300 shadow'
                    : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
                }`}
              >
                🪙 Gold Quest
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setGameMode('Classic');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition ${
                  gameMode === 'Classic'
                    ? 'bg-[#0bc2cf] text-white border-cyan-300 shadow'
                    : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
                }`}
              >
                ⚡ Classic Speed
              </button>
            </div>

            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setStep('pin');
              }}
              className="text-xs text-gray-400 hover:text-white font-bold transition hover:underline"
            >
              &larr; Change Game ID
            </button>
          </form>
        )}
      </div>

      {/* Bottom Bar Footer info */}
      <div className="relative z-10 w-full py-3 text-center text-xs text-gray-500">
        Blooket &bull; Matching Action With Education
      </div>
    </div>
  );
};
