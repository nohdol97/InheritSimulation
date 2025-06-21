'use client';

import { TaxCalculationResult } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/calculator';
import KakaoShareButton from './KakaoShareButton';

interface ResultSummaryProps {
  result: TaxCalculationResult;
  onReset: () => void;
}

export default function ResultSummary({ result, onReset }: ResultSummaryProps) {
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
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">상속세 계산 결과</h2>
        <div className="flex gap-2">
          <KakaoShareButton
            title="TaxSimp 상속세 계산 결과"
            description={`상속세 계산 결과: ${formatCurrency(finalTax)}원 | 순 재산가액: ${formatCurrency(netAssets)}원 | 과세표준: ${formatCurrency(taxableAmount)}원`}
            className="text-sm"
          />
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            다시 계산하기
          </button>
        </div>
      </div>

      {/* 최종 상속세 */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">최종 상속세</p>
          <p className="text-4xl font-bold text-blue-600">
            {formatCurrency(finalTax)}원
          </p>
        </div>
      </div>

      {/* 계산 내역 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">계산 내역</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 재산 및 채무 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">총 재산가액</span>
              <span className="font-semibold">{formatCurrency(totalAssets)}원</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">총 채무</span>
              <span className="font-semibold text-red-600">-{formatCurrency(totalDebts)}원</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-gray-700 font-medium">순 재산가액</span>
              <span className="font-bold text-blue-600">{formatCurrency(netAssets)}원</span>
            </div>
          </div>

          {/* 공제 및 세액 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">총 공제액</span>
              <span className="font-semibold text-green-600">-{formatCurrency(totalDeductions)}원</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <span className="text-gray-700 font-medium">과세표준</span>
              <span className="font-bold text-yellow-600">{formatCurrency(taxableAmount)}원</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-200">
              <span className="text-gray-700 font-medium">적용 세율</span>
              <span className="font-bold text-red-600">{formatPercentage(taxRate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 내역 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">상세 내역</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">순 재산가액</span>
            <span>{formatCurrency(netAssets)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">공제액</span>
            <span className="text-green-600">-{formatCurrency(totalDeductions)}원</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-700 font-medium">과세표준</span>
            <span className="font-medium">{formatCurrency(taxableAmount)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">세율</span>
            <span>{formatPercentage(taxRate)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-700 font-medium">산출세액</span>
            <span className="font-medium">{formatCurrency(calculatedTax)}원</span>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 이 계산 결과는 참고용이며, 실제 상속세는 세무사와 상담하시기 바랍니다.</li>
          <li>• 증여 합산, 특수관계인 공제 등 추가적인 요소가 있을 수 있습니다.</li>
          <li>• 세법 개정에 따라 계산 기준이 변경될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
} 