'use client';

import { useEffect, useState } from 'react';
import { InheritanceData, TaxCalculationResult } from '@/types';
import { calculateInheritanceTax, formatCurrency } from '@/lib/calculator';
import { saveCalculationRecord } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import CalculationBreakdown from './CalculationBreakdown';
import TaxReport from './TaxReport';

interface LiveCalculationProps {
  formData: InheritanceData;
  isMobileBottomBar?: boolean;
  user?: User | null;
  onSaveCalculation?: () => void;
}

export default function LiveCalculation({ 
  formData, 
  isMobileBottomBar = false, 
  user,
  onSaveCalculation 
}: LiveCalculationProps) {
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const calculateTax = async () => {
      // 기본 정보가 입력되지 않았으면 계산하지 않음
      if (!formData.deathDate || !formData.deceasedName || formData.heirsCount <= 0) {
        setResult(null);
        return;
      }

      setIsCalculating(true);
      
      // 실제 API 호출 대신 클라이언트에서 계산 (실시간 반응을 위해)
      try {
        const calculatedResult = calculateInheritanceTax(formData);
        setResult(calculatedResult);
      } catch (error) {
        console.error('실시간 계산 오류:', error);
        setResult(null);
      } finally {
        setIsCalculating(false);
      }
    };

    // 디바운스 적용 (500ms)
    const timeoutId = setTimeout(calculateTax, 500);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  // 공유 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu) {
        const target = event.target as Element;
        if (!target.closest('.share-menu-container')) {
          setShowShareMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // 계산 기록 저장 함수
  const handleSaveCalculation = async () => {
    if (!user || !result) return;
    
    try {
      await saveCalculationRecord(user.id, formData, result);
      onSaveCalculation?.();
    } catch (error) {
      console.error('계산 기록 저장 실패:', error);
    }
  };

  // 상세히 버튼 클릭 핸들러
  const handleShowBreakdown = () => {
    setShowBreakdown(!showBreakdown);
    // 로그인된 사용자인 경우 저장
    if (user) {
      handleSaveCalculation();
    }
  };

  // PDF 다운로드 핸들러 수정
  const handleDownloadPDF = async () => {
    if (!result) return;

    setIsGeneratingPDF(true);
    
    try {
      // 로그인된 사용자인 경우 저장
      if (user) {
        await handleSaveCalculation();
      }

      // 동적으로 라이브러리 임포트
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      // 숨겨진 TaxReport 요소 찾기
      const hiddenTaxReport = document.querySelector('#hidden-tax-report');
      if (!hiddenTaxReport) {
        throw new Error('PDF 생성용 요소를 찾을 수 없습니다.');
      }

      // HTML을 Canvas로 변환
      const canvas = await html2canvas(hiddenTaxReport as HTMLElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: 1200
      });

      // PDF 생성
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF 다운로드
      const fileName = `상속세신고서_${formData.deceasedName || '피상속인'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 공유 핸들러 수정
  const handleShare = async (type: 'url' | 'kakao') => {
    if (!result) return;

    // 로그인된 사용자인 경우 저장
    if (user) {
      await handleSaveCalculation();
    }

    if (type === 'url') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('URL이 클립보드에 복사되었습니다.');
      } catch (error) {
        console.error('URL 복사 실패:', error);
        alert('URL 복사에 실패했습니다.');
      }
    } else if (type === 'kakao') {
      // 카카오톡 공유
      if (typeof window !== 'undefined' && window.Kakao) {
        try {
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: 'TaxSimp 상속세 계산 결과',
              description: `상속세: ${formatCurrency(result.finalTax)}원\n과세표준: ${formatCurrency(result.taxableAmount)}원\n세율: ${(result.taxRate * 100).toFixed(1)}%`,
              imageUrl: 'https://taxsimp.vercel.app/og-image.png',
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
            buttons: [
              {
                title: '결과 보기',
                link: {
                  mobileWebUrl: window.location.href,
                  webUrl: window.location.href,
                },
              },
            ],
          });
        } catch (error) {
          console.error('카카오톡 공유 실패:', error);
          alert('카카오톡 공유에 실패했습니다.');
        }
      } else {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
      }
    }

    setShowShareMenu(false);
  };

  if (!result) {
    if (isMobileBottomBar) {
      return (
        <div className="text-center text-gray-500">
          <p className="text-sm">계산을 위해 정보를 입력해주세요</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium mb-2">실시간 계산 결과</h3>
          <p className="text-sm">
            {!formData.deathDate || !formData.deceasedName || formData.heirsCount <= 0
              ? '기본 정보를 입력하면 실시간으로 계산 결과를 확인할 수 있습니다.'
              : '계산 중...'}
          </p>
        </div>
      </div>
    );
  }

  const {
    totalAssets,
    totalDebts,
    netAssets,
    totalDeductions,
    taxableAmount,
    taxRate,
    calculatedTax,
    finalTax
  } = result;

  // 모바일 하단 바용 간단한 UI
  if (isMobileBottomBar) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-600 mb-1">예상 상속세</p>
          <p className="text-lg font-bold text-red-600">
            {Math.round(finalTax).toLocaleString()}원
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600 mb-1">과세표준</p>
          <p className="text-sm font-medium text-gray-800">
            {Math.round(taxableAmount).toLocaleString()}원
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 실시간 계산 결과 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">실시간 계산 결과</h3>
            {isCalculating && (
              <div className="flex items-center text-white text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                계산 중...
              </div>
            )}
          </div>
        </div>

        {/* 결과 내용 */}
        <div className="p-6 space-y-6">
          {/* 최종 상속세 */}
          <div className="text-center">
            <p className="text-sm text-gray-900 mb-2">예상 상속세</p>
            <p className="text-3xl font-bold text-green-600">
              {Math.round(finalTax).toLocaleString()}원
            </p>
          </div>

          {/* 요약 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-blue-600 mb-1">순 재산가액</p>
              <p className="text-lg font-semibold text-blue-800">
                {Math.round(netAssets).toLocaleString()}원
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-xs text-yellow-600 mb-1">과세표준</p>
              <p className="text-lg font-semibold text-yellow-800">
                {Math.round(taxableAmount).toLocaleString()}원
              </p>
            </div>
          </div>

          {/* 상세 내역 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">상세 내역</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-900">총 재산가액</span>
                <span className="text-gray-900">{Math.round(totalAssets).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">총 채무</span>
                <span className="text-red-600">-{Math.round(totalDebts).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-gray-900">순 재산가액</span>
                <span className="font-medium text-gray-900">{Math.round(netAssets).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">공제액</span>
                <span className="text-green-600">-{Math.round(totalDeductions).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-gray-900">과세표준</span>
                <span className="font-medium text-gray-900">{Math.round(taxableAmount).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">적용 세율</span>
                <span className="text-gray-900">{(taxRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-gray-900">산출세액</span>
                <span className="font-medium text-gray-900">{Math.round(calculatedTax).toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={handleShowBreakdown}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {showBreakdown ? '간단히' : '상세히'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>PDF 생성 중...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF 다운</span>
                </>
              )}
            </button>
            
            {/* 공유하기 버튼 */}
            <div className="relative share-menu-container">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
                title="공유"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>공유</span>
              </button>
              
              {/* 공유 메뉴 */}
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleShare('url')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>URL 복사</span>
                    </button>
                    {/* 임시로 주석 처리
                    <button
                      onClick={() => handleShare('kakao')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                      </svg>
                      <span>카카오톡 공유</span>
                    </button>
                    */}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-xs text-yellow-700">
              ⚠️ 이 결과는 실시간 계산으로 참고용입니다. 실제 상속세는 전문가와 상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

      {/* (계산 과정) 상세 보기 */}
      {showBreakdown && (
        <CalculationBreakdown formData={formData} calculationResult={result} />
      )}

      {/* PDF용 숨겨진 TaxReport 컴포넌트 */}
      <div id="hidden-tax-report" style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px' }}>
        <TaxReport formData={formData} calculationResult={result} />
      </div>
    </div>
  );
} 