'use client';

import React from 'react';
import ExpertApplicationForm from '@/components/ExpertApplicationForm';

const ExpertPage = () => {
  const handleSuccess = () => {
    // 성공 후 처리 로직 (예: 메인 페이지로 이동)
    console.log('전문가 신청이 성공적으로 완료되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            전문가 신청
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            상속세 관련 전문가로 활동하고 싶으신가요? 
            <br />
            전문가 신청을 통해 TaxSimp의 파트너가 되어보세요.
          </p>
        </div>

        {/* 전문가 혜택 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">전문가 혜택</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">고객 연결</h3>
                <p className="text-gray-600 text-sm">
                  상속세 상담이 필요한 고객들과 직접 연결됩니다.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">프로필 노출</h3>
                <p className="text-gray-600 text-sm">
                  전문가 프로필이 플랫폼에 노출되어 신뢰도가 높아집니다.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">업무 효율성</h3>
                <p className="text-gray-600 text-sm">
                  미리 계산된 상속세 정보로 상담 시간을 단축할 수 있습니다.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">수수료 무료</h3>
                <p className="text-gray-600 text-sm">
                  플랫폼 이용 수수료 없이 무료로 서비스를 이용하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 신청 자격 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">신청 자격</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">세무사, 회계사, 변호사 등 관련 자격증 보유자</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">상속세 관련 업무 경험 보유자</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">성실하고 책임감 있는 전문가</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">고객 상담 및 커뮤니케이션 능력 보유자</span>
            </div>
          </div>
        </div>

        {/* 신청 폼 */}
        <ExpertApplicationForm onSuccess={handleSuccess} />

        {/* 문의 정보 */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            기타 문의사항이 있으시면{' '}
            <a href="mailto:support@taxsimp.com" className="text-blue-600 hover:text-blue-800">
              support@taxsimp.com
            </a>
            으로 연락주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertPage; 