/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSections } from './components/FeaturesSections';
import { Footer } from './components/Footer';
import { JoinGameModal } from './components/JoinGameModal';
import { HostGameModal } from './components/HostGameModal';
import { DiscoverSetsModal } from './components/DiscoverSetsModal';
import { BlookLockerModal } from './components/BlookLockerModal';
import { AuthModal } from './components/AuthModal';
import { GamePlayScreen } from './components/GamePlayScreen';
import { AboutBlankView } from './components/AboutBlankView';
import { PlayBlooketJoinView } from './components/PlayBlooketJoinView';
import { Blook, QuestionSet } from './types/blooket';
import { BLOOKS, INITIAL_QUESTION_SETS } from './data/blooketData';
import { playClickSound } from './utils/audio';

export default function App() {
  // Stealth about:blank mode
  const [isAboutBlankMode, setIsAboutBlankMode] = useState(false);

  // Authentic Play.blooket.com Join Game Screen
  const [isPlayJoinViewOpen, setIsPlayJoinViewOpen] = useState(false);

  // Game Play state
  const [activeGame, setActiveGame] = useState<{
    questionSet: QuestionSet;
    playerBlook: Blook;
    nickname: string;
    gameMode: 'Gold Quest' | 'Classic';
  } | null>(null);

  // Modals
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [discoverModalOpen, setDiscoverModalOpen] = useState(false);
  const [lockerModalOpen, setLockerModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'signup',
  });

  // User persistence & tokens
  const [tokens, setTokens] = useState(75);
  const [unlockedBlookIds, setUnlockedBlookIds] = useState<string[]>([
    'owl',
    'chick',
    'pig',
    'rabbit',
  ]);
  const [user, setUser] = useState<{ email: string; role: 'Student' | 'Teacher' } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStartGame = (params: {
    questionSet: QuestionSet;
    playerBlook: Blook;
    nickname: string;
    gameMode: 'Gold Quest' | 'Classic';
  }) => {
    setJoinModalOpen(false);
    setHostModalOpen(false);
    setDiscoverModalOpen(false);
    setActiveGame(params);
  };

  const handleExitGame = (earnedTokens: number) => {
    setActiveGame(null);
    if (earnedTokens > 0) {
      setTokens((prev) => prev + earnedTokens);
      showToast(`🎉 You earned +${earnedTokens} Tokens! Added to your Blooks Locker.`);
    }
  };

  const handleSpendTokens = (amount: number): boolean => {
    if (tokens >= amount) {
      setTokens((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const handleUnlockBlook = (blookId: string) => {
    if (!unlockedBlookIds.includes(blookId)) {
      setUnlockedBlookIds((prev) => [...prev, blookId]);
    }
  };

  // If stealth about:blank is active, display the cool about:blank UI
  if (isAboutBlankMode) {
    return <AboutBlankView onExit={() => setIsAboutBlankMode(false)} />;
  }

  // If authentic Play Blooket Join Screen is active
  if (isPlayJoinViewOpen) {
    return (
      <PlayBlooketJoinView
        onBackToHome={() => setIsPlayJoinViewOpen(false)}
        onEnterAboutBlank={() => {
          setIsPlayJoinViewOpen(false);
          setIsAboutBlankMode(true);
        }}
        onStartGame={(params) => {
          setIsPlayJoinViewOpen(false);
          handleStartGame(params);
        }}
      />
    );
  }

  // If active game is in progress, display full-screen immersive Blooket gameplay
  if (activeGame) {
    return (
      <GamePlayScreen
        questionSet={activeGame.questionSet}
        playerBlook={activeGame.playerBlook}
        nickname={activeGame.nickname}
        gameMode={activeGame.gameMode}
        onExit={handleExitGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#3a3a3a] font-nunito selection:bg-cyan-100 selection:text-cyan-900 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 bg-[#411060] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-300 font-extrabold text-sm animate-bounce flex items-center gap-2">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onJoinGame={() => setIsPlayJoinViewOpen(true)}
        onHostGame={() => setHostModalOpen(true)}
        onDiscover={() => setDiscoverModalOpen(true)}
        onBlooksLocker={() => setLockerModalOpen(true)}
        onLogin={() => setAuthModal({ open: true, mode: 'login' })}
        onSignUp={() => setAuthModal({ open: true, mode: 'signup' })}
        tokens={tokens}
      />

      {/* Hero Section */}
      <HeroSection
        onJoinGame={() => setIsPlayJoinViewOpen(true)}
        onSignUp={() => setAuthModal({ open: true, mode: 'signup' })}
        onLogin={() => setAuthModal({ open: true, mode: 'login' })}
      />

      {/* Feature & Value Sections */}
      <FeaturesSections
        onSignUp={() => setAuthModal({ open: true, mode: 'signup' })}
        onJoinGame={() => setIsPlayJoinViewOpen(true)}
        onDiscover={() => setDiscoverModalOpen(true)}
      />

      {/* Wave Footer */}
      <Footer />

      {/* Floating Action Button (Quick Play) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            playClickSound();
            setIsPlayJoinViewOpen(true);
          }}
          className="button"
          title="Quick Join Blooket Game"
        >
          <div className="buttonBack"></div>
          <div className="buttonFront py-2 px-5 text-base sm:text-lg flex items-center gap-2 shadow-2xl">
            <img src="/images/play.svg" alt="Play" className="w-4 h-4" />
            <span>Play Now</span>
          </div>
        </button>
      </div>

      {/* Modals */}
      <JoinGameModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onStartGame={handleStartGame}
        onEnterAboutBlank={() => {
          setJoinModalOpen(false);
          setIsAboutBlankMode(true);
        }}
      />

      <HostGameModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        onLaunchGame={(set, mode) => {
          handleStartGame({
            questionSet: set,
            playerBlook: BLOOKS[0],
            nickname: 'HostTeacher',
            gameMode: mode,
          });
        }}
      />

      <DiscoverSetsModal
        isOpen={discoverModalOpen}
        onClose={() => setDiscoverModalOpen(false)}
        onPlaySet={(set) => {
          handleStartGame({
            questionSet: set,
            playerBlook: BLOOKS[0],
            nickname: user ? user.email.split('@')[0] : 'Player1',
            gameMode: 'Gold Quest',
          });
        }}
        onHostSet={(set) => {
          setDiscoverModalOpen(false);
          setHostModalOpen(true);
        }}
      />

      <BlookLockerModal
        isOpen={lockerModalOpen}
        onClose={() => setLockerModalOpen(false)}
        tokens={tokens}
        onSpendTokens={handleSpendTokens}
        unlockedBlookIds={unlockedBlookIds}
        onUnlockBlook={handleUnlockBlook}
      />

      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ open: false, mode: 'login' })}
        onSuccess={(email, role) => {
          setUser({ email, role });
          showToast(`Welcome ${role} ${email}!`);
        }}
      />
    </div>
  );
}
