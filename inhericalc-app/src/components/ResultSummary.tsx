'use client';

import { useEffect, useState, useCallback } from 'react';
import { TaxCalculationResult, InheritanceData } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/calculator';
import { saveCalculationRecord } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import TaxReport from './TaxReport';
import ExpertConsultModal from './ExpertConsultModal';
import LoginRequiredModal from './LoginRequiredModal';
// import KakaoShareButton from './KakaoShareButton';

interface ResultSummaryProps {
  result: TaxCalculationResult;
  formData: InheritanceData;
  user?: User | null;
  onReset: () => void;
  onSaveCalculation?: () => void;
  onShowAuthModal?: () => void;
}

export default function ResultSummary({ result, formData, user, onReset, onSaveCalculation, onShowAuthModal }: ResultSummaryProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pdf' | null>(null);

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

  // PDF 다운로드 권한 확인 및 처리
  const handleDownloadPDFRequest = () => {
    if (!user) {
      // 비로그인 사용자인 경우 로그인 모달 표시
      setPendingAction('pdf');
      setShowLoginModal(true);
      return;
    }
    
    // 로그인된 사용자인 경우 바로 PDF 다운로드
    handleDownloadPDF();
  };

  // PDF 다운로드 핸들러 - useCallback으로 최적화
  const handleDownloadPDF = useCallback(async () => {
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
      const hiddenTaxReport = document.querySelector('#hidden-tax-report-summary');
      if (!hiddenTaxReport) {
        throw new Error('PDF 생성용 요소를 찾을 수 없습니다.');
      }

      // HTML을 Canvas로 변환 - 용량 최적화
      const canvas = await html2canvas(hiddenTaxReport as HTMLElement, {
        scale: 1.2, // 1.5에서 1.2로 축소하여 용량 줄이기
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: 1200,
        imageTimeout: 15000,
        removeContainer: true
      });

      // PDF 생성 - 용량 최적화 및 페이지 분할 개선
      const imgData = canvas.toDataURL('image/jpeg', 0.85); // PNG에서 JPEG로 변경, 품질 85%로 설정
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = 210; // A4 너비 (mm)
      const pdfHeight = 297; // A4 높이 (mm)
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      const pageHeight = pdfHeight - 20; // 상하 여백 10mm씩

      // 첫 번째 페이지
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 추가 페이지들 - 페이지 분할 개선
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        
        // 페이지 경계에서 잘리지 않도록 약간의 오버랩 추가
        const overlap = 5; // 5mm 오버랩
        pdf.addImage(imgData, 'JPEG', 0, position + overlap, imgWidth, imgHeight);
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
  }, [result, user, formData.deceasedName, handleSaveCalculation]);

  // 로그인 성공 후 대기 중인 액션 실행
  useEffect(() => {
    if (user && pendingAction === 'pdf') {
      setPendingAction(null);
      setTimeout(() => {
        handleDownloadPDF();
      }, 500); // 로그인 완료 후 약간의 지연
    }
  }, [user, pendingAction, handleDownloadPDF]);

  // 공유 핸들러
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
              imageUrl: 'https://taxsimp.com/og-image.png',
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

  // 로그인 모달 핸들러
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setPendingAction(null);
  };

  const handleShowAuthModalFromLogin = () => {
    setShowLoginModal(false);
    if (onShowAuthModal) {
      onShowAuthModal();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">상속세 계산 결과</h2>
        <div className="flex gap-2">
          {/* <KakaoShareButton
            title="TaxSimp 상속세 계산 결과"
            description={`상속세 계산 결과: ${formatCurrency(finalTax)}원 | 순 재산가액: ${formatCurrency(netAssets)}원 | 과세표준: ${formatCurrency(taxableAmount)}원`}
            className="text-sm"
          /> */}
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            다시 계산하기
          </button>
        </div>
      </div>

      {/* 최종 상속세 */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="text-center">
          <p className="text-lg text-black mb-2">최종 상속세</p>
          <p className="text-4xl font-bold text-blue-600">
            {formatCurrency(finalTax)}원
          </p>
        </div>
      </div>

      {/* 계산 내역 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black">계산 내역</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 재산 및 채무 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-black">총 재산가액</span>
              <span className="font-semibold text-black">{formatCurrency(totalAssets)}원</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-black">총 채무</span>
              <span className="font-semibold text-red-600">-{formatCurrency(totalDebts)}원</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-black font-medium">순 재산가액</span>
              <span className="font-bold text-blue-600">{formatCurrency(netAssets)}원</span>
            </div>
          </div>

          {/* 공제 및 세액 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-black">총 공제액</span>
              <span className="font-semibold text-green-600">-{formatCurrency(totalDeductions)}원</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <span className="text-black font-medium">과세표준</span>
              <span className="font-bold text-yellow-600">{formatCurrency(taxableAmount)}원</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-200">
              <span className="text-black font-medium">적용 세율</span>
              <span className="font-bold text-red-600">{formatPercentage(taxRate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 내역 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black">상세 내역</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-black">순 재산가액</span>
            <span className="text-black">{formatCurrency(netAssets)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">공제액</span>
            <span className="text-green-600">-{formatCurrency(totalDeductions)}원</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-black font-medium">과세표준</span>
            <span className="font-medium text-black">{formatCurrency(taxableAmount)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">세율</span>
            <span className="text-black">{formatPercentage(taxRate)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-black font-medium">산출세액</span>
            <span className="font-medium text-black">{formatCurrency(calculatedTax)}원</span>
          </div>
        </div>
      </div>

      {/* PDF 다운로드 및 공유 버튼 */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {/* PDF 다운로드 버튼 - 권한 제어 적용 */}
        <button
          onClick={handleDownloadPDFRequest}
          disabled={isGeneratingPDF}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
        >
          {isGeneratingPDF ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>생성중...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>PDF다운</span>
            </>
          )}
        </button>

        {/* 전문가 상담 버튼 */}
        <button
          onClick={() => setShowExpertModal(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center justify-center space-x-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>전문가상담</span>
        </button>
        
        {/* 공유하기 버튼 */}
        <div className="relative share-menu-container">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center space-x-2 whitespace-nowrap w-full sm:w-auto"
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
                  className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>URL 복사</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h4>
        <ul className="text-sm text-black space-y-1">
          <li>• 이 계산 결과는 참고용이며, 실제 상속세는 세무사와 상담하시기 바랍니다.</li>
          <li>• 증여 합산, 특수관계인 공제 등 추가적인 요소가 있을 수 있습니다.</li>
          <li>• 세법 개정에 따라 계산 기준이 변경될 수 있습니다.</li>
        </ul>
      </div>

      {/* PDF용 숨겨진 TaxReport 컴포넌트 */}
      <div id="hidden-tax-report-summary" style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px' }}>
        <TaxReport formData={formData} calculationResult={result} />
      </div>

      {/* 전문가 상담 모달 */}
      <ExpertConsultModal 
        isOpen={showExpertModal} 
        onClose={() => setShowExpertModal(false)} 
        user={user}
        onShowAuthModal={onShowAuthModal}
      />

      {/* 로그인 필요 모달 */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        onShowAuthModal={handleShowAuthModalFromLogin}
        feature="PDF 다운로드"
      />
    </div>
  );
} 