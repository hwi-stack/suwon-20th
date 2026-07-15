import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  Share2,
  ChevronDown,
  ChevronUp,
  Settings,
  Phone,
  ExternalLink
} from 'lucide-react';
import LocationMap from './components/LocationMap';

export default function App() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const eventDate = new Date('2026-09-17T10:40:00');

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Suwon Rehab 20th//NONSGML v1.0//EN',
      'BEGIN:VEVENT',
      'UID:suwon-rehab-20th-anniversary',
      'DTSTAMP:20260917T104000',
      'DTSTART:20260917T104000',
      'DTEND:20260917T120000',
      'SUMMARY:수원시장애인종합복지관 개관 20주년 기념식',
      'DESCRIPTION:수원시장애인종합복지관 개관 20주년 기념식 초청장\\n\\n함께한 20년, 함께할 미래에 귀하를 정중히 초청합니다.',
      'LOCATION:수원중앙침례교회 4층 중앙예닮홀 (경기도 수원시 팔달구 매산로 108)',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', '수원시장애인종합복지관_20주년_기념식.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex items-center justify-center py-0 sm:py-6 md:py-10 selection:bg-pink-100 selection:text-pink-900">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[840px] sm:rounded-[40px] shadow-2xl shadow-slate-900/10 border-0 sm:border-[8px] border-slate-900/5 flex flex-col justify-between overflow-hidden relative">
        
        {/* Top Premium Gold Highlight Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EC4899] via-[#C5A059] to-[#8B5CF6] z-50" />

        {/* Floating Action Buttons (Share) */}
        <div className="absolute top-4 right-4 flex items-center gap-2.5 z-40">
          {/* Share Button */}
          <button
            onClick={handleShare}
            id="share-link-button"
            className="p-2.5 bg-white/90 backdrop-blur-xs hover:bg-white border border-slate-200 rounded-full text-slate-700 shadow-xs relative hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="초청장 링크 복사"
          >
            <Share2 className="w-4 h-4" />
            <AnimatePresence>
              {showShareTooltip && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute right-0 top-12 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-md whitespace-nowrap shadow-md z-50"
                >
                  초청 링크 복사완료!
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* MAIN BODY CONTENTS SCROLL AREA */}
        <div className="flex-1 overflow-y-auto">

          <div className="space-y-8 pt-6 px-5 pb-12">
            
            {/* 1. visual Invitation Cover (Real Paper Invitation Image, Seamlessly blended) */}
            <div className="w-full pt-0 flex flex-col items-center relative overflow-hidden">
              {/* Falling Golden Dust/Sparkles overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {[
                  { left: '4%', delay: '0s', duration: '4.2s', drift: '15px', size: '12px' },
                  { left: '12%', delay: '1.5s', duration: '5.5s', drift: '-20px', size: '16px' },
                  { left: '19%', delay: '0.4s', duration: '4.8s', drift: '25px', size: '10px' },
                  { left: '26%', delay: '2.8s', duration: '6.0s', drift: '-15px', size: '20px' },
                  { left: '33%', delay: '0.8s', duration: '5.0s', drift: '20px', size: '14px' },
                  { left: '41%', delay: '3.5s', duration: '5.2s', drift: '-25px', size: '18px' },
                  { left: '48%', delay: '1.8s', duration: '5.1s', drift: '10px', size: '10px' },
                  { left: '55%', delay: '4.2s', duration: '4.2s', drift: '30px', size: '8px' },
                  { left: '62%', delay: '1.6s', duration: '5.6s', drift: '-10px', size: '16px' },
                  { left: '69%', delay: '0.6s', duration: '4.6s', drift: '15px', size: '12px' },
                  { left: '76%', delay: '2.4s', duration: '5.3s', drift: '-18px', size: '18px' },
                  { left: '84%', delay: '1.0s', duration: '4.9s', drift: '12px', size: '10px' },
                  { left: '91%', delay: '3.1s', duration: '5.7s', drift: '-30px', size: '14px' },
                  { left: '96%', delay: '0.2s', duration: '4.4s', drift: '8px', size: '8px' },
                  
                  // Additional stars to make it dense ("우수수 많이")
                  { left: '8%', delay: '2.0s', duration: '5.0s', drift: '-12px', size: '14px' },
                  { left: '15%', delay: '0.7s', duration: '4.3s', drift: '18px', size: '10px' },
                  { left: '23%', delay: '3.8s', duration: '5.8s', drift: '-22px', size: '18px' },
                  { left: '30%', delay: '1.2s', duration: '4.7s', drift: '15px', size: '12px' },
                  { left: '37%', delay: '2.9s', duration: '5.4s', drift: '-10px', size: '16px' },
                  { left: '45%', delay: '0.5s', duration: '4.1s', drift: '28px', size: '10px' },
                  { left: '51%', delay: '2.5s', duration: '5.2s', drift: '-20px', size: '14px' },
                  { left: '59%', delay: '1.1s', duration: '4.6s', drift: '12px', size: '12px' },
                  { left: '66%', delay: '3.6s', duration: '5.9s', drift: '-15px', size: '20px' },
                  { left: '73%', delay: '0.9s', duration: '4.8s', drift: '22px', size: '12px' },
                  { left: '80%', delay: '2.2s', duration: '5.1s', drift: '-25px', size: '16px' },
                  { left: '88%', delay: '4.0s', duration: '4.5s', drift: '18px', size: '10px' },
                  
                  // More background layer smaller stars
                  { left: '6%', delay: '3.0s', duration: '6.2s', drift: '5px', size: '8px' },
                  { left: '18%', delay: '2.1s', duration: '5.8s', drift: '-5px', size: '10px' },
                  { left: '29%', delay: '0.3s', duration: '6.5s', drift: '8px', size: '8px' },
                  { left: '44%', delay: '4.5s', duration: '5.4s', drift: '-12px', size: '12px' },
                  { left: '57%', delay: '1.7s', duration: '6.0s', drift: '14px', size: '8px' },
                  { left: '71%', delay: '3.3s', duration: '5.9s', drift: '-8px', size: '10px' },
                  { left: '86%', delay: '0.9s', duration: '6.3s', drift: '10px', size: '8px' },
                  { left: '94%', delay: '2.7s', duration: '5.6s', drift: '-14px', size: '10px' }
                ].map((s, idx) => {
                  const starColors = ['#FFD1E8', '#E6D7FF', '#FFE6B3', '#FFE1F0', '#F0E6FF', '#FFF0CE', '#FFEAF5', '#F5EEFF', '#FFF8E3'];
                  const color = starColors[idx % starColors.length];
                  return (
                    <div
                      key={idx}
                      className="gold-sparkle absolute"
                      style={{
                        left: s.left,
                        top: '-20px',
                        width: s.size,
                        height: s.size,
                        '--duration': s.duration,
                        '--drift': s.drift,
                        animationDelay: s.delay,
                        color: color,
                        opacity: 0.45,
                      } as React.CSSProperties}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_4px_currentColor]">
                        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                      </svg>
                    </div>
                  );
                })}
              </div>

              <div className="w-full relative">
                <img
                  src="https://drive.google.com/thumbnail?id=1_w9ZDvqic5tHrBF-jkmD_OnaegWScL4D&sz=w1000"
                  onError={(e) => {
                    e.currentTarget.src = "https://lh3.googleusercontent.com/d/1_w9ZDvqic5tHrBF-jkmD_OnaegWScL4D";
                  }}
                  alt="수원시장애인종합복지관 개관 20주년 기념식 초대장"
                  className="w-full h-auto object-cover mix-blend-multiply rounded-2xl animate-fade-in"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* 4. Countdown Timer Widget (Premium Pink-Purple-Gold Accent Card) */}
            <div className="bg-gradient-to-br from-[#FFF5F8] via-white to-[#F6F0FF] border border-pink-100/60 rounded-3xl p-5.5 text-center space-y-4 shadow-md relative overflow-hidden">
              {/* Decorative top gradient light glow */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#EC4899]/30 via-[#C5A059]/30 to-[#8B5CF6]/30" />
              
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EC4899] animate-pulse" />
                <p className="text-[11px] font-bold text-slate-700 tracking-[0.15em] uppercase font-sans">
                  개관 20주년 기념식까지
                </p>
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] animate-pulse" />
              </div>

              {/* Elegant Days-Only countdown block */}
              <div className="inline-flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs rounded-2xl py-4 px-10 border border-purple-100/50 shadow-xs min-w-[160px] hover:border-pink-200 transition-all">
                <span className="block text-4xl font-black bg-gradient-to-r from-[#EC4899] via-[#C5A059] to-[#8B5CF6] bg-clip-text text-transparent font-mono tracking-tight leading-none">
                  {countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 ? 'D-DAY' : `D-${countdown.days}`}
                </span>
                <span className="block text-[10px] font-bold text-slate-400 tracking-widest mt-2 uppercase font-sans">
                  DAYS REMAINING
                </span>
              </div>
            </div>

            {/* 5. Invitation Letter (초대의 글, Premium Styled Paper Vibe) */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-5.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#EC4899]/5 rounded-full -mr-10 -mt-10 opacity-60 blur-xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8B5CF6]/5 rounded-full -ml-10 -mb-10 opacity-60 blur-xl" />

              <div className="flex justify-center text-[#EC4899]">
                <Heart className="w-5 h-5 fill-[#EC4899]/10" />
              </div>

              <h3 className="text-center text-base font-serif font-bold text-slate-900 tracking-tight leading-relaxed">
                스무 살, 더 밝게 빛날 우리
              </h3>

              <div className="text-xs text-slate-600 font-serif text-center space-y-5 px-1.5">
                <p className="leading-relaxed break-keep">
                  신선한 바람이 기분 좋은 가을,<br />
                  수원시장애인종합복지관이 뜻깊은 개관 20주년을 맞이했습니다.
                </p>

                <p className="leading-relaxed break-keep">
                  지난 20년 동안 서로의 다름을 이해하고 마음을 잇는 동행으로<br />
                  공감과 포용의 사회를 만들기 위해 쉼 없이 걸어왔습니다.
                </p>

                <p className="leading-relaxed break-keep">
                  스무 살을 맞이한 올해,<br />
                  우리가 함께 만들어갈 ‘더 밝게 빛날 우리’를 향해<br />
                  다시 한번 새로운 발걸음을 내딛고자 합니다.
                </p>

                <p className="leading-relaxed break-keep">
                  바쁘시더라도 참석하시어<br />
                  이 자리를 더욱 따뜻하고 뜻깊게 빛내주시기 바랍니다.
                </p>

                <p className="leading-relaxed font-semibold text-slate-600">
                  감사합니다.
                </p>
              </div>

              <div className="pt-4 text-center border-t border-slate-100">
                <p className="text-[11.5px] text-slate-800 font-serif font-bold tracking-wide">수원시장애인종합복지관 관장 한해영</p>
              </div>
            </div>

            {/* 6. Event Core Schedule & Program Cards */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
                <Calendar className="w-4.5 h-4.5 text-[#C5A059]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">행사 주요 일정</h3>
              </div>

              <div className="space-y-4">
                {/* Time & Date */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">일시</h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      2026년 9월 17일(목) 오전 10:40
                    </p>
                  </div>
                </div>

                {/* Venue Location */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">장소</h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                      수원중앙침례교회 4층 중앙예닮홀<br />
                      <span className="text-[11px] text-slate-400 font-normal block mt-0.5">
                        (경기도 수원시 팔달구 매산로 108)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Program Outline (주요 행사) */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-l-2 border-[#C5A059] pl-2">주요 행사</h4>
                <div className="space-y-3.5 text-[11px]">
                  {[
                    '기념식',
                    '행복한 밥상',
                    '장애인식개선 부스'
                  ].map((title, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 text-slate-600 leading-normal border-b border-dashed border-slate-200/60 pb-2.5 last:border-0 last:pb-0">
                      <span className="font-mono font-bold text-[10px] text-[#C5A059] bg-slate-100 px-2.5 py-0.5 rounded-md min-w-[28px] text-center border border-slate-200/30">0{idx + 1}</span>
                      <span className="font-bold text-slate-800 text-xs">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RSVP Button (Opens Google Form in a new tab) */}
            <div className="text-center py-1">
              <a
                href="https://forms.gle/miJuRaFHrAxfuUzh8"
                target="_blank"
                rel="noopener noreferrer"
                id="google-rsvp-button"
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-900 active:scale-[0.98]"
              >
                <Heart className="w-4 h-4 text-[#EC4899] fill-[#EC4899]" />
                <span className="text-xs tracking-wide">
                  참석여부 등록하기
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* 8. Location Instructions Section */}
            <LocationMap />

            {/* 9. Contact & Inquiry Section (Delicate and high-end) */}
            <div className="bg-white rounded-3xl p-6.5 border border-slate-100 shadow-sm space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Inquiry / 행사 문의</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-lg font-extrabold text-slate-900 font-mono tracking-wide">
                  <a href="tel:031-548-5613" className="hover:underline text-slate-800">031-548-5613</a>
                  <span className="text-slate-300 mx-2.5">/</span>
                  <a href="tel:031-548-5609" className="hover:underline text-slate-800">5609</a>
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  수원시장애인종합복지관 담당자 연락처
                </p>
              </div>
            </div>

          </div>

          {/* Footer Copyright */}
          <div className="py-8 bg-slate-100/40 border-t border-slate-200/40 px-6 text-center">
            <div className="text-[9.5px] text-slate-400 font-medium font-sans">
              © 2026 수원시장애인종합복지관. All Rights Reserved.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
