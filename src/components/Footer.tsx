import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full relative mt-16 overflow-hidden">
      {/* Animated SVG Waves Header */}
      <div className="w-full overflow-hidden leading-none relative bg-white">
        <svg
          className="w-full min-w-[1200px] h-[100px] sm:h-[140px] block"
          viewBox="0 880 1920 200"
          preserveAspectRatio="none"
        >
          {/* Back wave */}
          <g className="wave-back">
            <path
              className="wave-back-path"
              d="M2188.97,1129.23l-2342.15,0l0,-214.586c26.614,33.735 80.191,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.614,33.735 80.19,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.462,-0l-0,0.147c26.613,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.19,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.462,-0l-0,0.147c26.613,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.19,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.462,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.19,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.462,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.613,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147l0,214.586Z"
              fill="#02b0ea"
            />
          </g>
          {/* Mid waves */}
          <g className="wave-mid-back">
            <path
              className="wave-mid-back-path"
              d="M2180.53,1156.88l-2342.15,-0l0,-214.586c26.614,33.735 80.191,33.562 106.462,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.19,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.462,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.19,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.613,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.613,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.614,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.614,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147l0,214.586Z"
              fill="#2a9eea"
            />
          </g>
          {/* Front wave */}
          <g className="wave-front">
            <path
              className="wave-front-path"
              d="M2159.17,1222.14l-2342.15,0l0,-214.586c26.614,33.735 80.191,33.562 106.462,-0l-0,0.147c26.613,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.19,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.462,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.19,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.613,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.613,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.614,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147c26.614,33.735 80.191,33.562 106.461,-0l0,0.147c26.614,33.735 80.191,33.415 106.462,-0.147c26.613,33.735 80.19,33.562 106.461,-0l-0,0.147c26.614,33.735 80.19,33.415 106.461,-0.147l0,214.586Z"
              fill="#1671e9"
            />
          </g>
        </svg>
      </div>

      {/* Footer Content */}
      <div className="bg-[#1671e9] text-white pt-10 pb-16 px-4">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Column 1: Product */}
          <div>
            <h5 className="font-extrabold text-xl mb-4 text-white">Product</h5>
            <ul className="space-y-2 text-sm sm:text-base text-blue-100 font-medium">
              <li>
                <a href="#upgrade" className="hover:text-white transition">Upgrade</a>
              </li>
              <li>
                <a href="#group" className="hover:text-white transition">Group Plans</a>
              </li>
              <li>
                <a href="#modes" className="hover:text-white transition">Game Modes</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h5 className="font-extrabold text-xl mb-4 text-white">Contact</h5>
            <ul className="space-y-2 text-sm sm:text-base text-blue-100 font-medium">
              <li>
                <a href="#help" className="hover:text-white transition">Help Center</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">FAQ</a>
              </li>
              <li>
                <a href="mailto:contact@blooket.com" className="hover:text-white transition">contact@blooket.com</a>
              </li>
            </ul>
          </div>

          {/* Column 3: More */}
          <div>
            <h5 className="font-extrabold text-xl mb-4 text-white">More</h5>
            <ul className="space-y-2 text-sm sm:text-base text-blue-100 font-medium">
              <li>
                <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition">Terms of Service</a>
              </li>
              <li>
                <a href="https://www.benstewart.io/" target="_blank" rel="noreferrer" className="hover:text-white transition">
                  Created by Ben Stewart
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h5 className="font-extrabold text-xl mb-4 text-white">Connect</h5>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="https://www.facebook.com/PlayBlooket"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
              >
                <img src="/images/Facebook.svg" alt="Facebook" className="w-5 h-5 invert" />
              </a>
              <a
                href="https://www.instagram.com/PlayBlooket"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
              >
                <img src="/images/Instagram.svg" alt="Instagram" className="w-5 h-5 invert" />
              </a>
              <a
                href="https://www.youtube.com/@PlayBlooket"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
              >
                <img src="/images/Youtube.svg" alt="Youtube" className="w-5 h-5 invert" />
              </a>
              <a
                href="https://x.com/PlayBlooket"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
              >
                <img src="/images/Twitter.svg" alt="Twitter" className="w-5 h-5 invert" />
              </a>
              <a
                href="https://www.tiktok.com/@PlayBlooket"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
              >
                <img src="/images/TikTok.svg" alt="TikTok" className="w-5 h-5 invert" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto mt-12 pt-8 border-t border-blue-400/30 text-center text-xs sm:text-sm text-blue-200">
          Copyright &copy; 2026 Blooket LLC. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
