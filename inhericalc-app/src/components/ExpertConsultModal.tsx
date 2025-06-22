'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import MarketingConsentModal from './MarketingConsentModal';
import SignupPromptModal from './SignupPromptModal';

interface ExpertConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onShowAuthModal?: () => void;
}

interface UserMarketingStatus {
  isLoggedIn: boolean;
  marketingConsent: boolean;
  userId?: string;
}

export default function ExpertConsultModal({ isOpen, onClose, user, onShowAuthModal }: ExpertConsultModalProps) {
  const [isNotificationRequested, setIsNotificationRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [marketingLoading, setMarketingLoading] = useState(false);

  if (!isOpen) return null;

  const checkUserMarketingStatus = async (): Promise<UserMarketingStatus> => {
    console.log('=== 사용자 마케팅 상태 확인 시작 ===');
    console.log('User prop:', user);
    
    // 먼저 클라이언트에서 user prop으로 로그인 상태 확인
    if (!user) {
      console.log('사용자가 로그인하지 않음');
      return {
        isLoggedIn: false,
        marketingConsent: false
      };
    }

    console.log('사용자 로그인됨, 직접 DB 조회 시작');
    
    try {
      // 기존 supabase 클라이언트 사용
      if (!supabase) {
        throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
      }
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('agree_marketing')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('직접 DB 조회 결과:', { profile, error });
      
      if (error && error.code !== 'PGRST116') {
        console.error('프로필 조회 오류:', error);
        // 오류가 발생해도 로그인된 것으로 간주하고 기본값 사용
        return {
          isLoggedIn: true,
          marketingConsent: false,
          userId: user.id
        };
      }
      
      return {
        isLoggedIn: true,
        marketingConsent: profile?.agree_marketing || false,
        userId: user.id
      };
      
    } catch (error) {
      console.error('마케팅 상태 확인 오류:', error);
      // 오류가 발생해도 로그인된 것으로 간주하고 기본값 사용
      return {
        isLoggedIn: true,
        marketingConsent: false,
        userId: user.id
      };
    }
  };

  const handleNotificationRequest = async () => {
    console.log('=== 알림 신청 처리 시작 ===');
    setIsLoading(true);
    
    try {
      // 사용자 상태 확인
      const userStatus = await checkUserMarketingStatus();
      console.log('사용자 상태:', userStatus);
      
      if (!userStatus.isLoggedIn) {
        console.log('로그인되지 않음 -> 회원가입 유도 모달 표시');
        // 로그인되지 않은 경우 - 회원가입 유도
        setShowSignupModal(true);
      } else if (userStatus.marketingConsent) {
        console.log('이미 마케팅 동의함 -> 완료 메시지 표시');
        // 이미 마케팅 동의한 경우 - 완료 메시지
        setIsNotificationRequested(true);
        setTimeout(() => {
          onClose();
          setIsNotificationRequested(false);
        }, 2000);
      } else {
        console.log('로그인했지만 마케팅 동의 안함 -> 동의 모달 표시');
        // 로그인했지만 마케팅 동의 안한 경우 - 동의 모달
        setShowMarketingModal(true);
      }
      
    } catch (error) {
      console.error('알림 신청 처리 오류:', error);
      alert('알림 신청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketingConsent = async (consent: boolean) => {
    console.log('=== 마케팅 동의 처리 시작 ===');
    console.log('동의 여부:', consent);
    console.log('현재 사용자:', user);
    
    if (!consent) {
      console.log('동의 거부 -> 모달 닫기');
      setShowMarketingModal(false);
      return;
    }

    // 사용자가 로그인되지 않은 상태에서는 처리하지 않음
    if (!user) {
      console.error('사용자가 로그인되지 않은 상태에서 마케팅 동의 시도');
      alert('로그인이 필요합니다.');
      setShowMarketingModal(false);
      setShowSignupModal(true);
      return;
    }

    setMarketingLoading(true);
    
    try {
      console.log('클라이언트에서 직접 DB 업데이트 시작');
      
      // 기존 supabase 클라이언트 사용
      if (!supabase) {
        throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
      }
      
      // 먼저 프로필이 존재하는지 확인
      const { data: existingProfile, error: selectError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('기존 프로필 확인:', { existingProfile, selectError });
      
      if (selectError && selectError.code !== 'PGRST116') {
        throw new Error(`프로필 조회 오류: ${selectError.message}`);
      }
      
      if (!existingProfile) {
        console.log('프로필이 없음, 새로 생성');
        // 프로필이 없으면 생성
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email || '',
            name: '사용자',
            phone: '',
            region: '',
            agree_terms: false,
            agree_privacy: false,
            agree_marketing: true
          });
        
        if (insertError) {
          throw new Error(`프로필 생성 오류: ${insertError.message}`);
        }
      } else {
        console.log('기존 프로필 업데이트');
        // 프로필이 있으면 업데이트
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ agree_marketing: true })
          .eq('user_id', user.id);
        
        if (updateError) {
          throw new Error(`프로필 업데이트 오류: ${updateError.message}`);
        }
      }

      console.log('마케팅 동의 처리 성공');
      setShowMarketingModal(false);
      setIsNotificationRequested(true);
      
      // 2초 후 모달 닫기
      setTimeout(() => {
        onClose();
        setIsNotificationRequested(false);
      }, 2000);
      
    } catch (error) {
      console.error('마케팅 동의 처리 오류:', error);
      alert(`마케팅 동의 처리에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setMarketingLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
          <div className="p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">전문가 상담 서비스</h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* 내용 */}
            {!isNotificationRequested ? (
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍💼</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  전문가 상담 서비스 준비 중
                </h3>
                <p className="text-gray-600 mb-4">
                  상속세 전문가와의 1:1 상담 서비스를 준비하고 있습니다.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>곧 제공될 서비스:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• 세무사/회계사와 1:1 상담</li>
                    <li>• 맞춤형 절세 전략 제안</li>
                    <li>• 상속세 신고 대행 서비스</li>
                    <li>• 실시간 온라인 상담</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500">
                  서비스 출시 소식을 받고 싶으시면 알림 신청을 해주세요.
                </p>
              </div>
            ) : (
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  알림 신청 완료!
                </h3>
                <p className="text-gray-600">
                  전문가 상담 서비스 출시 시 알려드리겠습니다.
                </p>
              </div>
            )}

            {/* 버튼 - 모바일 반응형 적용 */}
            {!isNotificationRequested && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={onClose} 
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium whitespace-nowrap"
                >
                  닫기
                </button>
                <button 
                  onClick={handleNotificationRequest}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>확인중...</span>
                    </>
                  ) : (
                    '알림받기'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 마케팅 동의 모달 */}
      <MarketingConsentModal
        isOpen={showMarketingModal}
        onClose={() => setShowMarketingModal(false)}
        onConsent={handleMarketingConsent}
        isLoading={marketingLoading}
      />

      {/* 회원가입 유도 모달 */}
      <SignupPromptModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onShowAuthModal={onShowAuthModal}
      />
    </>
  );
} 