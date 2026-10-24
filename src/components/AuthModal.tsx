import React, { useState } from 'react';
import { playClickSound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (email: string, role: 'Student' | 'Teacher') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Student' | 'Teacher'>('Student');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playClickSound();
    onSuccess(email, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-nunito">
      <div className="bg-white rounded-3xl max-w-[440px] w-full p-6 sm:p-8 shadow-2xl relative border-4 border-[#0bc2cf]">
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
          <div className="font-titan text-3xl text-[#0bc2cf] mb-1">
            {mode === 'signup' ? 'Welcome to Blooket!' : 'Welcome Back!'}
          </div>
          <p className="text-xs text-gray-500 font-bold">
            {mode === 'signup'
              ? 'Join millions of students and educators learning with action!'
              : 'Log in to access your question sets and blooks collection.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Student')}
                  className={`py-2 px-3 rounded-xl font-black text-xs border-2 transition ${
                    role === 'Student'
                      ? 'border-[#0bc2cf] bg-cyan-50 text-[#0bc2cf]'
                      : 'border-gray-200 text-gray-500'
                  }`}
                >
                  🎒 Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Teacher')}
                  className={`py-2 px-3 rounded-xl font-black text-xs border-2 transition ${
                    role === 'Teacher'
                      ? 'border-[#9a49aa] bg-purple-50 text-[#9a49aa]'
                      : 'border-gray-200 text-gray-500'
                  }`}
                >
                  🍎 Teacher
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.org"
              className="w-full py-2 px-3 rounded-xl border-2 border-gray-200 font-bold text-sm focus:border-[#0bc2cf] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full py-2 px-3 rounded-xl border-2 border-gray-200 font-bold text-sm focus:border-[#0bc2cf] outline-none"
            />
          </div>

          <button type="submit" className="button w-full pt-2">
            <div className="buttonBack"></div>
            <div className="buttonFront text-lg py-2">
              {mode === 'signup' ? 'Create Account' : 'Log In'}
            </div>
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-bold">
          {mode === 'signup' ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#0bc2cf] hover:underline font-black"
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#0bc2cf] hover:underline font-black"
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
