'use client';

interface MarketingConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consent: boolean) => void;
  isLoading?: boolean;
}

export default function MarketingConsentModal({ 
  isOpen, 
  onClose, 
  onConsent, 
  isLoading = false 
}: MarketingConsentModalProps) {
  if (!isOpen) return null;

  const handleConsent = (consent: boolean) => {
    onConsent(consent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">마케팅 활용 동의</h2>
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center disabled:opacity-50"
            >
              ×
            </button>
          </div>

          {/* 내용 */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              알림 서비스 이용 동의
            </h3>
            <div className="text-gray-600 mb-4 text-left">
              <p className="mb-2">
                전문가 상담 서비스 출시 알림을 받으시려면 마케팅 활용 동의가 필요합니다.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <p className="font-medium text-blue-800 mb-2">동의 시 제공 서비스:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• 전문가 상담 서비스 출시 알림</li>
                  <li>• 상속세 관련 유용한 정보 제공</li>
                  <li>• 세법 변경 사항 안내</li>
                  <li>• 맞춤형 절세 팁 제공</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              언제든지 마이페이지에서 동의를 철회할 수 있습니다.
            </p>
          </div>

          {/* 버튼 - 모바일 반응형 적용 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => handleConsent(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium whitespace-nowrap disabled:opacity-50"
            >
              동의하지 않음
            </button>
            <button 
              onClick={() => handleConsent(true)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>처리중...</span>
                </>
              ) : (
                '동의하고 알림받기'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 