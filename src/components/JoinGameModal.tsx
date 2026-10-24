import React, { useState } from 'react';
import { Blook, QuestionSet } from '../types/blooket';
import { BLOOKS, INITIAL_QUESTION_SETS } from '../data/blooketData';
import { playClickSound } from '../utils/audio';
import { launchRealAboutBlank } from '../utils/aboutBlank';

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (params: {
    questionSet: QuestionSet;
    playerBlook: Blook;
    nickname: string;
    gameMode: 'Gold Quest' | 'Classic';
  }) => void;
  onEnterAboutBlank: () => void;
  initialPin?: string;
}

export const JoinGameModal: React.FC<JoinGameModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  onEnterAboutBlank,
  initialPin = '849201',
}) => {
  const [pin, setPin] = useState(initialPin);
  const [nickname, setNickname] = useState('QuizStar');
  const [selectedBlook, setSelectedBlook] = useState<Blook>(BLOOKS[0]);
  const [gameMode, setGameMode] = useState<'Gold Quest' | 'Classic'>('Gold Quest');
  const [selectedSet, setSelectedSet] = useState<QuestionSet>(INITIAL_QUESTION_SETS[0]);
  const [step, setStep] = useState<'pin' | 'setup'>('pin');

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (cleanPin === '0000') {
      playClickSound();
      launchRealAboutBlank();
      onClose();
      onEnterAboutBlank();
      return;
    }
    if (cleanPin.length >= 4) {
      playClickSound();
      setStep('setup');
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    playClickSound();
    onStartGame({
      questionSet: selectedSet,
      playerBlook: selectedBlook,
      nickname: nickname.trim(),
      gameMode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-nunito">
      <div className="bg-white rounded-3xl max-w-[500px] w-full p-6 sm:p-8 shadow-2xl relative border-4 border-[#0bc2cf]">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center transition"
        >
          ✕
        </button>

        {step === 'pin' ? (
          <div>
            <div className="text-center mb-6">
              <div className="font-titan text-3xl sm:text-4xl text-[#0bc2cf] mb-1">
                Join a Game
              </div>
              <p className="text-gray-500 font-bold">Enter your 6-digit Game PIN</p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000 or 849201"
                  className="w-full text-center text-3xl sm:text-4xl font-titan tracking-widest py-3 px-4 rounded-2xl border-4 border-[#dcdcdc] focus:border-[#0bc2cf] outline-none text-[#3a3a3a]"
                  autoFocus
                />
              </div>

              <div className="text-center">
                <span className="text-xs text-gray-400 font-bold">
                  Enter PIN to join &bull; Tip: Enter <span className="text-[#0bc2cf] font-mono font-black">0000</span> for secret <span className="font-mono">about:blank</span> mode
                </span>
              </div>

              <button
                type="submit"
                disabled={pin.length < 4}
                className="button w-full"
              >
                <div className="buttonBack"></div>
                <div className="buttonFront text-xl py-2">
                  Enter Game
                </div>
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <div className="font-titan text-2xl sm:text-3xl text-[#0bc2cf]">
                Player Setup
              </div>
              <p className="text-xs text-gray-500 font-bold">PIN: #{pin}</p>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              {/* Nickname input */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Choose Nickname
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border-2 border-[#dcdcdc] focus:border-[#0bc2cf] outline-none font-extrabold text-lg text-gray-800"
                  required
                />
              </div>

              {/* Blook Avatar Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Pick Your Blook Avatar
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-[140px] overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-200">
                  {BLOOKS.map((blook) => (
                    <button
                      key={blook.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedBlook(blook);
                      }}
                      className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition border-2 ${
                        selectedBlook.id === blook.id
                          ? 'border-[#0bc2cf] bg-sky-100 scale-105 shadow-sm'
                          : 'border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl">{blook.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-700 truncate w-full">
                        {blook.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setGameMode('Gold Quest');
                  }}
                  className={`p-2.5 rounded-xl text-center border-2 font-black text-sm flex flex-col items-center transition ${
                    gameMode === 'Gold Quest'
                      ? 'border-amber-400 bg-amber-50 text-amber-800'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">🪙</span>
                  <span>Gold Quest</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setGameMode('Classic');
                  }}
                  className={`p-2.5 rounded-xl text-center border-2 font-black text-sm flex flex-col items-center transition ${
                    gameMode === 'Classic'
                      ? 'border-[#0bc2cf] bg-cyan-50 text-[#0bc2cf]'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">⚡</span>
                  <span>Classic Speed</span>
                </button>
              </div>

              {/* Question Set Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Question Set
                </label>
                <select
                  value={selectedSet.id}
                  onChange={(e) => {
                    const found = INITIAL_QUESTION_SETS.find((s) => s.id === e.target.value);
                    if (found) setSelectedSet(found);
                  }}
                  className="w-full py-2 px-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 outline-none focus:border-[#0bc2cf]"
                >
                  {INITIAL_QUESTION_SETS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.questions.length} questions)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('pin')}
                  className="button secondary flex-1"
                >
                  <div className="buttonBack"></div>
                  <div className="buttonFront text-base py-1.5 text-gray-500">
                    Back
                  </div>
                </button>

                <button
                  type="submit"
                  className="button flex-2"
                >
                  <div className="buttonBack"></div>
                  <div className="buttonFront text-lg py-1.5">
                    Start Playing!
                  </div>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
