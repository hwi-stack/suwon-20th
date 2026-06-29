import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Copy, Check, Navigation, Train, Bus, Info } from 'lucide-react';

export default function LocationMap() {
  const [copied, setCopied] = useState(false);
  const address = "경기도 수원시 팔달구 매산로 108 (수원중앙침례교회)";
  const venueName = "수원중앙침례교회 4층 중앙예닮홀";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Modern Map links
  const mapLinks = {
    kakao: `https://map.kakao.com/link/search/${encodeURIComponent(address)}`,
    naver: `https://map.naver.com/v5/search/${encodeURIComponent(address)}`,
    google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  };

  return (
    <div className="py-8 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
          <MapPin className="w-5 h-5 text-[#C5A059]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight font-serif">오시는 길 안내</h3>
          <p className="text-xs text-gray-500">기념식 장소 및 오시는 방법</p>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-[#FAF9F5] border border-slate-200/60 rounded-2xl p-4 space-y-3">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-700 bg-slate-200/50 px-2.5 py-0.5 rounded-full">
            장소
          </span>
          <h4 className="text-sm font-bold text-gray-800 pt-1">{venueName}</h4>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">{address}</p>
        </div>

        <button
          onClick={handleCopy}
          id="copy-address-button"
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white border border-gray-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-gray-700 shadow-xs hover:bg-slate-50 active:scale-[0.98] transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600 font-bold">주소가 복사되었습니다</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>지번/도로명 주소 복사하기</span>
            </>
          )}
        </button>
      </div>

      {/* Vector Styled Map Graphic for visual high polish - Realistic Map Preview */}
      <div className="relative h-48 bg-[#f5f4f0] border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Real-map SVG representation */}
        <svg className="w-full h-full select-none" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Greenery / Park blocks */}
          <path d="M 0,0 L 90,0 L 90,70 L 0,70 Z" fill="#e1ecc8" opacity="0.8" />
          <path d="M 270,0 L 400,0 L 400,60 L 270,60 Z" fill="#e1ecc8" opacity="0.8" />
          <path d="M 0,140 L 110,140 L 110,200 L 0,200 Z" fill="#e8f3d6" opacity="0.6" />
          
          {/* Minor Block outlines / Building foot-prints */}
          <rect x="130" y="10" width="35" height="25" rx="3" fill="#e3e1d5" stroke="#dbd9cb" strokeWidth="0.5" />
          <rect x="180" y="15" width="40" height="20" rx="3" fill="#e3e1d5" stroke="#dbd9cb" strokeWidth="0.5" />
          <rect x="300" y="15" width="45" height="30" rx="3" fill="#d0dfb5" stroke="#bfcfa2" strokeWidth="0.5" /> {/* Tax Office */}
          
          {/* Main Roads with realistic styling */}
          {/* Mae-san-ro Horizontal Main Street */}
          <rect x="0" y="80" width="400" height="38" fill="#ffffff" stroke="#dfdbcd" strokeWidth="1" />
          <line x1="0" y1="99" x2="400" y2="99" stroke="#ebe6d7" strokeWidth="1" strokeDasharray="6 4" />
          
          {/* Intersecting vertical street 1 (Hyanggyo-ro / left) */}
          <rect x="90" y="0" width="26" height="200" fill="#ffffff" stroke="#dfdbcd" strokeWidth="1" />
          
          {/* Intersecting vertical street 2 (Docheong-ro / right) */}
          <rect x="250" y="0" width="28" height="200" fill="#ffffff" stroke="#dfdbcd" strokeWidth="1" />

          {/* Road labels */}
          <text x="35" y="103" fill="#8d8a7c" fontSize="8" fontWeight="bold" fontFamily="sans-serif">매산로</text>
          <text x="315" y="103" fill="#8d8a7c" fontSize="8" fontWeight="bold" fontFamily="sans-serif">매산로사거리 방면</text>
          <text x="103" y="30" fill="#a09d8f" fontSize="7" fontWeight="bold" fontFamily="sans-serif" writingMode="tb" glyphOrientationVertical="0">향교로</text>
          <text x="264" y="30" fill="#a09d8f" fontSize="7" fontWeight="bold" fontFamily="sans-serif" writingMode="tb" glyphOrientationVertical="0">도청로</text>

          {/* Landmarks text on map */}
          <text x="322" y="30" fill="#666458" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">수원세무서</text>
          <circle cx="322" cy="18" r="3" fill="#94a3b8" />
          
          <text x="45" y="35" fill="#666458" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">가족여성회관</text>
          <circle cx="45" cy="22" r="3" fill="#94a3b8" />

          {/* Subway Station preview on the left */}
          <g transform="translate(15, 99)">
            <circle cx="0" cy="0" r="8" fill="#0052A4" stroke="#ffffff" strokeWidth="1" />
            <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">1</text>
            <rect x="12" y="-12" width="48" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="36" y="1" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">수원역</text>
            <text x="36" y="8" fill="#64748b" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle">수인분당선</text>
          </g>

          {/* Bus stops preview with real route labels */}
          <g transform="translate(264, 135)">
            <circle cx="0" cy="0" r="5" fill="#0090ff" stroke="#ffffff" strokeWidth="1" />
            <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">H</text>
            <rect x="8" y="-7" width="80" height="15" rx="3" fill="#ffffff" stroke="#93c5fd" strokeWidth="0.5" />
            <text x="48" y="3.5" fill="#1e3a8a" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">수원세무서 정류장</text>
          </g>

          {/* Target location marker (수원중앙침례교회) */}
          <g transform="translate(182, 99)">
            {/* Glowing ripple background */}
            <circle cx="0" cy="0" r="14" fill="#E11D48" opacity="0.15" className="animate-ping" />
            <circle cx="0" cy="0" r="8" fill="#E11D48" opacity="0.25" />
            
            {/* Elegant teardrop Pin */}
            <path d="M 0,0 C -6,-6 -10,-13 -10,-20 C -10,-26 -5,-31 0,-31 C 5,-31 10,-26 10,-20 C 10,-13 6,-6 0,0 Z" fill="#E11D48" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="0" cy="-20" r="3.5" fill="#ffffff" />
            
            {/* Overlay Banner Card above pin */}
            <g transform="translate(0, -36)">
              {/* Drop shadow backer */}
              <rect x="-65" y="-28" width="130" height="26" rx="6" fill="#1e293b" opacity="0.08" />
              {/* White bubble */}
              <rect x="-64" y="-29" width="128" height="25" rx="6" fill="#ffffff" stroke="#E11D48" strokeWidth="1.5" />
              {/* Accent point */}
              <polygon points="0,0 -4,-4 4,-4" fill="#ffffff" stroke="#E11D48" strokeWidth="1.5" transform="translate(0, -3.5)" />
              <polygon points="0,0 -3,-3 3,-3" fill="#ffffff" transform="translate(0, -5)" />
              
              {/* Text content inside banner */}
              <text x="0" y="-17" fill="#0f172a" fontSize="8.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">수원중앙침례교회</text>
              <text x="0" y="-8" fill="#E11D48" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">4F 중앙예닮홀 (식장)</text>
            </g>
          </g>

          {/* Map widgets (Scale, Compass, Zoom) */}
          {/* Scale Indicator */}
          <g transform="translate(12, 180)">
            <line x1="0" y1="0" x2="30" y2="0" stroke="#666458" strokeWidth="1.5" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#666458" strokeWidth="1" />
            <line x1="15" y1="-2" x2="15" y2="2" stroke="#666458" strokeWidth="0.5" />
            <line x1="30" y1="-3" x2="30" y2="3" stroke="#666458" strokeWidth="1" />
            <text x="15" y="8" fill="#666458" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">100m</text>
          </g>

          {/* Compass Rose */}
          <g transform="translate(378, 22)">
            <circle cx="0" cy="0" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <polygon points="0,-7 -3,2 0,0" fill="#ef4444" />
            <polygon points="0,7 -3,2 0,0" fill="#94a3b8" />
            <polygon points="0,-7 3,2 0,0" fill="#ef4444" />
            <polygon points="0,7 3,2 0,0" fill="#94a3b8" />
            <text x="0" y="-1" fill="#ef4444" fontSize="5" fontWeight="bold" textAnchor="middle">N</text>
          </g>

          {/* Zoom Buttons */}
          <g transform="translate(378, 140)">
            {/* Box container */}
            <rect x="-8" y="-16" width="16" height="32" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#e2e8f0" strokeWidth="1" />
            {/* Plus */}
            <line x1="-4" y1="-8" x2="4" y2="-8" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="-12" x2="0" y2="-4" stroke="#475569" strokeWidth="1.5" />
            {/* Minus */}
            <line x1="-4" y1="8" x2="4" y2="8" stroke="#475569" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Badge detailing map links below */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center">
          <span className="text-[9.5px] text-gray-600 bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-gray-200 rounded-md shadow-2xs font-medium">
            ※ 아래 길찾기 버튼으로 실시간 내비게이션 연결이 가능합니다
          </span>
        </div>
      </div>

      {/* Map Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <a
          href={mapLinks.kakao}
          target="_blank"
          rel="noopener noreferrer"
          id="kakao-map-link"
          className="flex flex-col items-center justify-center py-2.5 px-1 bg-yellow-50 hover:bg-yellow-100/80 border border-yellow-100 rounded-xl transition-colors text-center"
        >
          <Navigation className="w-4 h-4 text-yellow-800 mb-1" />
          <span className="text-[11px] font-bold text-yellow-900">카카오맵</span>
        </a>
        <a
          href={mapLinks.naver}
          target="_blank"
          rel="noopener noreferrer"
          id="naver-map-link"
          className="flex flex-col items-center justify-center py-2.5 px-1 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 rounded-xl transition-colors text-center"
        >
          <Navigation className="w-4 h-4 text-emerald-800 mb-1" />
          <span className="text-[11px] font-bold text-emerald-900">네이버지도</span>
        </a>
        <a
          href={mapLinks.google}
          target="_blank"
          rel="noopener noreferrer"
          id="google-map-link"
          className="flex flex-col items-center justify-center py-2.5 px-1 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-xl transition-colors text-center"
        >
          <Navigation className="w-4 h-4 text-blue-800 mb-1" />
          <span className="text-[11px] font-bold text-blue-900">구글지도</span>
        </a>
      </div>

      {/* Transportation details */}
      <div className="space-y-3 pt-2">
        {/* Subway info */}
        <div className="flex gap-3">
          <div className="p-1 w-6 h-6 shrink-0 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center">
            <Train className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-gray-800">지하철 이용 시</h5>
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-blue-700">1호선/수인분당선 수원역 9번 출구</strong>에서 도보 약 12분 (매산로 사거리 방면으로 700m 직진), 또는 버스 환승 후 세무서 앞 정류장 하차
            </p>
          </div>
        </div>

        {/* Bus info */}
        <div className="flex gap-3">
          <div className="p-1 w-6 h-6 shrink-0 bg-green-50 text-green-600 rounded-md flex items-center justify-center">
            <Bus className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-gray-800">버스 이용 시</h5>
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">수원세무서·도청입구</span> 또는 <span className="font-semibold text-gray-800">도청오거리</span> 정류장 하차 (도보 2~3분)
              <br />
              <span className="text-[11px] text-gray-500">일반: 2, 7, 7-2, 13, 13-4, 82-1, 720-2 등</span>
            </p>
          </div>
        </div>

        {/* Parking info */}
        <div className="flex gap-3">
          <div className="p-1 w-6 h-6 shrink-0 bg-amber-50 text-amber-600 rounded-md flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-gray-800">자가용 및 주차 안내</h5>
            <p className="text-xs text-gray-600 leading-relaxed">
              수원중앙침례교회 주차장 이용 가능. 행사 당일은 주차 공간이 매우 혼잡할 수 있으니 가급적 대중교통 이용을 부탁드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
