'use client';

import { useState } from 'react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowAuthModal: () => void;
  feature: string; // 접근하려는 기능명 (예: "PDF 다운로드")
}

export default function LoginRequiredModal({ 
  isOpen, 
  onClose, 
  onShowAuthModal, 
  feature 
}: LoginRequiredModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleLogin = () => {
    handleClose();
    setTimeout(() => {
      onShowAuthModal();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-200 p-4 ${
        isClosing ? 'bg-opacity-0' : 'bg-opacity-50'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="relative p-6 pb-4">
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center transition-colors"
          >
            ×
          </button>
          
          {/* 로그인 필요 아이콘 */}
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-600 text-sm">
              <strong>{feature}</strong> 기능을 이용하려면 로그인해주세요
            </p>
          </div>
        </div>

        {/* 혜택 안내 */}
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <span className="text-xl mr-2">🎁</span>
              회원가입 특별 혜택
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">PDF 보고서 무제한 다운로드</p>
                  <p className="text-sm text-gray-600">상속세 계산 결과를 언제든지 PDF로 저장하세요</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">5,000 포인트 즉시 지급</p>
                  <p className="text-sm text-gray-600">마케팅 활용 동의 시 포인트를 받아보세요</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">💾</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">계산 기록 자동 저장</p>
                  <p className="text-sm text-gray-600">이전 계산 결과를 언제든지 다시 확인하세요</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">🔔</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">전문가 상담 서비스 알림</p>
                  <p className="text-sm text-gray-600">새로운 서비스 출시 소식을 먼저 받아보세요</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {/* 메인 CTA 버튼 */}
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              로그인 / 회원가입
            </button>
            
            {/* 보조 버튼 */}
            <button 
              onClick={handleClose} 
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              나중에
            </button>
          </div>
          
          {/* 추가 안내 */}
          <p className="text-center text-xs text-gray-500 mt-4">
            로그인 후 {feature} 기능을 바로 이용하실 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
} 