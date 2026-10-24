import React from 'react';
import { playClickSound, playPronounceAudio } from '../utils/audio';

interface HeroSectionProps {
  onJoinGame: () => void;
  onSignUp: () => void;
  onLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJoinGame,
  onSignUp,
  onLogin,
}) => {
  const scrollToContent = () => {
    const el = document.getElementById('pageContent');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[92vh] pt-24 pb-12 flex flex-col justify-between overflow-hidden">
      {/* Mobile illustration */}
      <div className="md:hidden flex justify-center pt-4">
        <img
          src="/images/hero-mobile.png"
          alt="Wise Owl Blook instructing class"
          className="w-64 max-h-[260px] object-contain drop-shadow-md"
        />
      </div>

      {/* Desktop Layout: Owl Left, Content Middle, Chicks Right */}
      <div className="max-w-[1200px] w-full mx-auto px-4 flex-1 flex items-center justify-center gap-4 lg:gap-8">
        {/* Left: Wise Owl Blook */}
        <div className="hidden md:flex flex-1 justify-end items-center max-w-[420px]">
          <div className="relative group">
            <div className="absolute -inset-4 bg-teal-100/40 rounded-full blur-2xl group-hover:bg-teal-200/50 transition"></div>
            <img
              src="/images/owl.png"
              alt="Wise Owl Blook"
              className="relative w-full max-w-[340px] lg:max-w-[400px] object-contain animate-blook-float drop-shadow-xl"
            />
          </div>
        </div>

        {/* Center: Hero Call to Action */}
        <div className="w-full max-w-[420px] text-center flex flex-col items-center justify-center py-6 px-2 z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3a3a3a] leading-tight mb-4">
            Fun, free, educational games for everyone!
          </h2>

          <div className="w-full max-w-[320px] flex flex-col gap-3 my-2">
            {/* Main Sign Up Button */}
            <button
              onClick={() => {
                playClickSound();
                onSignUp();
              }}
              className="button w-full"
            >
              <div className="buttonBack"></div>
              <div className="buttonFront text-xl sm:text-2xl py-2">
                Sign up
              </div>
            </button>

            {/* Secondary Buttons Row */}
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  playClickSound();
                  onJoinGame();
                }}
                className="button secondary flex-1"
              >
                <div className="buttonBack"></div>
                <div className="buttonFront text-sm sm:text-base py-1.5 px-2 text-[#32999f] flex items-center justify-center">
                  <img
                    src="/images/play.svg"
                    alt="play"
                    className="w-3.5 mr-1"
                  />
                  <span>Join game</span>
                </div>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onLogin();
                }}
                className="button secondary gray-text flex-1"
              >
                <div className="buttonBack"></div>
                <div className="buttonFront text-sm sm:text-base py-1.5 px-2">
                  Log in
                </div>
              </button>
            </div>

            {/* Pronunciation audio button */}
            <button
              type="button"
              onClick={playPronounceAudio}
              className="mt-1 flex items-center justify-center gap-1.5 text-gray-500 hover:text-[#0bc2cf] transition text-sm font-bold group cursor-pointer"
              title="Click to hear pronunciation"
            >
              <img
                src="/images/volume-up.svg"
                alt="Pronounce"
                className="w-4 h-4 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-transform"
              />
              <span>Pronounced (&ldquo;Blue-kit&rdquo;)</span>
            </button>
          </div>
        </div>

        {/* Right: Chicks Blooks at Desks */}
        <div className="hidden md:flex flex-1 justify-start items-center max-w-[420px]">
          <div className="relative group">
            <div className="absolute -inset-4 bg-amber-100/40 rounded-full blur-2xl group-hover:bg-amber-200/50 transition"></div>
            <img
              src="/images/chicks.png"
              alt="Students represented by Blook Chicks"
              className="relative w-full max-w-[340px] lg:max-w-[400px] object-contain animate-blook-bob drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="w-full flex justify-center pb-2">
        <button
          onClick={scrollToContent}
          className="p-3 hover:translate-y-1 transition-transform cursor-pointer group"
          aria-label="Scroll down"
        >
          <img
            src="/images/down.svg"
            alt="Scroll down"
            className="w-5 h-5 opacity-70 group-hover:opacity-100 animate-bounce"
          />
        </button>
      </div>
    </section>
  );
};
