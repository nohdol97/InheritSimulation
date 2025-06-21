'use client';

import { useEffect, useState } from 'react';
import { InheritanceData, TaxCalculationResult } from '@/types';
import { calculateInheritanceTax, formatCurrency } from '@/lib/calculator';
import CalculationBreakdown from './CalculationBreakdown';

interface LiveCalculationProps {
  formData: InheritanceData;
}

export default function LiveCalculation({ formData }: LiveCalculationProps) {
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

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

          {/* 계산 과정 보기 버튼 */}
          <div className="text-center">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {showBreakdown ? '간단히 보기' : '계산 과정 상세 보기'}
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
    </div>
  );
} 