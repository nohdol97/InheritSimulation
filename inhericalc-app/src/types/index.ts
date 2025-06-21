// 상속세 계산 관련 타입 정의

export interface InheritanceData {
  // 기본 정보
  deathDate: string;
  deceasedName: string;
  heirsCount: number;
  
  // 재산 정보
  assets: {
    realEstate: number;    // 부동산
    deposits: number;      // 예금
    stocks: number;        // 주식
    insurance: number;     // 보험금
    business: number;      // 사업체
    vehicles: number;      // 차량
    other: number;         // 기타
  };
  
  // 채무 정보
  debts: {
    funeral: number;       // 장례비
    financial: number;     // 금융채무
    taxes: number;         // 세금 미납
    other: number;         // 기타 채무
  };
  
  // 공제 정보
  deductions: {
    spouse: boolean;       // 배우자 공제
    disabled: boolean;     // 장애인 공제
    minor: boolean;        // 미성년 공제
    basic: boolean;        // 일괄 공제
  };
}

export interface TaxCalculationResult {
  totalAssets: number;           // 총 재산가액
  totalDebts: number;            // 총 채무
  netAssets: number;             // 순 재산가액
  totalDeductions: number;       // 총 공제액
  taxableAmount: number;         // 과세표준
  taxRate: number;               // 세율
  calculatedTax: number;         // 산출세액
  finalTax: number;              // 최종 상속세
  breakdown: {
    assets: number;
    debts: number;
    deductions: number;
    taxRate: number;
  };
}

export interface PresetExample {
  name: string;
  description: string;
  data: InheritanceData;
} 