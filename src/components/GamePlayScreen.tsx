import React, { useState, useEffect } from 'react';
import { Blook, QuestionSet } from '../types/blooket';
import {
  playCorrectSound,
  playWrongSound,
  playChestOpenSound,
  playClickSound,
} from '../utils/audio';

interface GamePlayScreenProps {
  questionSet: QuestionSet;
  playerBlook: Blook;
  nickname: string;
  gameMode: 'Gold Quest' | 'Classic';
  onExit: (earnedTokens: number) => void;
}

interface RivalBot {
  id: string;
  name: string;
  blookName: string;
  emoji: string;
  gold: number;
}

export const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  questionSet,
  playerBlook,
  nickname,
  gameMode,
  onExit,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gold, setGold] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Gold Quest state
  const [showChests, setShowChests] = useState(false);
  const [openedChest, setOpenedChest] = useState<number | null>(null);
  const [chestPrize, setChestPrize] = useState<{ text: string; effect: string } | null>(null);

  // Leaderboard rivals
  const [rivals, setRivals] = useState<RivalBot[]>([
    { id: '1', name: 'SpeedyChick', blookName: 'Chick', emoji: '🐥', gold: 120 },
    { id: '2', name: 'MagicWiz', blookName: 'Wizard', emoji: '🧙', gold: 90 },
    { id: '3', name: 'SeaCaptain', blookName: 'Walrus', emoji: '🦭', gold: 60 },
    { id: '4', name: 'NightOwl', blookName: 'Wise Owl', emoji: '🦉', gold: 40 },
  ]);

  const [gameOver, setGameOver] = useState(false);

  const currentQ = questionSet.questions[currentIdx];

  // Colors for 4 choices in classic Blooket style
  const optionColors = [
    { bg: 'bg-[#e53935]', back: 'bg-[#b71c1c]', text: 'text-white' }, // Red
    { bg: 'bg-[#1e88e5]', back: 'bg-[#1565c0]', text: 'text-white' }, // Blue
    { bg: 'bg-[#ff9800]', back: 'bg-[#e65100]', text: 'text-white' }, // Orange
    { bg: 'bg-[#43a047]', back: 'bg-[#2e7d32]', text: 'text-white' }, // Green
  ];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (gameMode === 'Gold Quest') {
        setShowChests(true);
      } else {
        // Classic mode points
        const points = 100 + newStreak * 25;
        setGold((prev) => prev + points);
        setTimeout(handleNextQuestion, 1600);
      }
    } else {
      playWrongSound();
      setStreak(0);
      setTimeout(handleNextQuestion, 2000);
    }

    // Update rival bots slightly
    setRivals((prev) =>
      prev.map((bot) => {
        const botScoreDelta = Math.random() > 0.4 ? Math.floor(Math.random() * 80) + 20 : 0;
        return { ...bot, gold: bot.gold + botScoreDelta };
      })
    );
  };

  const handleOpenChest = (chestIdx: number) => {
    if (openedChest !== null) return;
    setOpenedChest(chestIdx);
    playChestOpenSound();

    // Random chest rewards
    const rewards = [
      { text: '+150 Gold!', effect: 'add_150', delta: 150 },
      { text: '+300 Gold!', effect: 'add_300', delta: 300 },
      { text: 'DOUBLE GOLD (2X)!', effect: 'double', delta: gold },
      { text: 'Steal 25% from Leader!', effect: 'steal', delta: 100 },
      { text: '+75 Gold!', effect: 'add_75', delta: 75 },
      { text: '+500 JACKPOT GOLD!', effect: 'jackpot', delta: 500 },
    ];

    const pick = rewards[Math.floor(Math.random() * rewards.length)];
    setChestPrize(pick);

    if (pick.effect === 'double') {
      setGold((prev) => (prev > 0 ? prev * 2 : 150));
    } else if (pick.effect === 'steal') {
      const topRival = [...rivals].sort((a, b) => b.gold - a.gold)[0];
      const stolen = Math.max(50, Math.floor(topRival.gold * 0.25));
      setGold((prev) => prev + stolen);
      setRivals((prev) =>
        prev.map((r) => (r.id === topRival.id ? { ...r, gold: Math.max(0, r.gold - stolen) } : r))
      );
    } else {
      setGold((prev) => prev + pick.delta);
    }

    setTimeout(() => {
      setShowChests(false);
      setOpenedChest(null);
      setChestPrize(null);
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    if (currentIdx + 1 < questionSet.questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  // Sort overall standings
  const allStandings = [
    { id: 'player', name: nickname, blookName: playerBlook.name, emoji: playerBlook.emoji, gold, isPlayer: true },
    ...rivals.map((r) => ({ ...r, isPlayer: false })),
  ].sort((a, b) => b.gold - a.gold);

  if (gameOver) {
    const earnedTokens = Math.max(10, Math.floor(gold / 10));
    const playerRank = allStandings.findIndex((s) => s.isPlayer) + 1;

    return (
      <div className="fixed inset-0 z-50 bg-[#411060] text-white flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-[550px] w-full text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-6xl mb-2 animate-bounce">
            {playerRank === 1 ? '🏆' : playerRank === 2 ? '🥈' : playerRank === 3 ? '🥉' : '🎖️'}
          </div>
          <h2 className="font-titan text-4xl mb-1">
            {playerRank === 1 ? '1ST PLACE VICTORY!' : `Rank #${playerRank}`}
          </h2>
          <p className="text-purple-200 text-lg mb-6">Game Over! Fantastic review round!</p>

          <div className="grid grid-cols-3 gap-3 mb-6 bg-black/20 p-4 rounded-2xl">
            <div>
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider">Total Gold</div>
              <div className="text-3xl font-black text-amber-300">🪙 {gold}</div>
            </div>
            <div>
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider">Tokens Won</div>
              <div className="text-3xl font-black text-emerald-400">✨ +{earnedTokens}</div>
            </div>
            <div>
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider">Final Streak</div>
              <div className="text-3xl font-black text-rose-400">🔥 {streak}</div>
            </div>
          </div>

          <div className="bg-black/30 rounded-2xl p-4 mb-8 text-left max-h-[180px] overflow-y-auto">
            <h4 className="text-xs font-bold uppercase text-purple-300 tracking-wider mb-2">Leaderboard Standings</h4>
            <div className="space-y-1.5">
              {allStandings.map((stand, i) => (
                <div
                  key={stand.id}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-bold ${
                    stand.isPlayer ? 'bg-[#0bc2cf]/30 border border-[#0bc2cf]' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-gray-300">#{i + 1}</span>
                    <span>{stand.emoji}</span>
                    <span>{stand.name}</span>
                  </div>
                  <span className="text-amber-300 font-black">{stand.gold} gold</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onExit(earnedTokens)}
            className="button w-full"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront text-xl py-2">
              Collect Tokens & Return
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#2b1055] flex flex-col justify-between text-white font-nunito">
      {/* Top Header Bar */}
      <div className="h-18 bg-[#1f0a3e] px-4 sm:px-8 flex items-center justify-between border-b border-purple-900/60 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-2xl shadow">
            {playerBlook.emoji}
          </div>
          <div>
            <div className="text-sm font-black text-white">{nickname}</div>
            <div className="text-xs text-purple-300 font-bold">
              Q {currentIdx + 1} of {questionSet.questions.length}
            </div>
          </div>
        </div>

        {/* Gold & Streak Display */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-400/40">
            <span className="text-xl">🪙</span>
            <span className="font-titan text-xl text-amber-300">{gold}</span>
          </div>

          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 bg-red-950/60 text-rose-300 px-3 py-1.5 rounded-xl border border-rose-500/40 text-sm font-black">
              <span>🔥</span>
              <span>{streak} Streak!</span>
            </div>
          )}

          <button
            onClick={() => {
              playClickSound();
              onExit(Math.floor(gold / 10));
            }}
            className="px-3 py-1.5 bg-red-500/80 hover:bg-red-600 rounded-lg text-xs font-black uppercase tracking-wider transition"
          >
            Quit
          </button>
        </div>
      </div>

      {/* Main Game Board */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-[960px] w-full mx-auto p-4 sm:p-6">
        {/* Chest Modal if Gold Quest and answered correctly */}
        {showChests ? (
          <div className="w-full text-center flex flex-col items-center animate-fade-in py-6">
            <h3 className="font-titan text-3xl sm:text-4xl text-amber-300 mb-2 drop-shadow-md">
              Correct! Pick a Mystery Chest!
            </h3>
            <p className="text-purple-200 text-base mb-8">What treasure will you uncover?</p>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-[650px] w-full mb-8">
              {[0, 1, 2].map((chestId) => (
                <button
                  key={chestId}
                  onClick={() => handleOpenChest(chestId)}
                  disabled={openedChest !== null}
                  className={`group relative p-6 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] cursor-pointer ${
                    openedChest === chestId
                      ? 'bg-amber-400 border-yellow-200 scale-105 shadow-2xl'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-amber-300 hover:scale-105'
                  }`}
                >
                  <div className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform">
                    {openedChest === chestId ? '🎁' : '📦'}
                  </div>
                  <span className="font-titan text-sm sm:text-base mt-3 text-amber-200 group-hover:text-amber-100">
                    Chest #{chestId + 1}
                  </span>
                </button>
              ))}
            </div>

            {chestPrize && (
              <div className="animate-bounce font-titan text-3xl sm:text-4xl text-amber-300 bg-black/60 px-6 py-3 rounded-2xl border border-amber-300 shadow-xl">
                {chestPrize.text}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Question Card */}
            <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl text-center mb-8 relative">
              <span className="absolute top-4 left-6 text-xs font-black tracking-widest uppercase text-purple-300">
                {questionSet.title}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-4 leading-snug">
                {currentQ.text}
              </h2>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {currentQ.options.map((option, idx) => {
                const color = optionColors[idx % optionColors.length];
                let extraStyles = '';

                if (isAnswered) {
                  if (idx === currentQ.correctAnswer) {
                    extraStyles = 'ring-4 ring-green-300 brightness-110';
                  } else if (idx === selectedOption) {
                    extraStyles = 'opacity-40 grayscale';
                  } else {
                    extraStyles = 'opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`relative rounded-2xl overflow-hidden shadow-lg p-1 transition-transform active:translate-y-1 cursor-pointer text-left ${extraStyles}`}
                  >
                    <div className={`absolute inset-0 rounded-2xl ${color.back}`}></div>
                    <div
                      className={`relative z-10 rounded-xl ${color.bg} ${color.text} p-4 sm:p-5 font-bold text-lg sm:text-xl flex items-center justify-between -translate-y-1 hover:-translate-y-1.5 transition-transform`}
                    >
                      <span>{option}</span>
                      <span className="w-7 h-7 rounded-full bg-black/20 text-xs flex items-center justify-center font-black">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Post-answer feedback */}
            {isAnswered && (
              <div
                className={`mt-6 px-6 py-3 rounded-2xl text-center font-black text-lg transition animate-fade-in ${
                  isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}
              >
                {isCorrect ? (
                  <span>Great job! That&apos;s correct!</span>
                ) : (
                  <span>
                    Incorrect! The correct answer was:{' '}
                    <strong>{currentQ.options[currentQ.correctAnswer]}</strong>
                  </span>
                )}
                {currentQ.explanation && (
                  <div className="text-sm font-semibold opacity-90 mt-1">{currentQ.explanation}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mini Bottom Standings Bar */}
      <div className="bg-[#190633] px-4 py-2 border-t border-purple-900/60 flex items-center justify-center gap-4 text-xs font-bold text-purple-200">
        <span>Live Standings:</span>
        <div className="flex items-center gap-3 overflow-x-auto max-w-[700px]">
          {allStandings.slice(0, 4).map((s, idx) => (
            <div
              key={s.id}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                s.isPlayer ? 'bg-[#0bc2cf] text-white font-black' : 'bg-white/10'
              }`}
            >
              <span>#{idx + 1}</span>
              <span>{s.emoji}</span>
              <span className="truncate max-w-[80px]">{s.name}</span>
              <span className="text-amber-300">🪙 {s.gold}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
