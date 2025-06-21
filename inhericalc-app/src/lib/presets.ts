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
        realEstate: 300000000,    // 3억
        deposits: 100000000,      // 1억
        stocks: 20000000,         // 2천만원
        insurance: 10000000,      // 1천만원
        business: 0,
        vehicles: 5000000,        // 5백만원
        other: 15000000           // 1천5백만원
      },
      debts: {
        funeral: 5000000,         // 5백만원
        financial: 10000000,      // 1천만원
        taxes: 0,
        other: 0
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
        realEstate: 1000000000,   // 10억
        deposits: 500000000,      // 5억
        stocks: 500000000,        // 5억
        insurance: 50000000,      // 5천만원
        business: 100000000,      // 1억
        vehicles: 20000000,       // 2천만원
        other: 200000000          // 2억
      },
      debts: {
        funeral: 10000000,        // 1천만원
        financial: 50000000,      // 5천만원
        taxes: 20000000,          // 2천만원
        other: 10000000           // 1천만원
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
        realEstate: 100000000,    // 1억
        deposits: 30000000,       // 3천만원
        stocks: 5000000,          // 5백만원
        insurance: 5000000,       // 5백만원
        business: 0,
        vehicles: 3000000,        // 3백만원
        other: 2000000            // 2백만원
      },
      debts: {
        funeral: 3000000,         // 3백만원
        financial: 5000000,       // 5백만원
        taxes: 0,
        other: 0
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