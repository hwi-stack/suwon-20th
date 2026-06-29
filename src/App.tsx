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
  Music,
  Volume2,
  VolumeX
} from 'lucide-react';
import LocationMap from './components/LocationMap';
import RsvpForm from './components/RsvpForm';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isPlayingBgm, setIsPlayingBgm] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userMutedRef = useRef(false);

  const eventDate = new Date('2026-09-17T10:40:00');

  // Attempt automatic play on load or on first user interaction (unlock audio context)
  useEffect(() => {
    // Attempt standard autoplay
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlayingBgm(true);
        })
        .catch((err) => {
          console.warn("Autoplay was blocked by the browser. Waiting for user interaction to play.", err);
        });
    }

    const startAudioOnInteraction = () => {
      if (userMutedRef.current) {
        cleanup();
        return;
      }
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlayingBgm(true);
            cleanup();
          })
          .catch((err) => {
            console.warn("Audio play on interaction failed:", err);
          });
      } else {
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };

    window.addEventListener('click', startAudioOnInteraction);
    window.addEventListener('touchstart', startAudioOnInteraction);

    return () => cleanup();
  }, []);

  const handleBgmToggle = () => {
    if (!audioRef.current) return;
    if (isPlayingBgm) {
      audioRef.current.pause();
      setIsPlayingBgm(false);
      userMutedRef.current = true;
    } else {
      userMutedRef.current = false;
      audioRef.current.play()
        .then(() => {
          setIsPlayingBgm(true);
        })
        .catch((err) => {
          console.warn("Audio play failed:", err);
        });
    }
  };

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
    <div className="min-h-screen bg-slate-100/60 font-sans flex items-center justify-center py-0 sm:py-6 md:py-10 selection:bg-amber-100 selection:text-amber-900">
      <audio
        ref={audioRef}
        src="https://docs.google.com/uc?export=download&id=1DgdV4DEDnBe42e3T0cbjv9ubtMdW01FE"
        loop
        preload="auto"
        autoPlay
      />
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-[#FAF9F5] min-h-screen sm:min-h-[840px] sm:rounded-[40px] shadow-2xl shadow-slate-900/10 border-0 sm:border-[8px] border-slate-900/5 flex flex-col justify-between overflow-hidden relative">
        
        {/* Top Premium Gold Highlight Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-900 via-[#C5A059] to-slate-900 z-50" />

        {/* Floating Action Buttons (BGM & Share) */}
        <div className="absolute top-4 right-4 flex items-center gap-2.5 z-40">
          {/* BGM Toggle Button */}
          <button
            onClick={handleBgmToggle}
            id="bgm-toggle-button"
            className={`p-2.5 rounded-full border shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer relative ${
              isPlayingBgm 
                ? 'bg-slate-900 border-slate-900 text-[#C5A059]' 
                : 'bg-white/90 backdrop-blur-xs border-slate-200 text-slate-700 hover:bg-white'
            }`}
            title={isPlayingBgm ? '배경음악 끄기' : '배경음악 켜기'}
          >
            {isPlayingBgm ? (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
                </span>
              </>
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

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
          {/* Logo and Small Image Row */}
          <div className="flex justify-between items-center px-6 pt-7 pb-2 select-none">
            <img
              src="https://lh3.googleusercontent.com/d/1TsoXsUjiQ4ngo_85vcmPtEeBVCRGm_ee"
              onError={(e) => {
                e.currentTarget.src = "https://drive.google.com/thumbnail?id=1TsoXsUjiQ4ngo_85vcmPtEeBVCRGm_ee&sz=w200";
              }}
              alt="수원시장애인종합복지관 로고"
              className="h-6 w-auto object-contain mix-blend-multiply opacity-85"
              referrerPolicy="no-referrer"
            />
            <img
              src="https://lh3.googleusercontent.com/d/14XFJXDdh0DNgcKk6O8En06XZTRTDi3xA"
              onError={(e) => {
                e.currentTarget.src = "https://drive.google.com/thumbnail?id=14XFJXDdh0DNgcKk6O8En06XZTRTDi3xA&sz=w200";
              }}
              alt="20주년 기념 엠블럼"
              className="h-8.5 w-auto object-contain mix-blend-multiply opacity-85"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-8 pt-4 px-5 pb-12">
            
            {/* 1. visual Invitation Cover (Seamlessly Blending with Background, Highly Professional Gold/Charcoal Design) */}
            <div className="w-full py-6 flex flex-col items-center relative overflow-hidden">
              {/* Scattered Sparkles & Dots mimicking the uploaded image in subtle gold/champagne */}
              <div className="absolute top-[8%] left-[8%] text-[#C5A059] text-xs animate-pulse opacity-80">✦</div>
              <div className="absolute top-[14%] right-[10%] text-[#C5A059] text-sm animate-pulse opacity-60">✦</div>
              <div className="absolute bottom-[25%] left-[6%] text-[#C5A059] text-xs animate-bounce opacity-70">✦</div>
              <div className="absolute bottom-[12%] right-[8%] text-[#C5A059] text-xs animate-ping opacity-55">✦</div>
              
              {/* Soft abstract brand circular highlights */}
              <div className="absolute top-[32%] right-[-10px] w-6 h-6 border border-[#C5A059]/15 rounded-full" />
              <div className="absolute bottom-[35%] left-[-15px] w-8 h-8 bg-[#C5A059]/5 rounded-full" />
              
              {/* Top Invitation Brand SVG with luxurious gold/bronze gradients */}
              <div className="w-full flex justify-center py-4 select-none">
                <svg className="w-[270px] h-[135px] overflow-visible" viewBox="0 0 260 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="invitationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2C58A" />
                      <stop offset="50%" stopColor="#C5A059" />
                      <stop offset="100%" stopColor="#927035" />
                    </linearGradient>
                  </defs>

                  {/* Sparkle top right in subtle gold */}
                  <g transform="translate(242, 12)" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
                    <line x1="0" y1="-7" x2="0" y2="7" />
                    <line x1="-7" y1="0" x2="7" y2="0" />
                    <line x1="-5" y1="-5" x2="5" y2="5" />
                    <line x1="-5" y1="5" x2="5" y2="-5" />
                  </g>

                  {/* Sparkle top left */}
                  <g transform="translate(12, 12)" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
                    <line x1="0" y1="-5" x2="0" y2="5" />
                    <line x1="-5" y1="0" x2="5" y2="0" />
                  </g>

                  {/* Left decorative line with circle (matches original) */}
                  <g transform="translate(10, 68)" stroke="#C5A059" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
                    <line x1="0" y1="0" x2="14" y2="-14" />
                    <circle cx="14" cy="-14" r="3.5" fill="#FAF9F5" stroke="#C5A059" strokeWidth="1.8" />
                  </g>

                  {/* Bottom right decorative diagonal line */}
                  <g transform="translate(235, 105)" stroke="#C5A059" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
                    <line x1="0" y1="12" x2="14" y2="0" />
                  </g>

                  {/* "invi" */}
                  <text 
                    x="10" 
                    y="55" 
                    fill="url(#invitationGrad)" 
                    fontFamily="system-ui, -apple-system, sans-serif" 
                    fontWeight="900" 
                    fontSize="58" 
                    letterSpacing="-2"
                  >
                    invi
                  </text>
                  
                  {/* Cute custom ring dots for 'i' letters mimicking original lollipop rings in elegant gold */}
                  <circle cx="20.5" cy="11.5" r="6.5" fill="#FAF9F5" stroke="url(#invitationGrad)" strokeWidth="4" />
                  <circle cx="112.5" cy="11.5" r="6.5" fill="#FAF9F5" stroke="url(#invitationGrad)" strokeWidth="4" />

                  {/* Date Badge: 2026 / 09.17 */}
                  <g transform="translate(152, 12)">
                    <text 
                      x="0" 
                      y="20" 
                      fill="#1E293B" 
                      fontFamily="system-ui, -apple-system, sans-serif" 
                      fontWeight="800" 
                      fontSize="21"
                      letterSpacing="-0.5"
                    >
                      2026
                    </text>
                    <text 
                      x="0" 
                      y="42" 
                      fill="#C5A059" 
                      fontFamily="system-ui, -apple-system, sans-serif" 
                      fontWeight="800" 
                      fontSize="21"
                      letterSpacing="-0.5"
                    >
                      09.17
                    </text>
                  </g>

                  {/* "tation" */}
                  <text 
                    x="25" 
                    y="108" 
                    fill="url(#invitationGrad)" 
                    fontFamily="system-ui, -apple-system, sans-serif" 
                    fontWeight="900" 
                    fontSize="58" 
                    letterSpacing="-2"
                  >
                    tation
                  </text>

                  {/* Underline flourishment signature */}
                  <path 
                    d="M 12 114 L 215 114" 
                    stroke="url(#invitationGrad)" 
                    strokeWidth="5.5" 
                    strokeLinecap="round" 
                  />
                  {/* Tail curl */}
                  <path 
                    d="M 14 114 C 4 114 -3.5 106 -3.5 95.5 C -3.5 85 4.5 77 15 77 C 25.5 77 34 85 34 95.5" 
                    fill="none" 
                    stroke="url(#invitationGrad)" 
                    strokeWidth="5.5" 
                    strokeLinecap="round" 
                  />
                </svg>
              </div>

              {/* Elegant divider horizontal line */}
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent my-6" />

              {/* Title & Organization Info in High-Class Serif Typography */}
              <div className="text-center space-y-4">
                <span className="text-xs font-bold tracking-[0.3em] text-[#C5A059] uppercase inline-block font-sans">
                  개관 20주년
                </span>
                
                <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tight leading-normal px-2">
                  기념식
                </h1>

                {/* Event Core Schedule Info in clean premium layout */}
                <div className="space-y-2 pt-4 font-sans">
                  <div className="text-sm font-semibold text-slate-800 tracking-wide">
                    2026. 9. 17 (목) 오전 10:40 - 12:00
                  </div>
                  <div className="text-xs font-medium text-slate-500 tracking-wide">
                    수원중앙침례교회 4층 중앙예닮홀
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Countdown Timer Widget (Luxurious Dark Minimalist Slate Style) */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5.5 text-center space-y-4 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />
              <p className="text-[11px] font-bold text-[#C5A059] tracking-[0.2em] uppercase font-sans">
                개관 20주년 기념식 카운트다운
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { label: 'DAYS', val: countdown.days },
                  { label: 'HOURS', val: countdown.hours },
                  { label: 'MINS', val: countdown.minutes },
                  { label: 'SECS', val: countdown.seconds }
                ].map((t) => (
                  <div key={t.label} className="bg-white/[0.04] backdrop-blur-md rounded-2xl py-3 px-1 border border-white/[0.06] shadow-inner">
                    <span className="block text-2xl font-extrabold text-white font-mono tracking-tight">
                      {String(t.val).padStart(2, '0')}
                    </span>
                    <span className="block text-[8px] font-bold text-slate-400 tracking-wider mt-1">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Invitation Letter (초대의 글, Premium Styled Paper Vibe) */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-5.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-full -mr-10 -mt-10 opacity-60 blur-xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#C5A059]/5 rounded-full -ml-10 -mb-10 opacity-60 blur-xl" />

              <div className="flex justify-center text-[#C5A059]">
                <Heart className="w-5 h-5 fill-[#C5A059]/10" />
              </div>

              <h3 className="text-center text-lg font-serif font-bold text-slate-900 tracking-tight">
                &ldquo;함께한 20년, 함께할 미래&rdquo;
              </h3>

              <div className="text-xs text-slate-600 leading-relaxed font-serif text-center space-y-4 px-1.5">
                <p>
                  따스한 햇살 가든한 가을날,<br />
                  수원시장애인종합복지관이 지역사회와 함께<br />
                  사랑과 동행의 발걸음을 내디딘 지<br />
                  어느덧 <strong className="text-[#C5A059] font-bold">20주년</strong>을 맞이하였습니다.
                </p>
                <p>
                  지난 20년 동안 변함없는 애정과 관심으로<br />
                  우리 복지관과 함께해주시고 든든한 버팀목이<br />
                  되어주신 고마운 분들을 모시고,<br />
                  지나온 여정을 나누고 더 나은 미래를<br />
                  선포하는 감사와 약속의 자리를 마련했습니다.
                </p>
                <p>
                  부디 귀한 걸음 하시어 자리를 빛내주시고,<br />
                  따뜻한 축하와 희망의 격려를 보내주시면<br />
                  더없는 기쁨과 영광이 되겠습니다.
                </p>
              </div>

              <div className="pt-3 text-center border-t border-slate-100">
                <p className="text-[10.5px] text-slate-400 font-sans font-medium tracking-wide">수원시장애인종합복지관 직원 일동 올림</p>
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
                      2026년 9월 17일(목) 오전 10:40 ~ 12:00
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

              {/* Program Outline (식순) */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-l-2 border-[#C5A059] pl-2">행사 순서 (식순)</h4>
                <div className="space-y-3.5 text-[11px]">
                  {[
                    '식전 행사 및 축하 공연',
                    '개회 선언, 국민의례 및 내빈 소개',
                    '기념사, 축사 및 격려사',
                    '20주년 유공자 시상식',
                    '축하 영상 상영, 기념촬영 및 폐회'
                  ].map((title, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 text-slate-600 leading-normal border-b border-dashed border-slate-200/60 pb-2.5 last:border-0 last:pb-0">
                      <span className="font-mono font-bold text-[10px] text-[#C5A059] bg-slate-100 px-2.5 py-0.5 rounded-md min-w-[28px] text-center border border-slate-200/30">0{idx + 1}</span>
                      <span className="font-bold text-slate-800 text-xs">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RSVP Toggle Button (Premium Deep Slate styling) */}
            <div className="text-center py-1">
              <button
                onClick={() => setShowRsvp(!showRsvp)}
                id="toggle-rsvp-button"
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-900"
              >
                <Heart className={`w-4 h-4 text-[#C5A059] ${showRsvp ? 'fill-[#C5A059]' : ''}`} />
                <span className="text-xs tracking-wide">
                  {showRsvp ? '참석여부 등록창 닫기' : '참석여부 등록하기'}
                </span>
                {showRsvp ? <ChevronUp className="w-4 h-4 text-[#C5A059]" /> : <ChevronDown className="w-4 h-4 text-[#C5A059]" />}
              </button>
            </div>

            {/* RSVP Form with collapse transition */}
            <AnimatePresence>
              {showRsvp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <RsvpForm />
                </motion.div>
              )}
            </AnimatePresence>

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

          {/* 9. Small Accordion Admin Panel at the very bottom */}
          <div className="py-8 bg-slate-100/40 border-t border-slate-200/40 px-6 text-center space-y-4">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              id="toggle-admin-panel"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors py-1.5 px-3.5 rounded-full hover:bg-slate-200/40 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>수원장복 관리자 페이지</span>
              {showAdmin ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showAdmin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden text-left"
                >
                  <div className="pt-2">
                    <AdminPanel />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="text-[9.5px] text-slate-400 font-medium font-sans">
              © 2026 수원시장애인종합복지관. All Rights Reserved.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
