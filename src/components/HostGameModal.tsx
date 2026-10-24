import React, { useState, useEffect } from 'react';
import { QuestionSet } from '../types/blooket';
import { INITIAL_QUESTION_SETS, BLOOKS } from '../data/blooketData';
import { playClickSound } from '../utils/audio';

interface HostGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGame: (set: QuestionSet, mode: 'Gold Quest' | 'Classic', pin: string) => void;
}

interface LobbyPlayer {
  id: string;
  name: string;
  emoji: string;
}

export const HostGameModal: React.FC<HostGameModalProps> = ({
  isOpen,
  onClose,
  onLaunchGame,
}) => {
  const [selectedSet, setSelectedSet] = useState<QuestionSet>(INITIAL_QUESTION_SETS[0]);
  const [mode, setMode] = useState<'Gold Quest' | 'Classic'>('Gold Quest');
  const [pin, setPin] = useState('739281');
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>([
    { id: '1', name: 'Maya', emoji: '🦉' },
    { id: '2', name: 'Lucas', emoji: '🐥' },
    { id: '3', name: 'Zoe', emoji: '🧙' },
    { id: '4', name: 'Ethan', emoji: '🐷' },
  ]);

  useEffect(() => {
    if (isOpen) {
      // Generate randomized 6 digit PIN
      const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
      setPin(randomPin);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddBot = () => {
    playClickSound();
    const names = ['Kai', 'Sophia', 'Liam', 'Emma', 'Noah', 'Ava', 'Jackson', 'Lily'];
    const unusedNames = names.filter((n) => !lobbyPlayers.some((p) => p.name === n));
    const nextName = unusedNames[0] || `Student ${lobbyPlayers.length + 1}`;
    const randomBlook = BLOOKS[Math.floor(Math.random() * BLOOKS.length)];
    setLobbyPlayers((prev) => [
      ...prev,
      { id: Date.now().toString(), name: nextName, emoji: randomBlook.emoji },
    ]);
  };

  const handleKickPlayer = (id: string) => {
    playClickSound();
    setLobbyPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-nunito">
      <div className="bg-white rounded-3xl max-w-[650px] w-full p-6 sm:p-8 shadow-2xl relative border-4 border-[#9a49aa]">
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

        <div className="text-center mb-6">
          <div className="font-titan text-3xl sm:text-4xl text-[#9a49aa]">
            Host Live Classroom Game
          </div>
          <p className="text-gray-500 font-bold">Have your students join at play.blooket.com</p>
        </div>

        {/* Big Game PIN Display */}
        <div className="bg-[#411060] text-white rounded-2xl p-6 text-center mb-6 shadow-inner relative overflow-hidden">
          <div className="text-xs font-black uppercase text-purple-300 tracking-widest mb-1">
            GAME PIN
          </div>
          <div className="font-titan text-5xl sm:text-6xl tracking-widest text-amber-300 drop-shadow-md">
            {pin}
          </div>
          <div className="text-xs text-purple-200 mt-2 font-semibold">
            Tell students to enter PIN #{pin} to enter this lobby
          </div>
        </div>

        {/* Set & Mode Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1">
              Select Question Set
            </label>
            <select
              value={selectedSet.id}
              onChange={(e) => {
                const found = INITIAL_QUESTION_SETS.find((s) => s.id === e.target.value);
                if (found) setSelectedSet(found);
              }}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-gray-200 font-bold text-sm text-gray-800 outline-none focus:border-[#9a49aa]"
            >
              {INITIAL_QUESTION_SETS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.questions.length} questions)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1">
              Game Mode
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('Gold Quest');
                }}
                className={`flex-1 py-2 px-2 rounded-xl font-bold text-xs border-2 transition ${
                  mode === 'Gold Quest'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 font-black'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                🪙 Gold Quest
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMode('Classic');
                }}
                className={`flex-1 py-2 px-2 rounded-xl font-bold text-xs border-2 transition ${
                  mode === 'Classic'
                    ? 'border-[#0bc2cf] bg-cyan-50 text-[#0bc2cf] font-black'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                ⚡ Classic Speed
              </button>
            </div>
          </div>
        </div>

        {/* Lobby Students List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-gray-500">
              Students in Lobby ({lobbyPlayers.length})
            </span>
            <button
              onClick={handleAddBot}
              className="text-xs font-bold text-[#9a49aa] hover:underline"
            >
              + Simulate Joined Student
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[140px] overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-200">
            {lobbyPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white p-2 rounded-xl shadow-xs border border-gray-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xl">{player.emoji}</span>
                  <span className="text-xs font-extrabold text-gray-800 truncate">
                    {player.name}
                  </span>
                </div>
                <button
                  onClick={() => handleKickPlayer(player.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition text-xs font-bold px-1"
                  title="Remove from lobby"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Game */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="button secondary flex-1"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront text-base py-2 text-gray-500">
              Cancel
            </div>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onLaunchGame(selectedSet, mode, pin);
            }}
            className="button purple-btn flex-2"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront text-xl py-2">
              Start Game ({lobbyPlayers.length} Players)
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
