// 상속세 계산 관련 타입 정의

export interface InheritanceData {
  // 기본 정보
  deathDate: string;
  deceasedName: string;
  heirsCount: number;
  
  // 재산 정보 - 더 디테일하게 확장
  assets: {
    // 부동산
    realEstate: {
      residential: number;    // 주거용 부동산
      commercial: number;     // 상업용 부동산
      land: number;          // 토지
      other: number;         // 기타 부동산
    };
    
    // 금융자산
    financial: {
      deposits: number;       // 예금
      savings: number;        // 적금
      bonds: number;          // 채권
      funds: number;          // 펀드
      stocks: number;         // 주식
      crypto: number;         // 암호화폐
    };
    
    // 보험 및 연금
    insurance: {
      life: number;           // 생명보험
      annuity: number;        // 연금보험
      other: number;          // 기타 보험
    };
    
    // 사업 관련
    business: {
      shares: number;         // 사업지분
      equipment: number;      // 사업용 자산
      inventory: number;      // 재고자산
      receivables: number;    // 매출채권
    };
    
    // 동산
    movables: {
      vehicles: number;       // 차량
      jewelry: number;        // 귀금속/보석
      art: number;           // 미술품/골동품
      electronics: number;    // 전자제품
      furniture: number;      // 가구/가전
      other: number;         // 기타 동산
    };
    
    // 기타 재산
    other: {
      intellectual: number;   // 지식재산권
      membership: number;     // 회원권
      deposits_guarantee: number; // 보증금
      loans_receivable: number;   // 대여금
      other: number;         // 기타
    };
  };
  
  // 채무 정보 - 더 디테일하게 확장
  debts: {
    // 장례 관련
    funeral: {
      ceremony: number;       // 장례식 비용
      burial: number;         // 매장/화장 비용
      memorial: number;       // 제사/추모 비용
      other: number;         // 기타 장례비
    };
    
    // 금융 채무
    financial: {
      mortgage: number;       // 주택담보대출
      credit_loan: number;    // 신용대출
      card_debt: number;      // 신용카드 채무
      installment: number;    // 할부금
      other_loans: number;    // 기타 대출
    };
    
    // 세금 및 공과금
    taxes: {
      income_tax: number;     // 소득세
      property_tax: number;   // 재산세
      local_tax: number;      // 지방세
      health_insurance: number; // 건강보험료
      other: number;         // 기타 세금
    };
    
    // 기타 채무
    other: {
      guarantee: number;      // 보증채무
      trade_payable: number;  // 매입채무
      lease: number;         // 임대보증금
      other: number;         // 기타 채무
    };
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
  progressiveDeduction: number;  // 누진공제
  calculatedTax: number;         // 산출세액
  taxPerHeir: number;           // 상속인별 세액
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