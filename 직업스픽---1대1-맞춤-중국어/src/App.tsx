/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight, 
  X, 
  Users, 
  Monitor, 
  Clock, 
  BookOpen, 
  Star,
  Menu,
  Phone,
  Loader2,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// --- Components ---

const Navbar = ({ onOpenModal, onOpenAuth, session, onLogout }: { 
  onOpenModal: () => void, 
  onOpenAuth: () => void,
  session: Session | null,
  onLogout: () => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">职</span>
          </div>
          <span className={`font-bold text-xl ${isScrolled ? 'text-navy-900' : 'text-white'}`}>직업스픽</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#pain-points" className={`font-medium hover:text-brand-orange transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}>고민해결</a>
          <a href="#solutions" className={`font-medium hover:text-brand-orange transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}>특장점</a>
          <a href="#curriculum" className={`font-medium hover:text-brand-orange transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}>커리큘럼</a>
          <a href="#reviews" className={`font-medium hover:text-brand-orange transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}>수강후기</a>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className={`hidden sm:block text-sm font-medium ${isScrolled ? 'text-slate-600' : 'text-white/80'}`}>
                {session.user.email}
              </span>
              <button 
                onClick={onLogout}
                className={`flex items-center gap-1 font-semibold hover:text-brand-orange transition-colors ${isScrolled ? 'text-navy-900' : 'text-white'}`}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className={`flex items-center gap-1 font-semibold hover:text-brand-orange transition-colors ${isScrolled ? 'text-navy-900' : 'text-white'}`}
            >
              <LogIn size={18} />
              <span>로그인</span>
            </button>
          )}
          <button 
            onClick={onOpenModal}
            className="bg-brand-orange text-white px-5 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-sm"
          >
            상담 신청
          </button>
        </div>
      </div>
    </nav>
  );
};

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('인증 메일이 발송되었습니다. 이메일을 확인해주세요!');
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
          
          <div className="p-8">
            <h3 className="text-2xl font-bold text-navy-900 mb-2">
              {isLogin ? '로그인' : '회원가입'}
            </h3>
            <p className="text-slate-500 mb-6">
              {isLogin ? '직업스픽에 오신 것을 환영합니다.' : '새로운 학습 여정을 시작하세요.'}
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleAuth}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">이메일</label>
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">비밀번호</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl mt-4 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                {isLogin ? '로그인하기' : '가입하기'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-brand-orange font-semibold hover:underline"
              >
                {isLogin ? '아직 계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Modal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferred_time: '오전 (09:00 ~ 12:00)'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting consultation form...', formData);

    try {
      // Use a timeout to prevent infinite loading if the request hangs
      const insertPromise = supabase
        .from('consultations')
        .insert([
          { 
            name: formData.name, 
            phone: formData.phone, 
            preferred_time: formData.preferred_time 
          }
        ]);

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('요청 시간이 초과되었습니다. 테이블이 생성되었는지 확인해주세요.')), 10000)
      );

      const { error } = await Promise.race([insertPromise, timeoutPromise]) as any;

      if (error) throw error;

      console.log('Consultation submitted successfully');
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting form:', error.message);
      alert(`신청 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
          
          <div className="p-8">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">신청 완료!</h3>
                <p className="text-slate-500 text-lg">곧 상담원이 연락드리겠습니다.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">무료 체험 신청하기</h3>
                <p className="text-slate-500 mb-6">30분 무료 체험과 AI 코칭 리포트를 받아보세요.</p>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">이름</label>
                    <input 
                      type="text" 
                      placeholder="성함을 입력해주세요" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">연락처</label>
                    <input 
                      type="tel" 
                      placeholder="010-0000-0000" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">희망 상담 시간</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all bg-white"
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    >
                      <option>오전 (09:00 ~ 12:00)</option>
                      <option>오후 (12:00 ~ 18:00)</option>
                      <option>저녁 (18:00 ~ 22:00)</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl mt-4 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                    {loading ? '처리 중...' : '신청 완료하기'}
                  </button>
                </form>
                <p className="text-center text-xs text-slate-400 mt-4">개인정보는 상담 목적으로만 활용됩니다.</p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onOpenModal={() => setIsModalOpen(true)} 
        onOpenAuth={() => setIsAuthOpen(true)}
        session={session}
        onLogout={handleLogout}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Section 1: Hero Area */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1920" 
            alt="Chinese Learning" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-brand-orange text-white text-sm font-bold px-4 py-1 rounded-full mb-6 tracking-wider">
              1:1 CUSTOMIZED CHINESE
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              이젠 외국어 회화도 <br />
              <span className="text-brand-orange">PT 받으세요!</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              어린이부터 시니어까지 누구나! 투명한 가격과 명확한 혜택으로 <br className="hidden md:block" />
              지금 바로 내 상황에 딱 맞는 개인 맞춤 수업을 시작하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="cta-button text-lg px-10"
              >
                30분 무료 체험 및 AI 코칭 신청하기
              </button>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Pain Points */}
      <section id="pain-points" className="section-padding bg-slate-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">이런 고민, 아직도 하고 계신가요?</h2>
          <p className="text-slate-500">당신의 중국어 실력이 제자리인 이유, 저희가 해결해 드립니다.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "HSK는 땄는데 중국인 앞에서는 머리가 하얘져요!",
            "문법과 단어는 아는데 막상 입이 떨어지지 않아요!",
            "회사에서 당장 써먹을 비즈니스 실전 중국어가 필요해요!",
            "일주일에 한 번 수업으로는 금방 까먹고 실력이 안 늘어요!",
            "아이에게 재미있고 자연스러운 중국어를 가르치고 싶어요!",
            "중국 출장이나 여행에서 당당하게 말하고 싶어요!"
          ].map((text, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, backgroundColor: "#0a192f", color: "#ffffff" }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/10">
                <MessageSquare className="text-brand-orange" size={24} />
              </div>
              <p className="text-lg font-bold leading-snug">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 3: Solutions */}
      <section id="solutions" className="section-padding overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                alt="Learning Mockup" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">학습 만족도</p>
                    <p className="text-xl font-bold text-navy-900">98.5% 달성</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-navy-900/5 rounded-full -z-10 blur-3xl"></div>
          </div>
          
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8 leading-tight">
                다른 곳에서 헤매지 마세요! <br />
                <span className="text-brand-orange">확실하게 실력을 올려주는</span> <br />
                4가지 솔루션
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: "직업과 상황 기반 말하기 시스템", desc: "내 상황에 맞춘 1:1 맞춤 교재로 실전에 바로 써먹는 회화를 연습합니다!" },
                  { title: "24시간 AI 코칭 시스템", desc: "원어민 1:1 수업 후, AI 코칭으로 무한 반복 훈련하여 실력을 완벽하게 다집니다!" },
                  { title: "거품 없는 합리적인 수강료", desc: "불필요한 광고비는 빼고, 교재비는 0원! 쓰던 교재도 그대로 활용 가능합니다." },
                  { title: "평생 소장 가능한 복습 강의", desc: "자체 녹화된 수업 영상을 평생 소장하며 복습할 수 있어 학습 효율이 200% 상승합니다!" }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="text-brand-orange" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-navy-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Curriculum */}
      <section id="curriculum" className="section-padding bg-navy-900 text-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">당신의 목표에 딱 맞는 직업스픽 커리큘럼</h2>
          <p className="text-white/60">어떤 목표라도 상관없습니다. 당신만을 위한 로드맵을 그려드립니다.</p>
        </div>
        
        <div className="flex overflow-x-auto pb-10 gap-6 snap-x no-scrollbar">
          {[
            { title: "비즈니스 중국어", icon: <Users />, tags: ["직장인", "실무회화"] },
            { title: "무역 중국어", icon: <Monitor />, tags: ["무역", "계약", "협상"] },
            { title: "성형외과 전문 중국어", icon: <Phone />, tags: ["의료", "상담", "코디네이터"] },
            { title: "HSK/TSC/BCT 단기 완성", icon: <BookOpen />, tags: ["자격증", "고득점"] },
            { title: "어린이 전용 중국어", icon: <Star />, tags: ["주니어", "놀이학습"] }
          ].map((course, index) => (
            <div 
              key={index} 
              className="min-w-[300px] bg-navy-800 p-8 rounded-3xl border border-white/10 snap-center hover:border-brand-orange/50 transition-all group"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-orange transition-colors">
                {React.cloneElement(course.icon as React.ReactElement, { size: 28, className: "text-brand-orange group-hover:text-white" })}
              </div>
              <h3 className="text-2xl font-bold mb-4">{course.title}</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {course.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/70">#{tag}</span>
                ))}
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 rounded-xl border border-white/20 font-bold hover:bg-white hover:text-navy-900 transition-all flex items-center justify-center gap-2"
              >
                맞춤 상담 신청하기 <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Social Proof */}
      <section id="reviews" className="section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">이미 많은 분들이 중국어 말하기의 두려움을 극복했습니다!</h2>
          <div className="flex justify-center gap-1 text-brand-orange mb-2">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={20} />)}
          </div>
          <p className="text-slate-500">실제 수강생들이 증명하는 직업스픽의 효과</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              name: "김*아 (취준생)", 
              text: "HSK 6급이 있어도 말이 안 나왔는데 맞춤 튜터 덕분에 프리토킹이 가능해졌어요! 이제 면접에서도 자신 있게 말할 수 있습니다.",
              img: "https://i.pravatar.cc/150?u=1"
            },
            { 
              name: "이*훈 (대기업 과장)", 
              text: "반년 만에 원어민 말이 들리기 시작했어요! 비즈니스 상황별로 연습하니까 출장 가서 바로 써먹을 수 있어서 너무 좋았습니다.",
              img: "https://i.pravatar.cc/150?u=2"
            },
            { 
              name: "박*연 (학부모)", 
              text: "아이가 중국어 수업 시간을 기다려요. 억지로 시키는 공부가 아니라 놀이처럼 즐기면서 배우는 모습이 정말 만족스럽습니다.",
              img: "https://i.pravatar.cc/150?u=3"
            },
            { 
              name: "최*준 (프리랜서)", 
              text: "AI 코칭 시스템이 대박이에요. 수업 끝나고 혼자 연습할 때 발음 교정을 바로바로 해주니까 실력이 느는 게 눈에 보입니다.",
              img: "https://i.pravatar.cc/150?u=4"
            }
          ].map((review, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-3xl relative"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-navy-900">{review.name}</p>
                  <div className="flex gap-0.5 text-brand-orange">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={12} />)}
                  </div>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed italic">"{review.text}"</p>
              <div className="absolute -bottom-2 right-8 w-8 h-8 bg-slate-50 rotate-45"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 6: Final CTA */}
      <section className="bg-brand-orange py-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              가입 즉시 1만 포인트 지급! <br />
              망설일 이유가 없습니다.
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium">
              지금 바로 자동 배정 신청하고 1:1 원어민 수업을 시작해 보세요!
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-brand-orange text-xl md:text-2xl font-black py-6 px-12 rounded-full hover:bg-slate-100 transition-all transform hover:scale-110 shadow-2xl"
            >
              1만 포인트 받고 당일 수업 신청하기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white/40 py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">职</span>
            </div>
            <span className="font-bold text-lg text-white">직업스픽</span>
          </div>
          
          <div className="text-sm text-center md:text-right">
            <p>© 2026 직업스픽. All rights reserved.</p>
            <p className="mt-1">사업자등록번호: 000-00-00000 | 통신판매업신고: 제2026-서울강남-0000호</p>
            <p>서울특별시 강남구 테헤란로 123 직업스픽 빌딩</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
