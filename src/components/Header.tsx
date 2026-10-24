import React, { useState, useEffect } from 'react';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  onJoinGame: () => void;
  onHostGame: () => void;
  onDiscover: () => void;
  onBlooksLocker: () => void;
  onLogin: () => void;
  onSignUp: () => void;
  tokens: number;
}

export const Header: React.FC<HeaderProps> = ({
  onJoinGame,
  onHostGame,
  onDiscover,
  onBlooksLocker,
  onLogin,
  onSignUp,
  tokens,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 ${
        scrolled ? 'h-20 shadow-md border-b-2 border-[#dcdcdc]' : 'h-24'
      }`}
    >
      <div className="max-w-[1100px] h-full mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-titan text-white bg-[#0bc2cf] px-4 py-1.5 rounded-lg text-3xl sm:text-4xl shadow-[3px_3px_0px_rgba(0,0,0,0.18)] hover:brightness-105 transition-transform active:scale-95 no-underline flex items-center gap-1"
          >
            B<span className="hidden sm:inline">looket</span>
          </a>

          {/* Quick Nav Badges */}
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                onDiscover();
              }}
              className="px-3 py-1.5 text-sm font-extrabold text-gray-600 hover:text-[#0bc2cf] hover:bg-gray-100 rounded-lg transition"
            >
              Discover
            </button>
            <button
              onClick={() => {
                playClickSound();
                onHostGame();
              }}
              className="px-3 py-1.5 text-sm font-extrabold text-gray-600 hover:text-[#9a49aa] hover:bg-gray-100 rounded-lg transition"
            >
              Host
            </button>
            <button
              onClick={() => {
                playClickSound();
                onBlooksLocker();
              }}
              className="px-3 py-1.5 text-sm font-extrabold text-gray-600 hover:text-[#f5a623] hover:bg-gray-100 rounded-lg transition flex items-center gap-1.5"
            >
              <span>Blooks</span>
              <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full font-black border border-amber-300">
                🪙 {tokens}
              </span>
            </button>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Join Game Button */}
          <button
            onClick={() => {
              playClickSound();
              onJoinGame();
            }}
            className="button secondary"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront flex items-center text-sm sm:text-lg text-[#32999f] py-1 px-3 sm:px-4">
              <img
                src="/images/play-blue.svg"
                alt="play-blue"
                className="w-3.5 sm:w-4 mr-1.5"
              />
              <span className="hidden sm:inline">Join a game</span>
              <span className="sm:hidden">Join</span>
            </div>
          </button>

          {/* Host Game Button (Mobile / Tablet) */}
          <button
            onClick={() => {
              playClickSound();
              onHostGame();
            }}
            className="button purple-btn hidden md:inline-block"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront text-sm sm:text-base py-1 px-3.5">
              Host
            </div>
          </button>

          {/* Log In Button */}
          <button
            onClick={() => {
              playClickSound();
              onLogin();
            }}
            className="button secondary gray-text hidden sm:inline-block"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront text-sm sm:text-base py-1 px-3">
              Log in
            </div>
          </button>

          {/* Sign Up Button */}
          <button
            onClick={() => {
              playClickSound();
              onSignUp();
            }}
            className="button"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront text-sm sm:text-base py-1 px-3 sm:px-4">
              Sign up
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
