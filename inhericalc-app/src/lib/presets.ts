import { PresetExample } from '@/types';

export const presetExamples: PresetExample[] = [
  {
    name: "일반적인 중산층 가정",
    description: "총 재산 4.5억원, 총 채무 1.5억원의 일반적인 중산층 사례",
    data: {
      deathDate: "2024-06-21",
      deceasedName: "김철수",
      heirsCount: 2,
      assets: {
        realEstate: {
          residential: 450000000,
          commercial: 0,
          land: 0,
          other: 0
        },
        financial: {
          deposits: 0,
          savings: 0,
          bonds: 0,
          funds: 0,
          stocks: 0,
          crypto: 0
        },
        insurance: {
          life: 0,
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
          vehicles: 0,
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
          gifts_real_estate: 0,
          gifts_other: 0,
          other: 0
        }
      },
      debts: {
        funeral: {
          ceremony: 0,
          burial: 0,
          memorial: 0,
          other: 0
        },
        financial: {
          mortgage: 150000000,
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
    description: "총 재산 20억원, 총 채무 1억원의 고액 자산가 사례",
    data: {
      deathDate: "2024-06-21",
      deceasedName: "박영희",
      heirsCount: 3,
      assets: {
        realEstate: {
          residential: 2000000000,
          commercial: 0,
          land: 0,
          other: 0
        },
        financial: {
          deposits: 0,
          savings: 0,
          bonds: 0,
          funds: 0,
          stocks: 0,
          crypto: 0
        },
        insurance: {
          life: 0,
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
          vehicles: 0,
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
          gifts_real_estate: 0,
          gifts_other: 0,
          other: 0
        }
      },
      debts: {
        funeral: {
          ceremony: 0,
          burial: 0,
          memorial: 0,
          other: 0
        },
        financial: {
          mortgage: 100000000,
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
        minor: true,
        basic: true
      }
    }
  },
  {
    name: "소액 자산 사례",
    description: "총 재산 1.5억원, 총 채무 3천만원의 소액 자산 사례",
    data: {
      deathDate: "2024-06-21",
      deceasedName: "이민수",
      heirsCount: 1,
      assets: {
        realEstate: {
          residential: 150000000,
          commercial: 0,
          land: 0,
          other: 0
        },
        financial: {
          deposits: 0,
          savings: 0,
          bonds: 0,
          funds: 0,
          stocks: 0,
          crypto: 0
        },
        insurance: {
          life: 0,
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
          vehicles: 0,
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
          gifts_real_estate: 0,
          gifts_other: 0,
          other: 0
        }
      },
      debts: {
        funeral: {
          ceremony: 0,
          burial: 0,
          memorial: 0,
          other: 0
        },
        financial: {
          mortgage: 30000000,
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