import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { checkSchema } from 'react'; // Not needed, let's keep it simple
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, AlertCircle, Sparkles, Send, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function RsvpForm() {
  const [org, setOrg] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [showConsentTerms, setShowConsentTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Phone auto-formatting: 010-1234-5678
  const formatPhone = (val: string): string => {
    const raw = val.replace(/[^0-9]/g, '');
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!org.trim()) {
      setErrorMsg('기관명을 입력해 주세요.');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('참석자명을 입력해 주세요.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('올바른 핸드폰 번호를 입력해 주세요.');
      return;
    }
    if (!consent) {
      setErrorMsg('개인정보 제공에 동의하셔야 참석 등록이 가능합니다.');
      return;
    }

    setLoading(true);

    try {
      // Create a document with an auto-generated ID from client collection reference
      const rsvpColRef = collection(db, 'rsvps');
      const newDocRef = doc(rsvpColRef);
      const rsvpId = newDocRef.id;

      const payload = {
        organization: org.trim(),
        name: name.trim(),
        phone: phone.trim(),
        consent: true,
        createdAt: serverTimestamp()
      };

      await setDoc(newDocRef, payload);
      setSuccess(true);
      
      // Reset form
      setOrg('');
      setName('');
      setPhone('');
      setConsent(false);
    } catch (err: any) {
      console.error("RSVP Submission Error:", err);
      setErrorMsg('참석 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      
      // Conforms to the handleFirestoreError constraint
      try {
        handleFirestoreError(err, OperationType.CREATE, 'rsvps');
      } catch (innerErr) {
        // Let outer handler capture or logs
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
      {/* Form Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">참석 여부 등록</h3>
          <p className="text-xs text-gray-500">기념식 준비를 위한 참석 조사를 진행합니다</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-4"
          >
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-900">참석 등록 완료</h4>
              <p className="text-xs text-emerald-700 leading-relaxed">
                성공적으로 초청장 참석 여부가 등록되었습니다.<br />
                소중한 걸음으로 20주년을 빛내주셔서 감사합니다.
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              추가 등록하기
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Organization */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                기관명 <span className="text-rose-500">*</span>
                <span className="text-[10px] font-normal text-gray-400">(개인 참여 시 &apos;개인&apos; 입력)</span>
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="예: 수원종합사회복지관"
                maxLength={80}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-amber-500 focus:bg-white rounded-xl text-sm text-gray-800 transition-all focus:outline-none"
              />
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">
                참석자명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동"
                maxLength={50}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-amber-500 focus:bg-white rounded-xl text-sm text-gray-800 transition-all focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">
                핸드폰 번호 <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="예: 010-1234-5678"
                maxLength={13}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-amber-500 focus:bg-white rounded-xl text-sm text-gray-800 transition-all focus:outline-none"
              />
            </div>

            {/* Consent Terms Checkbox */}
            <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4.5 space-y-3.5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-0.5 w-4.5 h-4.5 rounded-sm accent-amber-600 cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-gray-700 leading-normal cursor-pointer font-medium select-none">
                  개인정보 수집 및 이용 동의 <span className="text-rose-500 font-bold">*</span>
                </label>
              </div>

              {/* View Terms Button */}
              <button
                type="button"
                onClick={() => setShowConsentTerms(!showConsentTerms)}
                className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-amber-700"
              >
                <span>상세 동의 내용 보기</span>
                {showConsentTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <AnimatePresence>
                {showConsentTerms && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white border border-gray-150 rounded-lg p-3 text-[10px] text-gray-500 leading-relaxed max-h-24 overflow-y-auto">
                      <p className="font-bold mb-1 text-gray-700">1. 개인정보 수집·이용 동의</p>
                      <p>• 수집 및 이용 항목: 기관명, 참석자명, 핸드폰 번호</p>
                      <p>• 수집 및 이용 목적: 수원시장애인종합복지관 개관 20주년 기념식 초청자 참석 현황 관리 및 안내 연락</p>
                      <p>• 보유 및 이용 기간: 기념식 행사 종료 및 참석자 정산 처리 완료 후 즉시 파기 (최대 1개월 이내)</p>
                      <p>• 동의 거부 권리: 귀하는 개인정보 수집 및 이용 동의를 거부할 권리가 있으며, 동의 거부 시 초청장 참석 여부 등록 및 행사 참가 통계 처리가 불가능합니다.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              id="submit-rsvp-button"
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all ${
                loading
                  ? 'bg-amber-400 cursor-not-allowed opacity-80'
                  : 'bg-amber-600 hover:bg-amber-700 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>참석 등록하는 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4.5 h-4.5" />
                  <span>기념식 참석 여부 등록하기</span>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
