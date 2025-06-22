'use client';

import { useState, useEffect } from 'react';
import StepForm from '@/components/StepForm';
import LiveCalculation from '@/components/LiveCalculation';
import ResultSummary from '@/components/ResultSummary';
import AuthModal from '@/components/AuthModal';
// import KakaoShareButton from '@/components/KakaoShareButton';
import { InheritanceData, TaxCalculationResult } from '@/types';
import { getCurrentUser, saveCalculationRecord, signOut } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function Home() {
  const [formData, setFormData] = useState<InheritanceData>({
    deathDate: new Date().toISOString().split('T')[0],
    deceasedName: '피상속인',
    heirsCount: 1,
    assets: {
      realEstate: {
        residential: 0,
        commercial: 0,
        land: 0,
        other: 0
      },
      financial: {
        deposits: 0,
        savings: 0,
        bonds: 0,
        funds: 0,
        stocks: 0,
        crypto: 0
      },
      insurance: {
        life: 0,
        annuity: 0,
        other: 0
      },
      business: {
        shares: 0,
        equipment: 0,
        inventory: 0,
        receivables: 0
      },
      movables: {
        vehicles: 0,
        jewelry: 0,
        art: 0,
        electronics: 0,
        furniture: 0,
        other: 0
      },
      other: {
        intellectual: 0,
        membership: 0,
        deposits_guarantee: 0,
        loans_receivable: 0,
        gifts_real_estate: 0,
        gifts_other: 0,
        other: 0
      }
    },
    debts: {
      funeral: {
        ceremony: 0,
        burial: 0,
        memorial: 0,
        other: 0
      },
      financial: {
        mortgage: 0,
        credit_loan: 0,
        card_debt: 0,
        installment: 0,
        other_loans: 0
      },
      taxes: {
        income_tax: 0,
        property_tax: 0,
        local_tax: 0,
        health_insurance: 0,
        other: 0
      },
      other: {
        guarantee: 0,
        trade_payable: 0,
        lease: 0,
        other: 0
      }
    },
    deductions: {
      spouse: false,
      disabled: false,
      minor: false,
      basic: true
    }
  });
  
  const [finalResult, setFinalResult] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileBottomBar, setShowMobileBottomBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // 사용자 인증 상태 확인
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // 인증 오류는 무시 (비로그인 상태로 처리)
        console.warn('사용자 인증 상태 확인 실패:', error);
        setUser(null);
      }
    };
    checkUser();
  }, []);

  // 스크롤 방향 감지
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 스크롤이 충분히 움직였을 때만 상태 변경 (50px 이상)
      if (Math.abs(currentScrollY - lastScrollY) > 50) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // 아래로 스크롤 중이고 충분히 스크롤했을 때 숨김
          setShowMobileBottomBar(false);
        } else if (currentScrollY < lastScrollY) {
          // 위로 스크롤 중일 때 표시
          setShowMobileBottomBar(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleFormDataChange = (newFormData: InheritanceData) => {
    setFormData(newFormData);
  };

  const handleCalculate = async (data: InheritanceData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '계산 중 오류가 발생했습니다.');
      }

      setFinalResult(result.data);
      setShowFinalResult(true);

      // 로그인된 사용자인 경우 계산 기록 저장
      if (user) {
        try {
          await saveCalculationRecord(user.id, data, result.data);
        } catch (saveError) {
          console.error('계산 기록 저장 실패:', saveError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFinalResult(null);
    setError(null);
    setShowFinalResult(false);
    setFormData({
      deathDate: new Date().toISOString().split('T')[0],
      deceasedName: '피상속인',
      heirsCount: 1,
      assets: {
        realEstate: {
          residential: 0,
          commercial: 0,
          land: 0,
          other: 0
        },
        financial: {
          deposits: 0,
          savings: 0,
          bonds: 0,
          funds: 0,
          stocks: 0,
          crypto: 0
        },
        insurance: {
          life: 0,
          annuity: 0,
          other: 0
        },
        business: {
          shares: 0,
          equipment: 0,
          inventory: 0,
          receivables: 0
        },
        movables: {
          vehicles: 0,
          jewelry: 0,
          art: 0,
          electronics: 0,
          furniture: 0,
          other: 0
        },
        other: {
          intellectual: 0,
          membership: 0,
          deposits_guarantee: 0,
          loans_receivable: 0,
          gifts_real_estate: 0,
          gifts_other: 0,
          other: 0
        }
      },
      debts: {
        funeral: {
          ceremony: 0,
          burial: 0,
          memorial: 0,
          other: 0
        },
        financial: {
          mortgage: 0,
          credit_loan: 0,
          card_debt: 0,
          installment: 0,
          other_loans: 0
        },
        taxes: {
          income_tax: 0,
          property_tax: 0,
          local_tax: 0,
          health_insurance: 0,
          other: 0
        },
        other: {
          guarantee: 0,
          trade_payable: 0,
          lease: 0,
          other: 0
        }
      },
      deductions: {
        spouse: false,
        disabled: false,
        minor: false,
        basic: true
      }
    });
  };

  const handleAuthSuccess = () => {
    // 인증 성공 후 사용자 정보 다시 가져오기
    getCurrentUser()
      .then(setUser)
      .catch((error) => {
        console.warn('인증 성공 후 사용자 정보 조회 실패:', error);
        setUser(null);
      });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaxSimp
              </h1>
              <p className="text-gray-600">2025년 기준 상속세 계산기</p>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    로그아웃
                  </button>
                  <Link
                    href="/expert"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    전문가 신청
                  </Link>
                  {/* <KakaoShareButton className="text-sm" /> */}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    로그인
                  </button>
                  <Link
                    href="/expert"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    전문가 신청
                  </Link>
                  {/* <KakaoShareButton className="text-sm" /> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showFinalResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 단계별 입력 폼 */}
            <div>
              <StepForm 
                onSubmit={handleCalculate} 
                loading={loading}
                onFormDataChange={handleFormDataChange}
              />
              
              {/* 에러 메시지 */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* 실시간 계산 결과 */}
            <div>
              <LiveCalculation formData={formData} />
            </div>
          </div>
        ) : (
          /* 최종 결과 화면 */
          <div className="max-w-4xl mx-auto">
            <ResultSummary result={finalResult!} onReset={handleReset} />
          </div>
        )}

        {/* 정보 섹션 */}
        {!showFinalResult && (
          <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">상속세 계산 안내</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">단계별 입력</h3>
                <p className="text-sm text-gray-600">
                  기본 정보부터 차근차근 입력하여 정확한 계산 결과를 얻으세요
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">실시간 계산</h3>
                <p className="text-sm text-gray-600">
                  입력하는 즉시 계산 결과를 확인할 수 있습니다
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">정확한 결과</h3>
                <p className="text-sm text-gray-600">
                  2025년 기준 상속세율과 공제를 적용한 정확한 계산
                </p>
              </div>
            </div>
            
            {/* 상세 정보 섹션 */}
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-3">주요 공제</h4>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>일괄공제: 2억원</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>배우자공제: 6억원</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>장애인공제: 1억원</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>미성년공제: 1억원</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧮</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-3">계산 방법</h4>
                  <ol className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">1</span>
                      <span>총 재산가액 - 총 채무 = 순 재산가액</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">2</span>
                      <span>순 재산가액 - 공제액 = 과세표준</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">3</span>
                      <span>과세표준 × 세율 - 누진공제 = 산출세액</span>
                    </li>
                  </ol>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-3">세율 구간</h4>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>1억원 이하: 10%</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>5억원 이하: 20%</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>10억원 이하: 30%</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>30억원 이하: 40%</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>30억원 초과: 50%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-300">
              © 2025 InheritCalculator. 이 계산기는 참고용이며, 실제 상속세는 전문가와 상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </footer>

      {/* 인증 모달 */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 모바일 하단 고정 바 */}
      {!showFinalResult && (
        <div 
          className={`
            fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40
            lg:hidden transition-transform duration-300 ease-in-out
            ${showMobileBottomBar ? 'transform translate-y-0' : 'transform translate-y-full'}
          `}
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
            bottom: 'env(keyboard-inset-height, 0px)'
          }}
        >
          <div className="px-4 py-3">
            <LiveCalculation formData={formData} isMobileBottomBar={true} />
          </div>
        </div>
      )}
    </div>
  );
}
