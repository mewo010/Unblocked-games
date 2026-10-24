import React, { useState } from 'react';
import { Blook, BlookRarity } from '../types/blooket';
import { BLOOKS } from '../data/blooketData';
import { playClickSound, playCorrectSound, playChestOpenSound } from '../utils/audio';

interface BlookLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: number;
  onSpendTokens: (amount: number) => boolean;
  unlockedBlookIds: string[];
  onUnlockBlook: (blookId: string) => void;
}

export const BlookLockerModal: React.FC<BlookLockerModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onSpendTokens,
  unlockedBlookIds,
  onUnlockBlook,
}) => {
  const [openingPack, setOpeningPack] = useState(false);
  const [unlockedResult, setUnlockedResult] = useState<Blook | null>(null);

  if (!isOpen) return null;

  const rarityColors: Record<BlookRarity, string> = {
    Common: 'bg-gray-100 text-gray-700 border-gray-300',
    Uncommon: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Rare: 'bg-blue-100 text-blue-800 border-blue-300',
    Epic: 'bg-purple-100 text-purple-800 border-purple-300',
    Legendary: 'bg-amber-100 text-amber-800 border-amber-300',
    Chroma: 'bg-pink-100 text-pink-800 border-pink-400 animate-pulse',
  };

  const handleOpenPack = () => {
    if (tokens < 25) {
      alert('You need at least 25 tokens to open a pack! Play review games to earn more tokens.');
      return;
    }
    const success = onSpendTokens(25);
    if (!success) return;

    playClickSound();
    setOpeningPack(true);
    setUnlockedResult(null);

    // Roll random blook based on rarity probability
    const rand = Math.random();
    let picked: Blook;
    if (rand < 0.02) {
      // Chroma (2%)
      picked = BLOOKS.find((b) => b.rarity === 'Chroma') || BLOOKS[0];
    } else if (rand < 0.08) {
      // Legendary (6%)
      const legendaries = BLOOKS.filter((b) => b.rarity === 'Legendary');
      picked = legendaries[Math.floor(Math.random() * legendaries.length)] || BLOOKS[0];
    } else if (rand < 0.22) {
      // Epic (14%)
      const epics = BLOOKS.filter((b) => b.rarity === 'Epic');
      picked = epics[Math.floor(Math.random() * epics.length)] || BLOOKS[0];
    } else if (rand < 0.45) {
      // Rare (23%)
      const rares = BLOOKS.filter((b) => b.rarity === 'Rare');
      picked = rares[Math.floor(Math.random() * rares.length)] || BLOOKS[0];
    } else if (rand < 0.75) {
      // Uncommon (30%)
      const uncommons = BLOOKS.filter((b) => b.rarity === 'Uncommon');
      picked = uncommons[Math.floor(Math.random() * uncommons.length)] || BLOOKS[0];
    } else {
      // Common (25%)
      const commons = BLOOKS.filter((b) => b.rarity === 'Common');
      picked = commons[Math.floor(Math.random() * commons.length)] || BLOOKS[0];
    }

    setTimeout(() => {
      setOpeningPack(false);
      setUnlockedResult(picked);
      onUnlockBlook(picked.id);
      if (picked.rarity === 'Legendary' || picked.rarity === 'Chroma') {
        playChestOpenSound();
      } else {
        playCorrectSound();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-nunito">
      <div className="bg-white rounded-3xl max-w-[760px] w-full max-h-[90vh] flex flex-col p-6 shadow-2xl relative border-4 border-[#f5a623]">
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

        {/* Header & Token Balance */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-titan text-3xl text-amber-500">Blooks Locker</h3>
            <p className="text-xs text-gray-500 font-bold">Collect, unlock, and show off your favorite avatars</p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-4 py-2 rounded-2xl">
            <span className="text-2xl">🪙</span>
            <div>
              <div className="text-[10px] font-black uppercase text-amber-800">Your Tokens</div>
              <div className="font-titan text-xl text-amber-600">{tokens}</div>
            </div>
          </div>
        </div>

        {/* Pack Opener Card */}
        <div className="my-4 bg-gradient-to-r from-purple-800 to-indigo-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce">📦</div>
            <div>
              <h4 className="font-titan text-xl text-amber-300">Wonderland & Medieval Pack</h4>
              <p className="text-xs text-purple-200">
                Unlock rare animals, wizards, dragons, and the legendary King!
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenPack}
            disabled={openingPack || tokens < 25}
            className="button gold-btn whitespace-nowrap"
          >
            <div className="buttonBack"></div>
            <div className="buttonFront text-base py-1.5 px-4 font-black">
              {openingPack ? 'Opening...' : 'Open Pack (25 🪙)'}
            </div>
          </button>
        </div>

        {/* Pack Opening Reveal Modal */}
        {unlockedResult && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-4 text-center animate-fade-in flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{unlockedResult.emoji}</span>
              <div className="text-left">
                <div className="text-xs font-black uppercase text-amber-800">You Unlocked!</div>
                <div className="font-titan text-lg text-gray-900">{unlockedResult.name}</div>
              </div>
            </div>

            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                rarityColors[unlockedResult.rarity]
              }`}
            >
              {unlockedResult.rarity}
            </span>

            <button
              onClick={() => setUnlockedResult(null)}
              className="text-xs font-black text-gray-500 hover:text-gray-800 px-3 py-1 bg-white rounded-lg border shadow-xs"
            >
              Collect
            </button>
          </div>
        )}

        {/* Blooks Collection Grid */}
        <div className="overflow-y-auto flex-1 pr-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2 block">
            All Blooks ({unlockedBlookIds.length}/{BLOOKS.length} Discovered)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {BLOOKS.map((blook) => {
              const isUnlocked = unlockedBlookIds.includes(blook.id);
              return (
                <div
                  key={blook.id}
                  className={`relative p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-between transition-all ${
                    isUnlocked
                      ? 'bg-white border-gray-200 shadow-sm hover:border-[#f5a623] hover:scale-102'
                      : 'bg-gray-100/80 border-dashed border-gray-300 opacity-60'
                  }`}
                >
                  <div className="text-4xl my-2">
                    {isUnlocked ? blook.emoji : '❓'}
                  </div>

                  <div className="w-full">
                    <div className="font-extrabold text-xs text-gray-800 truncate">
                      {isUnlocked ? blook.name : 'Locked Blook'}
                    </div>

                    <span
                      className={`inline-block text-[10px] font-black px-1.5 py-0.5 rounded-md border mt-1 ${
                        rarityColors[blook.rarity]
                      }`}
                    >
                      {blook.rarity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
