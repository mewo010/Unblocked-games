import React from 'react';
import { playClickSound } from '../utils/audio';

interface FeaturesSectionsProps {
  onSignUp: () => void;
  onJoinGame: () => void;
  onDiscover: () => void;
}

export const FeaturesSections: React.FC<FeaturesSectionsProps> = ({
  onSignUp,
  onJoinGame,
  onDiscover,
}) => {
  return (
    <div id="pageContent" className="w-full">
      {/* 3 Main Feature Rows */}
      <div className="max-w-[1000px] mx-auto px-4 py-8 flex flex-col gap-16 md:gap-24">
        {/* Feature 1: Easy Setup */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#5c5c5c] leading-tight mb-4">
              Easy Setup, <br />
              Lasting Results
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
              Find a question set from our library or create your own. Then, get started with a live or asynchronous game in just a few clicks!
            </p>
            <button
              onClick={() => {
                playClickSound();
                onDiscover();
              }}
              className="button secondary"
            >
              <div className="buttonBack"></div>
              <div className="buttonFront text-base py-1 px-4">
                Explore Library
              </div>
            </button>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative group max-w-[420px] w-full">
              <img
                src="/images/question.png"
                alt="Pig Blook bounces on multiple choice questions"
                className="w-full h-auto object-contain animate-blook-bounce drop-shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/question-fallback.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Feature 2: Instant Feedback (Reverse) */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative group max-w-[420px] w-full">
              <img
                src="/images/graph.png"
                alt="Rabbit Blook bounces over bar charts"
                className="w-full h-auto object-contain animate-blook-float drop-shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/graph-fallback.png';
                }}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#5c5c5c] leading-tight mb-4">
              Instant Feedback
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Ensure every student is on track with detailed reports at the end of each game. Identify knowledge gaps and guide students toward success.
            </p>
          </div>
        </div>

        {/* Feature 3: Free, Fresh, and Fun */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#5c5c5c] leading-tight mb-4">
              Free, Fresh, and <br />
              Fun
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
              Keep your students engaged with our ever-expanding library of game modes. We&apos;re always working on new ways to make learning fun!
            </p>
            <button
              onClick={() => {
                playClickSound();
                onJoinGame();
              }}
              className="button"
            >
              <div className="buttonBack"></div>
              <div className="buttonFront text-base py-1 px-4">
                Play A Game Mode
              </div>
            </button>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative group max-w-[420px] w-full">
              <img
                src="/images/wizard.png"
                alt="Wizard Blook blends items in a magical cauldron"
                className="w-full h-auto object-contain animate-blook-bob drop-shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/wizard-fallback.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Break Section: Serious Learning, Serious Fun */}
      <section className="relative my-16 py-20 px-4 bg-[#77518f] overflow-hidden text-center text-white flex flex-col items-center justify-center min-h-[460px]">
        {/* Subtle checkerboard background */}
        <div
          className="absolute inset-0 opacity-10 bg-repeat bg-center pointer-events-none scale-125"
          style={{ backgroundImage: "url('/images/BlookCheckers.png')", backgroundSize: '400px' }}
        ></div>

        <div className="relative z-10 max-w-[700px] mx-auto flex flex-col items-center">
          <h2 className="font-titan text-3xl sm:text-5xl leading-tight text-white mb-4 drop-shadow-md">
            Serious Learning. Serious Fun.
          </h2>
          <p className="text-lg sm:text-2xl text-purple-100 max-w-[550px] mb-8 font-semibold">
            Join the millions of educators around the world who have already discovered the power of Blooket!
          </p>

          <button
            onClick={() => {
              playClickSound();
              onSignUp();
            }}
            className="button secondary"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront text-xl py-2 px-8 text-[#411060]">
              Get started
            </div>
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-[1000px] mx-auto px-4 py-12">
        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#5c5c5c] text-center mb-12">
          How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition">
            <div className="w-full h-44 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-2 shadow-sm">
              <img
                src="/images/howitworks1.png"
                alt="Get a question set"
                className="max-h-full object-contain"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0bc2cf] text-white font-black flex items-center justify-center mb-2 text-sm shadow">
              1
            </div>
            <h4 className="text-xl font-bold text-[#3a3a3a] mb-1">Get a question set</h4>
            <p className="text-sm text-gray-500">Pick from millions of community sets or create your own custom questions.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition">
            <div className="w-full h-44 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-2 shadow-sm">
              <img
                src="/images/howitworks2.png"
                alt="Choose a game mode"
                className="max-h-full object-contain"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#9a49aa] text-white font-black flex items-center justify-center mb-2 text-sm shadow">
              2
            </div>
            <h4 className="text-xl font-bold text-[#3a3a3a] mb-1">Choose a game mode</h4>
            <p className="text-sm text-gray-500">Play Gold Quest, Classic, Tower Defense, or Monster Brawl.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition">
            <div className="w-full h-44 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-2 shadow-sm">
              <img
                src="/images/howitworks3.png"
                alt="Play, learn, and analyze"
                className="max-h-full object-contain"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#3bb528] text-white font-black flex items-center justify-center mb-2 text-sm shadow">
              3
            </div>
            <h4 className="text-xl font-bold text-[#3a3a3a] mb-1">Play, learn, and analyze</h4>
            <p className="text-sm text-gray-500">Engage your entire class and review individual progress in real time.</p>
          </div>
        </div>
      </section>

      {/* Feature 4: Engagement for Everyone (Walrus) */}
      <div className="max-w-[1000px] mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#5c5c5c] leading-tight mb-4">
              Engagement for Everyone
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
              Blooket&apos;s gameplay is designed for students from early elementary to high school and beyond!
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full">Elementary</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">Middle School</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">High School</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">College & Beyond</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative group max-w-[380px] w-full">
              <img
                src="/images/fishing.png"
                alt="Walrus Blook drifts while fishing"
                className="w-full h-auto object-contain animate-blook-float drop-shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/fishing-fallback.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
