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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 과정</h3>
        <div className="text-gray-800 text-center py-8">
          입력 정보를 입력하면 계산 과정을 확인할 수 있습니다.
        </div>
      </div>
    );
  }

  const totalAssets = Object.values(formData.assets).reduce((sum, value) => sum + value, 0);
  const totalDebts = Object.values(formData.debts).reduce((sum, value) => sum + value, 0);
  
  // 공제 계산
  const basicDeduction = formData.deductions.basic ? 200000000 : 0; // 2025년 기준 2억원
  const spouseDeduction = formData.deductions.spouse ? 600000000 : 0; // 2025년 기준 6억원
  const disabledDeduction = formData.deductions.disabled ? 100000000 : 0;
  const minorDeduction = formData.deductions.minor ? 100000000 : 0;
  const totalDeductions = basicDeduction + spouseDeduction + disabledDeduction + minorDeduction;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 과정 상세</h3>
      
      <div className="space-y-6">
        {/* 1단계: 총 재산가액 */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-medium text-gray-800 mb-2">1단계: 총 재산가액 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between text-gray-800">
              <span>부동산:</span>
              <span>{formData.assets.realEstate.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>예금:</span>
              <span>{formData.assets.deposits.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>주식:</span>
              <span>{formData.assets.stocks.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>보험금:</span>
              <span>{formData.assets.insurance.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>사업체:</span>
              <span>{formData.assets.business.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>차량:</span>
              <span>{formData.assets.vehicles.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>기타 재산:</span>
              <span>{formData.assets.other.toLocaleString()}원</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium text-gray-800">
              <span>총 재산가액:</span>
              <span className="text-blue-600">{totalAssets.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 2단계: 총 채무 */}
        <div className="border-l-4 border-red-500 pl-4">
          <h4 className="font-medium text-gray-800 mb-2">2단계: 총 채무 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between text-gray-800">
              <span>장례비:</span>
              <span>{formData.debts.funeral.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>금융채무:</span>
              <span>{formData.debts.financial.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>세금 미납:</span>
              <span>{formData.debts.taxes.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>기타 채무:</span>
              <span>{formData.debts.other.toLocaleString()}원</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium text-gray-800">
              <span>총 채무:</span>
              <span className="text-red-600">{totalDebts.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 3단계: 순 재산가액 */}
        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-medium text-gray-800 mb-2">3단계: 순 재산가액 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between font-medium text-gray-800">
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
          <h4 className="font-medium text-gray-800 mb-2">4단계: 공제 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            {formData.deductions.basic && (
              <div className="flex justify-between text-gray-800">
                <span>일괄공제:</span>
                <span>{basicDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.spouse && (
              <div className="flex justify-between text-gray-800">
                <span>배우자공제:</span>
                <span>{spouseDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.disabled && (
              <div className="flex justify-between text-gray-800">
                <span>장애인공제:</span>
                <span>{disabledDeduction.toLocaleString()}원</span>
              </div>
            )}
            {formData.deductions.minor && (
              <div className="flex justify-between text-gray-800">
                <span>미성년공제:</span>
                <span>{minorDeduction.toLocaleString()}원</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-medium text-gray-800">
              <span>총 공제액:</span>
              <span className="text-purple-600">{totalDeductions.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 5단계: 과세표준 */}
        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="font-medium text-gray-800 mb-2">5단계: 과세표준 계산</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between font-medium text-gray-800">
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
          <h4 className="font-medium text-gray-800 mb-2">6단계: 세율 적용</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between text-gray-800">
              <span>과세표준:</span>
              <span>{calculationResult.taxableAmount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>적용 세율:</span>
              <span>{(calculationResult.taxRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>누진공제:</span>
              <span>{calculationResult.progressiveDeduction.toLocaleString()}원</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium text-gray-800">
              <span>산출세액:</span>
              <span className="text-indigo-600">{calculationResult.calculatedTax.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 7단계: 상속인별 세액 */}
        <div className="border-l-4 border-pink-500 pl-4">
          <h4 className="font-medium text-gray-800 mb-2">7단계: 상속인별 세액</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between text-gray-800">
              <span>상속인 수:</span>
              <span>{formData.heirsCount}명</span>
            </div>
            <div className="flex justify-between font-medium text-gray-800">
              <span>상속인별 세액:</span>
              <span className="text-pink-600">{calculationResult.taxPerHeir.toLocaleString()}원</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {calculationResult.calculatedTax.toLocaleString()} ÷ {formData.heirsCount} = {calculationResult.taxPerHeir.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 세율 정보 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">2025년 상속세율</h4>
        <div className="text-sm text-gray-800 space-y-1">
          <div>1억원 이하: 10%</div>
          <div>1억원 초과 ~ 5억원 이하: 20%</div>
          <div>5억원 초과 ~ 10억원 이하: 30%</div>
          <div>10억원 초과 ~ 30억원 이하: 40%</div>
          <div>30억원 초과: 50%</div>
        </div>
        <div className="mt-3 text-xs text-gray-600 border-t pt-2">
          <div>※ 일괄공제: 2억원 (2025년 기준)</div>
          <div>※ 배우자공제: 6억원 (2025년 기준)</div>
        </div>
      </div>
    </div>
  );
} 