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
  basic: 200000000,       // 기초공제 - 2억원
  lumpSum: 500000000,     // 일괄공제 - 5억원 (기초공제 + 인적공제 합계액과 비교하여 큰 금액 적용)
  spouse: {
    minimum: 500000000,   // 배우자공제 최소 - 5억원
    maximum: 3000000000   // 배우자공제 최대 - 30억원
  },
  disabled: 100000000,    // 장애인공제 - 1억원
  minor: 100000000,       // 미성년공제 - 1억원 (실제로는 1천만원 × 19세까지 잔여연수)
  elderly: 50000000,      // 연로자공제 - 5천만원 (65세 이상)
  child: 50000000,        // 자녀공제 - 5천만원 (자녀 1인당)
  financialAsset: {
    threshold: 40000000,  // 금융재산공제 기준 - 4천만원
    rate: 0.2,           // 공제율 20%
    maximum: 200000000   // 최대 2억원
  },
  cohabitation: 600000000 // 동거주택공제 - 최대 6억원
};

/**
 * 상속세 계산 함수 (정확한 계산식 적용)
 * 상속세 = (((총상속재산 - 비과세재산 - 채무 - 장례비용 + 사전증여재산) - 각종 공제금액) * 세율 - 누진공제) - 세액공제 및 감면 + 가산세
 */
export function calculateInheritanceTax(data: InheritanceData): TaxCalculationResult {
  // 1. 총상속재산가액 계산
  const totalAssets = calculateTotalAssets(data.assets);
  
  // 2. 비과세재산 계산
  const nonTaxableAssets = calculateNonTaxableAssets(data.assets.nonTaxableAssets);
  
  // 3. 총 채무 계산 (장례비용 포함)
  const totalDebts = calculateTotalDebts(data.debts);
  
  // 4. 사전증여재산 계산
  const giftedAssets = calculateGiftedAssets(data.assets.giftsAdded);
  
  // 5. 상속세 과세가액 계산: 총상속재산 - 비과세재산 - 채무 - 장례비용 + 사전증여재산
  const taxableInheritance = Math.max(0, totalAssets - nonTaxableAssets - totalDebts + giftedAssets);
  
  // 6. 상속공제 계산
  const totalDeductions = calculateDeductions(data.deductions, taxableInheritance, data.assets, data);
  
  // 7. 상속세 과세표준 계산: 상속세과세가액 - 각종공제
  const taxableAmount = Math.max(0, taxableInheritance - totalDeductions);
  
  // 8. 상속세 산출세액 계산: 과세표준 × 세율 - 누진공제
  const { taxRate, calculatedTax, progressiveDeduction } = calculateTaxRate(taxableAmount);
  
  // 9. 세액공제 계산
  const taxCredits = calculateTaxCredits(data.taxCredits, calculatedTax);
  
  // 10. 최종 상속세 계산: 산출세액 - 세액공제 (가산세는 현재 미적용)
  const finalTax = Math.max(0, calculatedTax - taxCredits);
  
  // 11. 상속인별 세액 계산
  const taxPerHeir = data.heirsCount > 0 ? finalTax / data.heirsCount : 0;
  
  return {
    totalAssets,
    totalDebts,
    netAssets: taxableInheritance, // 과세가액으로 변경
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
 * 비과세재산 계산
 */
function calculateNonTaxableAssets(nonTaxableAssets: InheritanceData['assets']['nonTaxableAssets']): number {
  return Object.values(nonTaxableAssets).reduce((sum, value) => sum + value, 0);
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
  const funeralTotal = Object.values(debts.funeral).reduce((sum, value) => sum + value, 0);
  const financialTotal = Object.values(debts.financial).reduce((sum, value) => sum + value, 0);
  const taxesTotal = Object.values(debts.taxes).reduce((sum, value) => sum + value, 0);
  const otherTotal = Object.values(debts.other).reduce((sum, value) => sum + value, 0);
  
  return funeralTotal + financialTotal + taxesTotal + otherTotal;
}

/**
 * 상속공제 계산
 */
function calculateDeductions(
  deductions: InheritanceData['deductions'], 
  taxableInheritance: number, 
  assets: InheritanceData['assets'],
  data: InheritanceData
): number {
  let basicAndPersonalDeductions = 0;
  let spouseDeduction = 0;
  let otherDeductions = 0;
  
  // 1. 기초공제 (무조건 적용)
  basicAndPersonalDeductions += DEDUCTION_AMOUNTS.basic;
  
  // 2. 인적공제 계산
  if (deductions.disabled) {
    // 실제로는 장애인 수 × 1천만원 × 기대여명연수
    basicAndPersonalDeductions += DEDUCTION_AMOUNTS.disabled * data.disabledCount;
  }
  
  if (deductions.minor) {
    // 실제로는 미성년자 수 × 1천만원 × (19세 - 현재나이)
    basicAndPersonalDeductions += DEDUCTION_AMOUNTS.minor * data.minorChildrenCount;
  }
  
  if (deductions.elderly) {
    // 연로자공제 (65세 이상)
    basicAndPersonalDeductions += DEDUCTION_AMOUNTS.elderly * data.elderlyCount;
  }
  
  // 3. 일괄공제와 (기초공제 + 인적공제) 중 큰 금액 선택
  const lumpSumVsPersonal = Math.max(DEDUCTION_AMOUNTS.lumpSum, basicAndPersonalDeductions);
  
  // 4. 배우자공제 계산 (별도 적용)
  if (deductions.spouse && data.hasSpouse) {
    // 배우자가 실제 상속받은 금액이 5억원 미만이면 5억원 공제
    // 5억원 이상이면 실제 상속받은 금액 공제 (최대 30억원)
    // 여기서는 간단히 최소 5억원으로 계산 (실제 상속분할 정보가 없으므로)
    spouseDeduction = DEDUCTION_AMOUNTS.spouse.minimum;
  }
  
  // 5. 금융재산상속공제 계산
  if (deductions.financialAsset) {
    const financialAssets = Object.values(assets.financial).reduce((sum, value) => sum + value, 0);
    if (financialAssets > DEDUCTION_AMOUNTS.financialAsset.threshold) {
      const financialDeduction = Math.min(
        financialAssets * DEDUCTION_AMOUNTS.financialAsset.rate,
        DEDUCTION_AMOUNTS.financialAsset.maximum
      );
      otherDeductions += financialDeduction;
    }
  }
  
  // 6. 기타 공제들
  if (deductions.businessSuccession) {
    // 가업상속공제 (실제로는 복잡한 계산 필요)
    otherDeductions += 100000000; // 임시값
  }
  
  if (deductions.farmingSuccession) {
    // 영농상속공제 (실제로는 복잡한 계산 필요)
    otherDeductions += 100000000; // 임시값
  }
  
  if (deductions.cohabitingHouse) {
    // 동거주택상속공제
    otherDeductions += DEDUCTION_AMOUNTS.cohabitation;
  }
  
  if (deductions.disasterLoss && deductions.disasterLossAmount) {
    // 재해손실공제
    otherDeductions += deductions.disasterLossAmount;
  }
  
  // 7. 총 공제액 계산
  const totalDeductions = lumpSumVsPersonal + spouseDeduction + otherDeductions;
  
  // 공제액은 과세가액을 초과할 수 없음
  return Math.min(totalDeductions, taxableInheritance);
}

/**
 * 세액공제 계산
 */
function calculateTaxCredits(taxCredits: InheritanceData['taxCredits'], calculatedTax: number): number {
  let totalCredits = 0;
  
  if (taxCredits.giftTaxCredit) {
    // 증여세액공제 (사전증여재산에 대해 납부한 증여세액)
    // 실제로는 복잡한 계산이 필요하지만 여기서는 간단히 처리
    totalCredits += 10000000; // 임시값
  }
  
  if (taxCredits.foreignTaxCredit && taxCredits.foreignTaxCreditAmount) {
    // 외국납부세액공제
    totalCredits += taxCredits.foreignTaxCreditAmount;
  }
  
  if (taxCredits.shortTermReinheritanceCredit && taxCredits.shortTermReinheritanceCreditAmount) {
    // 단기재상속세액공제
    totalCredits += taxCredits.shortTermReinheritanceCreditAmount;
  }
  
  // 세액공제는 산출세액을 초과할 수 없음
  return Math.min(totalCredits, calculatedTax);
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