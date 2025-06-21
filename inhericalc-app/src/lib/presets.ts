import { PresetExample } from '@/types';

export const presetExamples: PresetExample[] = [
  {
    name: "일반적인 중산층 가정",
    description: "부동산 3억, 예금 1억, 기타 자산 5천만원의 일반적인 중산층 사례",
    data: {
      deathDate: "2024-06-21",
      deceasedName: "김철수",
      heirsCount: 2,
      assets: {
        realEstate: {
          residential: 300000000,
          commercial: 0,
          land: 0,
          other: 0
        },
        financial: {
          deposits: 100000000,
          savings: 0,
          bonds: 0,
          funds: 0,
          stocks: 20000000,
          crypto: 0
        },
        insurance: {
          life: 10000000,
          annuity: 0,
          other: 0
        },
        business: {
          shares: 0,
          equipment: 0,
          inventory: 0,
          receivables: 0
        },
        movables: {
          vehicles: 5000000,
          jewelry: 0,
          art: 0,
          electronics: 0,
          furniture: 0,
          other: 0
        },
        other: {
          intellectual: 0,
          membership: 0,
          deposits_guarantee: 0,
          loans_receivable: 0,
          other: 15000000
        }
      },
      debts: {
        funeral: {
          ceremony: 3000000,
          burial: 2000000,
          memorial: 0,
          other: 0
        },
        financial: {
          mortgage: 10000000,
          credit_loan: 0,
          card_debt: 0,
          installment: 0,
          other_loans: 0
        },
        taxes: {
          income_tax: 0,
          property_tax: 0,
          local_tax: 0,
          health_insurance: 0,
          other: 0
        },
        other: {
          guarantee: 0,
          trade_payable: 0,
          lease: 0,
          other: 0
        }
      },
      deductions: {
        spouse: true,
        disabled: false,
        minor: false,
        basic: true
      }
    }
  },
  {
    name: "고액 자산가 사례",
    description: "부동산 10억, 주식 5억, 기타 자산 3억의 고액 자산가 사례",
    data: {
      deathDate: "2024-06-21",
      deceasedName: "박영희",
      heirsCount: 3,
      assets: {
        realEstate: {
          residential: 700000000,
          commercial: 300000000,
          land: 0,
          other: 0
        },
        financial: {
          deposits: 500000000,
          savings: 0,
          bonds: 0,
          funds: 0,
          stocks: 500000000,
          crypto: 0
        },
        insurance: {
          life: 50000000,
          annuity: 0,
          other: 0
        },
        business: {
          shares: 100000000,
          equipment: 0,
          inventory: 0,
          receivables: 0
        },
        movables: {
          vehicles: 20000000,
          jewelry: 0,
          art: 0,
          electronics: 0,
          furniture: 0,
          other: 0
        },
        other: {
          intellectual: 0,
          membership: 0,
          deposits_guarantee: 0,
          loans_receivable: 0,
          other: 200000000
        }
      },
      debts: {
        funeral: {
          ceremony: 5000000,
          burial: 3000000,
          memorial: 2000000,
          other: 0
        },
        financial: {
          mortgage: 30000000,
          credit_loan: 20000000,
          card_debt: 0,
          installment: 0,
          other_loans: 0
        },
        taxes: {
          income_tax: 10000000,
          property_tax: 5000000,
          local_tax: 3000000,
          health_insurance: 2000000,
          other: 0
        },
        other: {
          guarantee: 0,
          trade_payable: 0,
          lease: 0,
          other: 10000000
        }
      },
      deductions: {
        spouse: true,
        disabled: false,
        minor: true,
        basic: true
      }
    }
  },
  {
    name: "소액 자산 사례",
    description: "부동산 1억, 예금 3천만원의 소액 자산 사례",
    data: {
      deathDate: "2024-06-21",
      deceasedName: "이민수",
      heirsCount: 1,
      assets: {
        realEstate: {
          residential: 100000000,
          commercial: 0,
          land: 0,
          other: 0
        },
        financial: {
          deposits: 30000000,
          savings: 0,
          bonds: 0,
          funds: 0,
          stocks: 5000000,
          crypto: 0
        },
        insurance: {
          life: 5000000,
          annuity: 0,
          other: 0
        },
        business: {
          shares: 0,
          equipment: 0,
          inventory: 0,
          receivables: 0
        },
        movables: {
          vehicles: 3000000,
          jewelry: 0,
          art: 0,
          electronics: 0,
          furniture: 0,
          other: 0
        },
        other: {
          intellectual: 0,
          membership: 0,
          deposits_guarantee: 0,
          loans_receivable: 0,
          other: 2000000
        }
      },
      debts: {
        funeral: {
          ceremony: 2000000,
          burial: 1000000,
          memorial: 0,
          other: 0
        },
        financial: {
          mortgage: 5000000,
          credit_loan: 0,
          card_debt: 0,
          installment: 0,
          other_loans: 0
        },
        taxes: {
          income_tax: 0,
          property_tax: 0,
          local_tax: 0,
          health_insurance: 0,
          other: 0
        },
        other: {
          guarantee: 0,
          trade_payable: 0,
          lease: 0,
          other: 0
        }
      },
      deductions: {
        spouse: false,
        disabled: false,
        minor: false,
        basic: true
      }
    }
  }
];

export const defaultInheritanceData = presetExamples[0].data;