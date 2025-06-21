'use client';

import { useState } from 'react';
import { signIn, signUp, signInWithGoogle, signInWithKakao } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        await signIn(email, password);
        onAuthSuccess();
        onClose();
      } else {
        await signUp(email, password);
        setSuccessMessage('회원가입이 완료되었습니다. 이제 로그인해주세요.');
        setIsLogin(true); // 회원가입 후 로그인 창으로 전환
        setPassword(''); // 비밀번호 필드 초기화
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoSignIn = async () => {
    try {
      await signInWithKakao();
    } catch (err) {
      setError(err instanceof Error ? err.message : '카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? '로그인' : '회원가입'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin ? '다시 오신 것을 환영합니다!' : '계산을 저장하려면 계정을 만드세요.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "비밀번호를 입력하세요" : "6자 이상의 비밀번호를 입력하세요"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          {!isLogin && (
            <div className="pt-2">
              <label className="flex items-start text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span className="ml-2 text-gray-600">
                  <span className="font-medium text-gray-700">개인정보 수집 및 이용</span>에 동의합니다. (필수)
                  <span className="block text-xs text-gray-400 mt-1">
                    수집 항목: 이메일 주소, 목적: 회원 식별 및 서비스 이용 기록 저장.
                  </span>
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!isLogin && !agreePrivacy)}
            className={`w-full text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              ${isLogin 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">또는</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.048,36.145,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">Google 계정으로 계속하기</span>
          </button>

          <button
            type="button"
            onClick={handleKakaoSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 border-transparent bg-[#FEE500] rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M16 4C9.37258 4 4 8.81722 4 14.6667C4 18.5253 6.02899 21.9407 9.03478 23.9919L7.38841 28.9884L11.8928 26.3982C13.1652 26.793 14.542 27 16 27C22.6274 27 28 22.1828 28 16.3333C28 10.4838 22.6274 5.66667 16 5.66667C16 5.25131 16 4.83594 16 4.42058V4.42058L16 4Z" fill="black"/>
            </svg>
            <span className="text-sm font-medium text-black">카카오 계정으로 계속하기</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>
      </div>
    </div>
  );
} 