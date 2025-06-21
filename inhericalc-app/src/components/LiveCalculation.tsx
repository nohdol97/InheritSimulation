'use client';

import { useEffect, useState } from 'react';
import { InheritanceData, TaxCalculationResult } from '@/types';
import { calculateInheritanceTax, formatCurrency } from '@/lib/calculator';
import CalculationBreakdown from './CalculationBreakdown';
import TaxReport from './TaxReport';

interface LiveCalculationProps {
  formData: InheritanceData;
}

export default function LiveCalculation({ formData }: LiveCalculationProps) {
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const handleDownloadPDF = async () => {
    if (!result) return;

    setIsGeneratingPDF(true);
    
    try {
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

  if (!result) {
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
            <p className="text-sm text-gray-600 mb-2">예상 상속세</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(finalTax)}원
            </p>
          </div>

          {/* 요약 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-blue-600 mb-1">순 재산가액</p>
              <p className="text-lg font-semibold text-blue-800">
                {formatCurrency(netAssets)}원
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-xs text-yellow-600 mb-1">과세표준</p>
              <p className="text-lg font-semibold text-yellow-800">
                {formatCurrency(taxableAmount)}원
              </p>
            </div>
          </div>

          {/* 상세 내역 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">상세 내역</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">총 재산가액</span>
                <span>{formatCurrency(totalAssets)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 채무</span>
                <span className="text-red-600">-{formatCurrency(totalDebts)}원</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">순 재산가액</span>
                <span className="font-medium">{formatCurrency(netAssets)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">공제액</span>
                <span className="text-green-600">-{formatCurrency(totalDeductions)}원</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">과세표준</span>
                <span className="font-medium">{formatCurrency(taxableAmount)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">적용 세율</span>
                <span>{(taxRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">산출세액</span>
                <span className="font-medium">{formatCurrency(calculatedTax)}원</span>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {showBreakdown ? '간단히 보기' : '계산 과정 상세 보기'}
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
                  <span>PDF 다운로드</span>
                </>
              )}
            </button>
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-xs text-yellow-700">
              ⚠️ 이 결과는 실시간 계산으로 참고용입니다. 실제 상속세는 전문가와 상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

      {/* 계산 과정 상세 보기 */}
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