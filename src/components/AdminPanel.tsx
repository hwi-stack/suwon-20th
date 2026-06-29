import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  Lock,
  Unlock,
  Users,
  Search,
  Trash2,
  Download,
  LogOut,
  Sparkles,
  ShieldAlert,
  LogIn,
  Key,
  CheckCircle,
  Building,
  PhoneCall
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { RsvpData } from '../types';

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [unlockedWithPasscode, setUnlockedWithPasscode] = useState(false);

  // Firestore RSVP Data State
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Success/Error Feedback States
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const ADMIN_PASSCODE = '0926'; // Custom admin passcode

  // 1. Auth Change Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        checkAdminStatus(user);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Check if user is registered in 'admins' collection
  const checkAdminStatus = async (user: User) => {
    setCheckingAdmin(true);
    try {
      // Check if user is in the admins collection by direct document look-up
      // To satisfy rules, we fetch and see if we can get it, or listen to snap.
      // But since users might want to quickly register, let's create a snapshot listener or direct check.
      const adminDocRef = doc(db, 'admins', user.uid);
      
      // Let's attach a listener to see if this document exists
      onSnapshot(adminDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setCheckingAdmin(false);
      }, (err) => {
        setIsAdmin(false);
        setCheckingAdmin(false);
      });
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      setCheckingAdmin(false);
    }
  };

  // 3. Login using Google Auth
  const handleGoogleLogin = async () => {
    setMessage(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setMessage({ text: '구글 로그인이 성공했습니다.', type: 'success' });
    } catch (err: any) {
      console.error("Login Error:", err);
      setMessage({ text: '로그인 도중 오류가 발생했습니다: ' + err.message, type: 'error' });
    }
  };

  // 4. Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUnlockedWithPasscode(false);
      setMessage({ text: '로그아웃 되었습니다.', type: 'success' });
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // 5. Passcode Bypass
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (passcode.trim() === ADMIN_PASSCODE) {
      setUnlockedWithPasscode(true);
      setMessage({ text: '관리자 비밀번호로 로그인되었습니다.', type: 'success' });
    } else {
      setMessage({ text: '비밀번호가 올바르지 않습니다.', type: 'error' });
    }
  };

  // 6. Bootstrap/Register Admin Action
  const registerCurrentAsAdmin = async () => {
    if (!currentUser) return;
    setMessage(null);
    try {
      const adminDocRef = doc(db, 'admins', currentUser.uid);
      await setDoc(adminDocRef, {
        uid: currentUser.uid,
        email: currentUser.email || '',
        createdAt: serverTimestamp()
      });
      setIsAdmin(true);
      setMessage({ text: '현재 구글 계정이 정식 관리자로 등록되었습니다!', type: 'success' });
    } catch (err: any) {
      console.error("Admin Registration Error:", err);
      setMessage({ text: '관리자 등록 오류 (보안 규칙에 의해 차단되었을 수 있습니다): ' + err.message, type: 'error' });
    }
  };

  // 7. Subscribe to RSVPs in real time (Only if authorized)
  useEffect(() => {
    const isAuthorized = isAdmin || unlockedWithPasscode;
    if (!isAuthorized) {
      setRsvps([]);
      return;
    }

    setLoadingData(true);
    const rsvpQuery = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(rsvpQuery, (snapshot) => {
      const list: RsvpData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          organization: data.organization,
          name: data.name,
          phone: data.phone,
          consent: data.consent,
          attendeeCount: data.attendeeCount,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        });
      });
      setRsvps(list);
      setLoadingData(false);
    }, (error) => {
      console.error("Firestore RSVP Fetch Error:", error);
      setLoadingData(false);
      try {
        handleFirestoreError(error, OperationType.LIST, 'rsvps');
      } catch (err) {
        // Handle gracefully
      }
    });

    return () => unsubscribe();
  }, [isAdmin, unlockedWithPasscode]);

  // 8. Delete RSVP Handler
  const handleDeleteRsvp = async (id: string) => {
    setMessage(null);
    try {
      await deleteDoc(doc(db, 'rsvps', id));
      setMessage({ text: '참석자가 목록에서 정상적으로 삭제되었습니다.', type: 'success' });
      setDeleteId(null);
    } catch (err: any) {
      console.error("Delete RSVP Error:", err);
      setMessage({ text: '삭제 권한이 없거나 오류가 발생했습니다.', type: 'error' });
      try {
        handleFirestoreError(err, OperationType.DELETE, `rsvps/${id}`);
      } catch (innerErr) {
        // Ignored
      }
    }
  };

  // 9. CSV Export Handler
  const handleExportCSV = () => {
    if (rsvps.length === 0) return;
    
    // Korean headers
    const headers = ['번호', '소속명', '참석 대표자명(직책)', '총 참석자 인원수', '핸드폰번호', '등록일자'];
    const rows = filteredRsvps.map((rsvp, idx) => [
      idx + 1,
      `"${rsvp.organization.replace(/"/g, '""')}"`,
      `"${rsvp.name.replace(/"/g, '""')}"`,
      rsvp.attendeeCount || 1,
      `"${rsvp.phone}"`,
      `"${rsvp.createdAt ? rsvp.createdAt.toLocaleDateString() : ''}"`
    ]);

    // Format CSV Content with BOM for Korean encoding in Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `수원장복_20주년_참석자명단_${new Date().toLocaleDateString().replace(/ /g, '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 10. Filtered RSVPs
  const filteredRsvps = rsvps.filter((rsvp) => {
    const q = searchQuery.toLowerCase();
    return (
      rsvp.organization.toLowerCase().includes(q) ||
      rsvp.name.toLowerCase().includes(q) ||
      rsvp.phone.includes(q)
    );
  });

  const isAccessAllowed = isAdmin || unlockedWithPasscode;
  const totalAttendeeCount = rsvps.reduce((sum, r) => sum + (r.attendeeCount || 1), 0);

  return (
    <div className="py-8 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
      {/* Admin Title */}
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${isAccessAllowed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {isAccessAllowed ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">참석 현황 관리자 패널</h3>
          <p className="text-xs text-gray-500">
            {isAccessAllowed ? '참석자 명단을 관리하고 분석할 수 있습니다.' : '관리자 권한 확인이 필요한 서비스입니다.'}
          </p>
        </div>
      </div>

      {/* Message Feedback */}
      {message && (
        <div
          className={`p-3 border rounded-xl text-xs flex items-start gap-1.5 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}
        >
          <CheckCircle className={`w-4 h-4 shrink-0 ${message.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`} />
          <span>{message.text}</span>
        </div>
      )}

      {/* LOCK SCREEN: AUTHENTICATION / ACCESS CONTROLS */}
      {!isAccessAllowed && (
        <div className="space-y-4 pt-2">
          {/* Quick Passcode Login */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-extrabold text-slate-800">비밀번호 인증</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              등록 리스트 확인을 위해 관리자 비밀번호 4자리를 입력해 주세요.
            </p>
            <form onSubmit={handlePasscodeSubmit} className="flex gap-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="비밀번호 4자리"
                className="flex-1 px-3 py-2 bg-white border border-gray-200 focus:border-amber-500 rounded-lg text-xs transition-all focus:outline-none"
              />
              <button
                type="submit"
                className="py-2 px-4.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                확인
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PANEL INNER: ACCESSIBLE WHEN AUTHORIZED */}
      {isAccessAllowed && (
        <div className="space-y-5 pt-1">
          {/* Session Header Status */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">관리자 인증 상태: </span>
              <span className="text-slate-700 font-bold">인증 완료</span>
            </div>
            <button
              onClick={handleLogout}
              className="py-1 px-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3 text-slate-400" /> 로그아웃
            </button>
          </div>

          {/* Counters Widgets */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center">
              <div className="text-[9.5px] font-bold text-slate-500">신청 건수</div>
              <div className="text-base font-black text-slate-800 mt-1">{rsvps.length}건</div>
            </div>
            <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-2.5 text-center">
              <div className="text-[9.5px] font-bold text-amber-800">총 인원수</div>
              <div className="text-base font-black text-amber-900 mt-1">{totalAttendeeCount}명</div>
            </div>
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-2.5 text-center">
              <div className="text-[9.5px] font-bold text-indigo-800">소속 수</div>
              <div className="text-base font-black text-indigo-900 mt-1">{new Set(rsvps.map((r) => r.organization)).size}개</div>
            </div>
          </div>

          {/* Search and Export Utilities */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="소속명 / 참석자명 검색"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-300 rounded-xl text-xs transition-all focus:outline-none"
              />
            </div>
            <button
              onClick={handleExportCSV}
              disabled={rsvps.length === 0}
              className={`py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer ${
                rsvps.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
          </div>

          {/* RSVPs Table / Cards List */}
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {loadingData ? (
              <div className="text-center py-8 text-gray-400 text-xs flex flex-col items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <span>참석자 정보를 불러오고 있습니다...</span>
              </div>
            ) : filteredRsvps.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs">
                검색되거나 등록된 참석자가 없습니다.
              </div>
            ) : (
              filteredRsvps.map((rsvp, idx) => (
                <div
                  key={rsvp.id}
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-2xl p-3.5 space-y-2.5 relative group transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-mono font-bold">
                          #{filteredRsvps.length - idx}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800">
                          {rsvp.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#C5A059]/10 text-[#C5A059] font-bold rounded-md">
                          {rsvp.attendeeCount || 1}명 참석
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mt-1.5">
                        <Building className="w-3 h-3 text-slate-400" /> {rsvp.organization}
                      </p>
                    </div>

                    {/* Delete Toggle Confirmation */}
                    {deleteId === rsvp.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => rsvp.id && handleDeleteRsvp(rsvp.id)}
                          className="py-1 px-2 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 cursor-pointer"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="py-1 px-2 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteId(rsvp.id || null)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="참석 등록 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] border-t border-slate-200/50 pt-2 text-slate-500">
                    <span className="flex items-center gap-1 hover:text-slate-800">
                      <PhoneCall className="w-3 h-3 text-slate-400" /> {rsvp.phone}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {rsvp.createdAt ? rsvp.createdAt.toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
