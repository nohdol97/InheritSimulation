import { InheritanceData, TaxCalculationResult } from '@/types';

// 2025년 상속세율표
const TAX_RATES = [
  { min: 0, max: 100000000, rate: 0.1, deduction: 0 },
  { min: 100000000, max: 500000000, rate: 0.2, deduction: 10000000 },
  { min: 500000000, max: 1000000000, rate: 0.3, deduction: 60000000 },
  { min: 1000000000, max: 3000000000, rate: 0.4, deduction: 160000000 },
  { min: 3000000000, max: Infinity, rate: 0.5, deduction: 460000000 }
];

/**
 * 상속세 계산 (2025년 법령 기준)
 */
export function calculateInheritanceTax(data: InheritanceData): TaxCalculationResult {
  // 1. 총 재산가액 계산
  const totalAssets = calculateTotalAssets(data.assets);
  
  // 2. 비과세재산 제외
  const nonTaxableAssets = calculateNonTaxableAssets(data.assets.nonTaxableAssets);
  
  // 3. 사전증여재산 가산
  const giftedAssets = calculateGiftedAssets(data.assets.giftsAdded);
  
  // 4. 총 채무 계산
  const totalDebts = calculateTotalDebts(data.debts);
  
  // 5. 상속재산 = 총재산 - 비과세재산 + 사전증여재산 - 채무
  const taxableInheritance = totalAssets - nonTaxableAssets + giftedAssets - totalDebts;
  
  // 6. 상속공제 계산
  const totalDeductions = calculateDeductions(data.deductions, taxableInheritance, data.assets, data);
  
  // 7. 과세표준 = 상속재산 - 상속공제
  const taxableAmount = Math.max(0, taxableInheritance - totalDeductions);
  
  // 8. 세율 및 산출세액 계산
  const { taxRate, calculatedTax, progressiveDeduction } = calculateTaxRate(taxableAmount);
  
  // 9. 세액공제 계산
  const taxCredits = calculateTaxCredits(data.taxCredits, calculatedTax);
  
  // 10. 최종 상속세 = 산출세액 - 세액공제
  const finalTax = Math.max(0, calculatedTax - taxCredits);
  
  // 11. 상속인별 세액 계산
  const taxPerHeir = data.heirsCount > 0 ? finalTax / data.heirsCount : 0;
  
  return {
    totalAssets,
    totalDebts,
    netAssets: taxableInheritance,
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
      taxRate: taxRate * 100
    }
  };
}

/**
 * 총 재산가액 계산
 */
function calculateTotalAssets(assets: InheritanceData['assets']): number {
  const realEstateTotal = Object.values(assets.realEstate).reduce((sum: number, value: number) => sum + value, 0);
  const financialTotal = Object.values(assets.financial).reduce((sum: number, value: number) => sum + value, 0);
  const insuranceTotal = Object.values(assets.insurance).reduce((sum: number, value: number) => sum + value, 0);
  const businessTotal = Object.values(assets.business).reduce((sum: number, value: number) => sum + value, 0);
  const movablesTotal = Object.values(assets.movables).reduce((sum: number, value: number) => sum + value, 0);
  const otherTotal = Object.values(assets.other).reduce((sum: number, value: number) => sum + value, 0);
  
  return realEstateTotal + financialTotal + insuranceTotal + businessTotal + movablesTotal + otherTotal;
}

/**
 * 비과세재산 계산
 */
function calculateNonTaxableAssets(nonTaxableAssets: InheritanceData['assets']['nonTaxableAssets']): number {
  return Object.values(nonTaxableAssets).reduce((sum: number, value: number) => sum + value, 0);
}

/**
 * 사전증여재산 계산
 */
function calculateGiftedAssets(giftsAdded: InheritanceData['assets']['giftsAdded']): number {
  const realEstateGifts = giftsAdded.realEstate.reduce((sum, gift) => sum + gift.value, 0);
  const otherGifts = giftsAdded.other.reduce((sum, gift) => sum + gift.value, 0);
  
  return realEstateGifts + otherGifts;
}

/**
 * 총 채무 계산 (장례비용 포함)
 */
function calculateTotalDebts(debts: InheritanceData['debts']): number {
  const funeralTotal = Object.values(debts.funeral).reduce((sum: number, value: number) => sum + value, 0);
  const financialTotal = Object.values(debts.financial).reduce((sum: number, value: number) => sum + value, 0);
  const taxesTotal = Object.values(debts.taxes).reduce((sum: number, value: number) => sum + value, 0);
  const otherTotal = Object.values(debts.other).reduce((sum: number, value: number) => sum + value, 0);
  
  return funeralTotal + financialTotal + taxesTotal + otherTotal;
}

/**
 * 상속공제 계산 (2025년 법령 기준)
 */
function calculateDeductions(
  deductions: InheritanceData['deductions'], 
  taxableInheritance: number, 
  assets: InheritanceData['assets'],
  data: InheritanceData
): number {
  let totalDeductions = 0;
  
  // 1. 기초공제: 5천만원 × 상속인 수
  const basicDeduction = 50000000 * data.heirsCount;
  
  // 2. 일괄공제 vs 배우자공제 선택 (중복 불가)
  if (deductions.spouse && data.hasSpouse) {
    // 배우자공제 선택 시: 최소 5억원
    totalDeductions += Math.max(500000000, basicDeduction);
  } else if (deductions.basic) {
    // 일괄공제 선택 시: 2억원과 기초공제 중 큰 금액
    totalDeductions += Math.max(200000000, basicDeduction);
  } else {
    // 기초공제만 적용
    totalDeductions += basicDeduction;
  }
  
  // 3. 인적공제 추가 (개별 정보 기반 계산)
  if (deductions.disabled && data.disabledDetails && data.disabledDetails.length > 0) {
    // 장애인공제: 각 장애인의 기대여명에 따라 개별 계산
    const disabledDeduction = data.disabledDetails.reduce((sum, disabled) => {
      return sum + (10000000 * (disabled.lifeExpectancy || 35));
    }, 0);
    totalDeductions += disabledDeduction;
  }
  
  if (deductions.minor && data.minorDetails && data.minorDetails.length > 0) {
    // 미성년자공제: 각 미성년자의 나이에 따라 개별 계산
    const minorDeduction = data.minorDetails.reduce((sum, minor) => {
      const yearsUntil19 = Math.max(0, 19 - minor.age);
      return sum + (10000000 * yearsUntil19);
    }, 0);
    totalDeductions += minorDeduction;
  }
  
  if (deductions.elderly && data.elderlyCount > 0) {
    // 연로자공제: 5천만원 × 연로자 수
    totalDeductions += 50000000 * data.elderlyCount;
  }
  
  // 4. 금융재산 상속공제
  if (deductions.financialAsset) {
    const financialAssets = Object.values(assets.financial).reduce((sum: number, value: number) => sum + value, 0);
    const financialDeduction = financialAssets * 0.2;
    totalDeductions += financialDeduction;
  }
  
  // 5. 동거주택 상속공제
  if (deductions.cohabitingHouse) {
    totalDeductions += 600000000;
  }
  
  // 6. 기타 공제들
  if (deductions.businessSuccession) {
    totalDeductions += 500000000;
  }
  
  if (deductions.farmingSuccession) {
    totalDeductions += 500000000;
  }
  
  if (deductions.disasterLoss && deductions.disasterLossAmount) {
    totalDeductions += deductions.disasterLossAmount;
  }
  
  return Math.min(totalDeductions, taxableInheritance);
}

/**
 * 세액공제 계산
 */
function calculateTaxCredits(taxCredits: InheritanceData['taxCredits'], calculatedTax: number): number {
  let totalCredits = 0;
  
  if (taxCredits.generationSkipSurcharge && taxCredits.generationSkipSurchargeAmount) {
    totalCredits += taxCredits.generationSkipSurchargeAmount;
  }
  
  if (taxCredits.giftTaxCredit) {
    totalCredits += 10000000;
  }
  
  if (taxCredits.foreignTaxCredit && taxCredits.foreignTaxCreditAmount) {
    totalCredits += taxCredits.foreignTaxCreditAmount;
  }
  
  if (taxCredits.shortTermReinheritanceCredit && taxCredits.shortTermReinheritanceCreditAmount) {
    totalCredits += taxCredits.shortTermReinheritanceCreditAmount;
  }
  
  return Math.min(totalCredits, calculatedTax);
}

/**
 * 세율 및 세액 계산
 */
function calculateTaxRate(taxableAmount: number): { taxRate: number; calculatedTax: number; progressiveDeduction: number } {
  if (taxableAmount <= 0) {
    return { taxRate: 0, calculatedTax: 0, progressiveDeduction: 0 };
  }
  
  const taxBracket = TAX_RATES.find(bracket => 
    taxableAmount > bracket.min && taxableAmount <= bracket.max
  );
  
  if (!taxBracket) {
    return { taxRate: 0, calculatedTax: 0, progressiveDeduction: 0 };
  }
  
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
