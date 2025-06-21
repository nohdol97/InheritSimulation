import { InheritanceData, TaxCalculationResult } from '@/types';

// 상속세 세율 (2025년 기준)
const TAX_RATES = [
  { min: 0, max: 100000000, rate: 0.10, deduction: 0 },
  { min: 100000000, max: 500000000, rate: 0.20, deduction: 10000000 },
  { min: 500000000, max: 1000000000, rate: 0.30, deduction: 60000000 },
  { min: 1000000000, max: 3000000000, rate: 0.40, deduction: 160000000 },
  { min: 3000000000, max: Infinity, rate: 0.50, deduction: 460000000 }
];

// 공제 금액 (2025년 기준)
const DEDUCTION_AMOUNTS = {
  spouse: 600000000,      // 배우자 공제 - 6억원
  disabled: 100000000,    // 장애인 공제
  minor: 100000000,       // 미성년 공제
  basic: 200000000        // 일괄 공제 - 2억원
};

/**
 * 상속세 계산 함수
 */
export function calculateInheritanceTax(data: InheritanceData): TaxCalculationResult {
  // 1. 총 재산가액 계산
  const totalAssets = calculateTotalAssets(data.assets);
  
  // 2. 총 채무 계산
  const totalDebts = calculateTotalDebts(data.debts);
  
  // 3. 순 재산가액 계산
  const netAssets = totalAssets - totalDebts;
  
  // 4. 공제액 계산
  const totalDeductions = calculateDeductions(data.deductions, netAssets);
  
  // 5. 과세표준 계산
  const taxableAmount = Math.max(0, netAssets - totalDeductions);
  
  // 6. 세율 및 세액 계산
  const { taxRate, calculatedTax, progressiveDeduction } = calculateTaxRate(taxableAmount);
  
  // 7. 상속인별 세액 계산
  const taxPerHeir = data.heirsCount > 0 ? calculatedTax / data.heirsCount : 0;
  
  // 8. 최종 상속세 계산
  const finalTax = calculatedTax;
  
  return {
    totalAssets,
    totalDebts,
    netAssets,
    totalDeductions,
    taxableAmount,
    taxRate,
    progressiveDeduction,
    calculatedTax,
    taxPerHeir,
    finalTax,
    breakdown: {
      assets: totalAssets,
      debts: totalDebts,
      deductions: totalDeductions,
      taxRate: taxRate * 100 // 퍼센트로 변환
    }
  };
}

/**
 * 총 재산가액 계산
 */
function calculateTotalAssets(assets: InheritanceData['assets']): number {
  const realEstateTotal = Object.values(assets.realEstate).reduce((sum, value) => sum + value, 0);
  const financialTotal = Object.values(assets.financial).reduce((sum, value) => sum + value, 0);
  const insuranceTotal = Object.values(assets.insurance).reduce((sum, value) => sum + value, 0);
  const businessTotal = Object.values(assets.business).reduce((sum, value) => sum + value, 0);
  const movablesTotal = Object.values(assets.movables).reduce((sum, value) => sum + value, 0);
  const otherTotal = Object.values(assets.other).reduce((sum, value) => sum + value, 0);
  
  return realEstateTotal + financialTotal + insuranceTotal + businessTotal + movablesTotal + otherTotal;
}

/**
 * 총 채무 계산
 */
function calculateTotalDebts(debts: InheritanceData['debts']): number {
  const funeralTotal = Object.values(debts.funeral).reduce((sum, value) => sum + value, 0);
  const financialTotal = Object.values(debts.financial).reduce((sum, value) => sum + value, 0);
  const taxesTotal = Object.values(debts.taxes).reduce((sum, value) => sum + value, 0);
  const otherTotal = Object.values(debts.other).reduce((sum, value) => sum + value, 0);
  
  return funeralTotal + financialTotal + taxesTotal + otherTotal;
}

/**
 * 공제액 계산
 */
function calculateDeductions(deductions: InheritanceData['deductions'], netAssets: number): number {
  let totalDeductions = 0;
  
  if (deductions.basic) {
    totalDeductions += DEDUCTION_AMOUNTS.basic;
  }
  
  if (deductions.spouse) {
    totalDeductions += DEDUCTION_AMOUNTS.spouse;
  }
  
  if (deductions.disabled) {
    totalDeductions += DEDUCTION_AMOUNTS.disabled;
  }
  
  if (deductions.minor) {
    totalDeductions += DEDUCTION_AMOUNTS.minor;
  }
  
  // 공제액은 순 재산가액을 초과할 수 없음
  return Math.min(totalDeductions, netAssets);
}

/**
 * 세율 및 세액 계산
 */
function calculateTaxRate(taxableAmount: number): { taxRate: number; calculatedTax: number; progressiveDeduction: number } {
  if (taxableAmount <= 0) {
    return { taxRate: 0, calculatedTax: 0, progressiveDeduction: 0 };
  }
  
  // 해당하는 세율 구간 찾기
  const taxBracket = TAX_RATES.find(bracket => 
    taxableAmount > bracket.min && taxableAmount <= bracket.max
  );
  
  if (!taxBracket) {
    return { taxRate: 0, calculatedTax: 0, progressiveDeduction: 0 };
  }
  
  // 세액 계산: (과세표준 × 세율) - 누진공제
  const calculatedTax = (taxableAmount * taxBracket.rate) - taxBracket.deduction;
  
  return {
    taxRate: taxBracket.rate,
    calculatedTax: Math.max(0, calculatedTax),
    progressiveDeduction: taxBracket.deduction
  };
}

/**
 * 금액을 한국어 형식으로 포맷팅
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount);
}

/**
 * 세율을 퍼센트 형식으로 포맷팅
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
} 