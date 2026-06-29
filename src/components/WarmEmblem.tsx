import React from 'react';
import { motion } from 'motion/react';

export default function WarmEmblem() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative w-64 h-64 flex items-center justify-center"
      >
        {/* Glow behind the emblem */}
        <div className="absolute inset-0 bg-amber-200/20 blur-3xl rounded-full scale-75" />

        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_10px_15px_rgba(217,119,6,0.15)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Shimmering Gold Gradient */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Warm Sunset Rose Gradient for emblem accents */}
            <linearGradient id="roseGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>

            {/* Inner Ring Gradient */}
            <linearGradient id="innerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
          </defs>

          {/* Outer Laurel Leaves/Wreath (Abstract & Clean Representation) */}
          <g transform="translate(100, 100) scale(0.95)">
            {/* Left branch */}
            {Array.from({ length: 9 }).map((_, i) => {
              const angle = -160 + i * 16;
              const rad = (angle * Math.PI) / 180;
              const rx = Math.cos(rad) * 82;
              const ry = Math.sin(rad) * 82;
              return (
                <path
                  key={`left-leaf-${i}`}
                  d="M -3,-6 C 2,-9 8,-4 5,2 C 2,5 -3,4 -5,1 Z"
                  transform={`translate(${rx}, ${ry}) rotate(${angle + 90}) scale(${0.7 + i * 0.04})`}
                  fill="url(#goldGrad)"
                />
              );
            })}

            {/* Right branch */}
            {Array.from({ length: 9 }).map((_, i) => {
              const angle = -20 - i * 16;
              const rad = (angle * Math.PI) / 180;
              const rx = Math.cos(rad) * 82;
              const ry = Math.sin(rad) * 82;
              return (
                <path
                  key={`right-leaf-${i}`}
                  d="M 3,-6 C -2,-9 -8,-4 -5,2 C -2,5 3,4 5,1 Z"
                  transform={`translate(${rx}, ${ry}) rotate(${angle - 90}) scale(${0.7 + i * 0.04})`}
                  fill="url(#goldGrad)"
                />
              );
            })}
          </g>

          {/* Golden Outer Ring */}
          <circle
            cx="100"
            cy="100"
            r="72"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeDasharray="4 2"
          />

          {/* Solid Soft Warm Cream Inner circle */}
          <circle
            cx="100"
            cy="100"
            r="66"
            fill="#FFFBEB"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
          />

          {/* Supporting hands shaped as a heart in the background */}
          <path
            d="M 100,128 C 88,112 68,95 68,78 C 68,64 78,54 90,54 C 97,54 100,58 100,58 C 100,58 103,54 110,54 C 122,54 132,64 132,78 C 132,95 112,112 100,128 Z"
            fill="url(#roseGrad)"
            opacity="0.09"
          />

          {/* "20" - Golden Commemorative Text */}
          <text
            x="100"
            y="94"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="38"
            fill="url(#goldGrad)"
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="-1"
          >
            20
          </text>

          {/* Golden Banner Ribbons at the bottom */}
          <g transform="translate(100, 138)">
            {/* Behind Ribbon Flaps */}
            <path d="M -50,6 L -64,-4 L -64,12 Z" fill="#92400E" />
            <path d="M 50,6 L 64,-4 L 64,12 Z" fill="#92400E" />

            {/* Front Ribbon Body */}
            <path
              d="M -58,-6 L 58,-6 C 62,-6 62,12 58,12 L -58,12 C -62,12 -62,-6 -58,-6 Z"
              fill="url(#goldGrad)"
            />

            {/* Ribbon Text: 2006 - 2026 */}
            <text
              x="0"
              y="4"
              fontFamily="sans-serif"
              fontWeight="800"
              fontSize="9"
              fill="#FFFFFF"
              textAnchor="middle"
              dominantBaseline="middle"
              letterSpacing="1"
            >
              2006 - 2026
            </text>
          </g>

          {/* Core Text Label above banner */}
          <text
            x="100"
            y="118"
            fontFamily="sans-serif"
            fontWeight="bold"
            fontSize="9.5"
            fill="#B45309"
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing="0.5"
          >
            개관 20주년 기념
          </text>

          {/* Agency Ring Text: 수원시장애인종합복지관 */}
          <path
            id="textPathUpper"
            d="M 44,100 A 56,56 0 0,1 156,100"
            fill="none"
          />
          <text fontSize="7.5" fontWeight="700" fill="#78350F" letterSpacing="0.8">
            <textPath href="#textPathUpper" startOffset="50%" textAnchor="middle">
              수원시장애인종합복지관
            </textPath>
          </text>
        </svg>

        {/* Shimmer effect overlay */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
          style={{ clipPath: 'circle(44% at 50% 50%)' }}
        >
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeInOut',
            }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 absolute -top-0 -left-1/4"
          />
        </motion.div>
      </motion.div>

      {/* Slogan under the Emblem */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-2"
      >
        <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full tracking-wide">
          함께한 20년, 함께할 미래
        </span>
      </motion.div>
    </div>
  );
}
