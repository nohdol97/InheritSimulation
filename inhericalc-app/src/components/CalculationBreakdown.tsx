'use client';

import { InheritanceData, TaxCalculationResult } from '@/types';

interface CalculationBreakdownProps {
  formData: InheritanceData;
  calculationResult: TaxCalculationResult | null;
}

export default function CalculationBreakdown({ formData, calculationResult }: CalculationBreakdownProps) {
  if (!calculationResult) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">계산 과정</h3>
        <div className="text-black text-center py-8">
          입력 정보를 입력하면 계산 과정을 확인할 수 있습니다.
        </div>
      </div>
    );
  }

  // 자산 계산 - 중첩된 객체 구조 처리
  const realEstateTotal = Object.values(formData.assets.realEstate).reduce((sum, value) => sum + value, 0);
  const financialTotal = Object.values(formData.assets.financial).reduce((sum, value) => sum + value, 0);
  const insuranceTotal = Object.values(formData.assets.insurance).reduce((sum, value) => sum + value, 0);
  const businessTotal = Object.values(formData.assets.business).reduce((sum, value) => sum + value, 0);
  const movablesTotal = Object.values(formData.assets.movables).reduce((sum, value) => sum + value, 0);
  const otherAssetsTotal = Object.values(formData.assets.other).reduce((sum, value) => sum + value, 0);
  
  const totalAssets = realEstateTotal + financialTotal + insuranceTotal + businessTotal + movablesTotal + otherAssetsTotal;

  // 채무 계산 - 중첩된 객체 구조 처리
  const funeralTotal = Object.values(formData.debts.funeral).reduce((sum, value) => sum + value, 0);
  const financialDebtTotal = Object.values(formData.debts.financial).reduce((sum, value) => sum + value, 0);
  const taxesTotal = Object.values(formData.debts.taxes).reduce((sum, value) => sum + value, 0);
  const otherDebtsTotal = Object.values(formData.debts.other).reduce((sum, value) => sum + value, 0);
  
  const totalDebts = funeralTotal + financialDebtTotal + taxesTotal + otherDebtsTotal;
  
  // 공제 계산 (2025년 법령 기준)
  const basicDeduction = 50000000 * formData.heirsCount; // 기초공제: 5천만원 × 상속인 수
  const lumpSumDeduction = formData.deductions.basic ? Math.max(200000000, basicDeduction) : 0; // 일괄공제: 2억원과 기초공제 중 큰 금액
  const spouseDeduction = formData.deductions.spouse ? Math.max(500000000, basicDeduction) : 0; // 배우자공제: 최소 5억원 보장
  const disabledDeduction = formData.deductions.disabled ? 10000000 * 10 * formData.disabledCount : 0; // 장애인공제: 1천만원 × 10년 × 장애인 수
  const minorDeduction = formData.deductions.minor ? 10000000 * 10 * formData.minorChildrenCount : 0; // 미성년자공제: 1천만원 × 10년 × 미성년자 수
  const elderlyDeduction = formData.deductions.elderly ? 50000000 * formData.elderlyCount : 0; // 연로자공제: 5천만원 × 연로자 수
  const financialAssetDeduction = formData.deductions.financialAsset ? financialTotal * 0.2 : 0; // 금융재산공제: 20%
  const cohabitingHouseDeduction = formData.deductions.cohabitingHouse ? 600000000 : 0; // 동거주택공제: 최대 6억원
  
  // 총 공제액: 기초공제/일괄공제/배우자공제 중 하나 + 인적공제들 + 기타공제들
  let totalDeductions = 0;
  if (formData.deductions.spouse && formData.hasSpouse) {
    totalDeductions = spouseDeduction; // 배우자공제 선택
  } else if (formData.deductions.basic) {
    totalDeductions = lumpSumDeduction; // 일괄공제 선택
  } else {
    totalDeductions = basicDeduction; // 기초공제만
  }
  totalDeductions += disabledDeduction + minorDeduction + elderlyDeduction + financialAssetDeduction + cohabitingHouseDeduction;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-black mb-4">계산 과정 상세</h3>
      
      <div className="space-y-6">
        {/* 1단계: 총 재산가액 */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-medium text-black mb-2">1단계: 총 재산가액 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between text-black">
              <span>부동산:</span>
              <span>{realEstateTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>금융자산:</span>
              <span>{financialTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>보험:</span>
              <span>{insuranceTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>사업자산:</span>
              <span>{businessTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>동산:</span>
              <span>{movablesTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>기타 재산:</span>
              <span>{otherAssetsTotal.toLocaleString()}원</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium text-black">
              <span>총 재산가액:</span>
              <span className="text-blue-600">{totalAssets.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 2단계: 총 채무 */}
        <div className="border-l-4 border-red-500 pl-4">
          <h4 className="font-medium text-black mb-2">2단계: 총 채무 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between text-black">
              <span>장례비:</span>
              <span>{funeralTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>금융채무:</span>
              <span>{financialDebtTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>세금 미납:</span>
              <span>{taxesTotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>기타 채무:</span>
              <span>{otherDebtsTotal.toLocaleString()}원</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium text-black">
              <span>총 채무:</span>
              <span className="text-red-600">{totalDebts.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 3단계: 순 재산가액 */}
        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-medium text-black mb-2">3단계: 순 재산가액 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between font-medium text-black">
              <span>총 재산가액 - 총 채무:</span>
              <span className="text-green-600">{calculationResult.netAssets.toLocaleString()}원</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {totalAssets.toLocaleString()} - {totalDebts.toLocaleString()} = {calculationResult.netAssets.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 4단계: 공제 계산 */}
        <div className="border-l-4 border-purple-500 pl-4">
          <h4 className="font-medium text-black mb-2">4단계: 공제 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            {formData.deductions.basic && (
              <div className="flex justify-between text-black">
                <span>일괄공제:</span>
                <span>{lumpSumDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.spouse && (
              <div className="flex justify-between text-black">
                <span>배우자공제:</span>
                <span>{spouseDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.disabled && (
              <div className="flex justify-between text-black">
                <span>장애인공제:</span>
                <span>{disabledDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.minor && (
              <div className="flex justify-between text-black">
                <span>미성년공제:</span>
                <span>{minorDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.elderly && (
              <div className="flex justify-between text-black">
                <span>연로자공제:</span>
                <span>{elderlyDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.financialAsset && (
              <div className="flex justify-between text-black">
                <span>금융재산공제:</span>
                <span>{financialAssetDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.cohabitingHouse && (
              <div className="flex justify-between text-black">
                <span>동거주택공제:</span>
                <span>{cohabitingHouseDeduction.toLocaleString()}원</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-medium text-black">
              <span>총 공제액:</span>
              <span className="text-purple-600">{totalDeductions.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 5단계: 과세표준 */}
        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="font-medium text-black mb-2">5단계: 과세표준 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between font-medium text-black">
              <span>순 재산가액 - 총 공제액:</span>
              <span className="text-orange-600">{calculationResult.taxableAmount.toLocaleString()}원</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {calculationResult.netAssets.toLocaleString()} - {totalDeductions.toLocaleString()} = {calculationResult.taxableAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 6단계: 세율 적용 */}
        <div className="border-l-4 border-indigo-500 pl-4">
          <h4 className="font-medium text-black mb-2">6단계: 세율 적용</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between text-black">
              <span>과세표준:</span>
              <span>{calculationResult.taxableAmount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-black">
              <span>적용 세율:</span>
              <span>{(calculationResult.taxRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-black">
              <span>누진공제:</span>
              <span>{calculationResult.progressiveDeduction.toLocaleString()}원</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium text-black">
              <span>산출세액:</span>
              <span className="text-indigo-600">{calculationResult.calculatedTax.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 7단계: 상속인별 세액 */}
        <div className="border-l-4 border-pink-500 pl-4">
          <h4 className="font-medium text-black mb-2">7단계: 상속인별 세액</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between text-black">
              <span>상속인 수:</span>
              <span>{formData.heirsCount}명</span>
            </div>
            <div className="flex justify-between font-medium text-black">
              <span>상속인별 세액:</span>
              <span className="text-pink-600">{calculationResult.taxPerHeir.toLocaleString()}원</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {calculationResult.calculatedTax.toLocaleString()} ÷ {formData.heirsCount} = {calculationResult.taxPerHeir.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 세율 정보 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-black mb-2">📊 2025년 상속세 법령 기준</h4>
          <div className="text-sm text-black space-y-1">
            <div><strong>상속세율:</strong></div>
            <div>• 1억원 이하: 10%</div>
            <div>• 5억원 이하: 20%</div>
            <div>• 10억원 이하: 30%</div>
            <div>• 30억원 이하: 40%</div>
            <div>• 30억원 초과: 50%</div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <div><strong>공제 기준:</strong></div>
            <div>✓ 기초공제: 5천만원 × 상속인 수</div>
            <div>✓ 일괄공제: 2억원 (기존 5억원에서 변경)</div>
            <div>✓ 배우자공제: 최소 5억원 보장 (일괄공제와 중복 ❌)</div>
            <div>✓ 금융재산공제: 금융재산의 20%</div>
            <div>✓ 동거주택공제: 최대 6억원</div>
            <div>✓ 장애인/미성년/연로자공제: 각각 별도 계산</div>
          </div>
        </div>

        {/* 최종 결과 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white">
          <h4 className="font-medium mb-2">💰 최종 계산 결과</h4>
          <div className="text-lg font-bold">
            예상 상속세: {calculationResult.calculatedTax.toLocaleString()}원
          </div>
          <div className="text-sm opacity-90 mt-1">
            상속인별 세액: {calculationResult.taxPerHeir.toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
} 