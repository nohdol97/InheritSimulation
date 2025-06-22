'use client';

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowAuthModal?: () => void;
}

export default function SignupPromptModal({ isOpen, onClose, onShowAuthModal }: SignupPromptModalProps) {
  if (!isOpen) return null;

  const handleSignup = () => {
    onClose();
    if (onShowAuthModal) {
      onShowAuthModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">회원가입 필요</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* 내용 */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              알림 서비스 이용을 위한 회원가입
            </h3>
            <div className="text-gray-600 mb-4 text-left">
              <p className="mb-3">
                전문가 상담 서비스 알림을 받으시려면 회원가입이 필요합니다.
              </p>
              <div className="bg-green-50 p-3 rounded-lg text-sm">
                <p className="font-medium text-green-800 mb-2">회원가입 혜택:</p>
                <ul className="text-green-700 space-y-1">
                  <li>• 전문가 상담 서비스 출시 알림</li>
                  <li>• 계산 기록 저장 및 관리</li>
                  <li>• 맞춤형 상속세 정보 제공</li>
                  <li>• 마케팅 동의 시 5,000 포인트 지급</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              회원가입 시 마케팅 동의를 통해 전문가 상담 서비스 출시 소식을 받아보세요.
            </p>
          </div>

          {/* 버튼 - 모바일 반응형 적용 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium whitespace-nowrap"
            >
              나중에
            </button>
            <button 
              onClick={handleSignup}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              회원가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 