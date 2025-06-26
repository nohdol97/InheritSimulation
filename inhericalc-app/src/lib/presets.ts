import { PresetExample } from '@/types';

export const presetExamples: PresetExample[] = [
  {
    name: "일반적인 중산층 가정",
    description: "총 재산 4.5억원, 총 채무 1.5억원의 일반적인 중산층 사례",
    data: {
      deathDate: "2024-06-21",
      heirsCount: 2,
      hasSpouse: true,
      childrenCount: 1,
      minorChildrenCount: 0,
      elderlyCount: 0,
      disabledCount: 0,
      minorDetails: [],
      disabledDetails: [],      assets: {
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
          crypto: 0,
          insuranceProceeds: 0,
          severancePay: 0
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
          other: 0
        },
        nonTaxableAssets: {
          stateDonation: 0,
          culturalProperty: 0,
          religiousProperty: 0,
          publicInterestDonation: 0,
          otherNonTaxable: 0
        },
        giftsAdded: {
          realEstate: [],
          other: []
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
          publicUtilities: 0,
          other: 0
        }
      },
      deductions: {
        spouse: true,
        disabled: false,
        minor: false,
        basic: true,
        elderly: false,
        financialAsset: false,
        businessSuccession: false,
        farmingSuccession: false,
        cohabitingHouse: false,
        disasterLoss: false,
        disasterLossAmount: 0
      },
      taxCredits: {
        generationSkipSurcharge: false,
        generationSkipSurchargeAmount: 0,
        giftTaxCredit: false,
        foreignTaxCredit: false,
        foreignTaxCreditAmount: 0,
        shortTermReinheritanceCredit: false,
        shortTermReinheritanceCreditAmount: 0
      }
    }
  },
  {
    name: "고액 자산가 사례",
    description: "총 재산 20억원, 총 채무 1억원의 고액 자산가 사례",
    data: {
      deathDate: "2024-06-21",
      heirsCount: 3,
      hasSpouse: true,
      childrenCount: 2,
      minorChildrenCount: 1,
      elderlyCount: 0,
      disabledCount: 0,
      minorDetails: [],
      disabledDetails: [],      assets: {
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
          crypto: 0,
          insuranceProceeds: 0,
          severancePay: 0
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
          other: 0
        },
        nonTaxableAssets: {
          stateDonation: 0,
          culturalProperty: 0,
          religiousProperty: 0,
          publicInterestDonation: 0,
          otherNonTaxable: 0
        },
        giftsAdded: {
          realEstate: [],
          other: []
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
          publicUtilities: 0,
          other: 0
        }
      },
      deductions: {
        spouse: true,
        disabled: false,
        minor: true,
        basic: true,
        elderly: false,
        financialAsset: false,
        businessSuccession: false,
        farmingSuccession: false,
        cohabitingHouse: false,
        disasterLoss: false,
        disasterLossAmount: 0
      },
      taxCredits: {
        generationSkipSurcharge: false,
        generationSkipSurchargeAmount: 0,
        giftTaxCredit: false,
        foreignTaxCredit: false,
        foreignTaxCreditAmount: 0,
        shortTermReinheritanceCredit: false,
        shortTermReinheritanceCreditAmount: 0
      }
    }
  },
  {
    name: "소액 자산 사례",
    description: "총 재산 1.5억원, 총 채무 3천만원의 소액 자산 사례",
    data: {
      deathDate: "2024-06-21",
      heirsCount: 1,
      hasSpouse: false,
      childrenCount: 0,
      minorChildrenCount: 0,
      elderlyCount: 0,
      disabledCount: 0,
      minorDetails: [],
      disabledDetails: [],      assets: {
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
          crypto: 0,
          insuranceProceeds: 0,
          severancePay: 0
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
          other: 0
        },
        nonTaxableAssets: {
          stateDonation: 0,
          culturalProperty: 0,
          religiousProperty: 0,
          publicInterestDonation: 0,
          otherNonTaxable: 0
        },
        giftsAdded: {
          realEstate: [],
          other: []
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
          publicUtilities: 0,
          other: 0
        }
      },
      deductions: {
        spouse: false,
        disabled: false,
        minor: false,
        basic: true,
        elderly: false,
        financialAsset: false,
        businessSuccession: false,
        farmingSuccession: false,
        cohabitingHouse: false,
        disasterLoss: false,
        disasterLossAmount: 0
      },
      taxCredits: {
        generationSkipSurcharge: false,
        generationSkipSurchargeAmount: 0,
        giftTaxCredit: false,
        foreignTaxCredit: false,
        foreignTaxCreditAmount: 0,
        shortTermReinheritanceCredit: false,
        shortTermReinheritanceCreditAmount: 0
      }
    }
  }
]; 