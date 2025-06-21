'use client';

import { useState } from 'react';
import StepForm from '@/components/StepForm';
import LiveCalculation from '@/components/LiveCalculation';
import ResultSummary from '@/components/ResultSummary';
import { InheritanceData, TaxCalculationResult } from '@/types';

export default function Home() {
  const [formData, setFormData] = useState<InheritanceData>({
    deathDate: new Date().toISOString().split('T')[0],
    deceasedName: '',
    heirsCount: 1,
    assets: {
      realEstate: 0,
      deposits: 0,
      stocks: 0,
      insurance: 0,
      business: 0,
      vehicles: 0,
      other: 0
    },
    debts: {
      funeral: 0,
      financial: 0,
      taxes: 0,
      other: 0
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
      deceasedName: '',
      heirsCount: 1,
      assets: {
        realEstate: 0,
        deposits: 0,
        stocks: 0,
        insurance: 0,
        business: 0,
        vehicles: 0,
        other: 0
      },
      debts: {
        funeral: 0,
        financial: 0,
        taxes: 0,
        other: 0
      },
      deductions: {
        spouse: false,
        disabled: false,
        minor: false,
        basic: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InheriCalc
              </h1>
              <p className="text-gray-600">상속세 계산기</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>2024년 기준</p>
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
                  2024년 기준 상속세율과 공제를 적용한 정확한 계산
                </p>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">계산 방법</h3>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                    <span>총 재산가액 - 총 채무 = 순 재산가액</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                    <span>순 재산가액 - 공제액 = 과세표준</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                    <span>과세표준 × 세율 - 누진공제 = 산출세액</span>
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">주요 공제</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>일괄공제: 1억원</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>배우자공제: 5억원</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>장애인공제: 1억원</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>미성년공제: 1억원</span>
                  </li>
                </ul>
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
              © 2024 InheriCalc. 이 계산기는 참고용이며, 실제 상속세는 전문가와 상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
