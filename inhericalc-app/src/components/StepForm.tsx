'use client';

import { useState } from 'react';
import { InheritanceData } from '@/types';
import { User } from '@supabase/supabase-js';
import ExpertConsultModal from './ExpertConsultModal';

interface StepFormProps {
  onSubmit: (data: InheritanceData) => void;
  loading?: boolean;
  onFormDataChange?: (data: InheritanceData) => void;
  user?: User | null;
  onShowAuthModal?: () => void;
}

const STEPS = [
  { id: 1, title: '기본 정보 및 총상속재산가액', description: '피상속인 정보, 상속인 정보, 모든 상속재산' },
  { id: 2, title: '비과세 및 과세가액 불산입 재산', description: '총상속재산가액에서 차감되는 재산' },
  { id: 3, title: '채무 및 공과금, 장례비용', description: '상속세 과세가액에서 공제되는 항목' },
  { id: 4, title: '사전증여재산', description: '상속세 과세가액에 가산되는 재산' },
  { id: 5, title: '상속공제', description: '다양한 상속공제 항목 선택' },
  { id: 6, title: '세액공제', description: '산출세액에서 공제되는 항목 선택' },
  { id: 7, title: '최종 결과', description: '계산된 상속세액 및 상세 내역' }
];

export default function StepForm({ onSubmit, loading = false, onFormDataChange, user, onShowAuthModal }: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [formData, setFormData] = useState<InheritanceData>({
    deathDate: new Date().toISOString().split('T')[0],
    deceasedName: '피상속인',
    heirsCount: 1,
    hasSpouse: false,
    childrenCount: 0,
    minorChildrenCount: 0,
    elderlyCount: 0,
    disabledCount: 0,
    assets: {
      realEstate: {
        residential: 0,
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
        severancePay: 0,
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
        other: 0,
      },
      nonTaxableAssets: {
        stateDonation: 0,
        culturalProperty: 0,
        religiousProperty: 0,
        publicInterestDonation: 0,
        otherNonTaxable: 0,
      },
      giftsAdded: {
        realEstate: [],
        other: [],
      },
    },
    debts: {
      funeral: {
        ceremony: 0,
        burial: 0,
        memorial: 0,
        other: 0
      },
      financial: {
        mortgage: 0,
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
      basic: true,
      spouse: false,
      disabled: false,
      minor: false,
      elderly: false,
      financialAsset: false,
      businessSuccession: false,
      farmingSuccession: false,
      cohabitingHouse: false,
      disasterLoss: false,
      disasterLossAmount: 0,
    },
    taxCredits: {
      generationSkipSurcharge: false,
      generationSkipSurchargeAmount: 0,
      giftTaxCredit: false,
      foreignTaxCredit: false,
      foreignTaxCreditAmount: 0,
      shortTermReinheritanceCredit: false,
      shortTermReinheritanceCreditAmount: 0,
    },
  });

  const updateFormData = (newData: Partial<InheritanceData>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    onFormDataChange?.(updatedData);
  };

  const handleRealEstateChange = (field: keyof InheritanceData['assets']['realEstate'], value: number) => {
    updateFormData({
      assets: {
        ...formData.assets,
        realEstate: {
          ...formData.assets.realEstate,
          [field]: value
        }
      }
    });
  };

  // const handleFinancialChange = (field: keyof InheritanceData['assets']['financial'], value: number) => {
  //   updateFormData({
  //     assets: {
  //       ...formData.assets,
  //       financial: {
  //         ...formData.assets.financial,
  //         [field]: value
  //       }
  //     }
  //   });
  // };

  // const handleOtherAssetsChange = (type: 'insurance' | 'business' | 'movables' | 'other', field: string, value: number) => {
  //   updateFormData({
  //     assets: {
  //       ...formData.assets,
  //       [type]: {
  //         ...formData.assets[type],
  //         [field]: value
  //       }
  //     }
  //   });
  // };

  const handleGiftAddedChange = (type: 'realEstate' | 'other', index: number, field: string, value: string | number) => {
    const updatedGifts = [...formData.assets.giftsAdded[type]];
    updatedGifts[index] = {
      ...updatedGifts[index],
      [field]: value
    };
    
    updateFormData({
      assets: {
        ...formData.assets,
        giftsAdded: {
          ...formData.assets.giftsAdded,
          [type]: updatedGifts
        }
      }
    });
  };

  // const addGift = (type: 'realEstate' | 'other') => {
  //   const newGift = {
  //     value: 0,
  //     giftTaxPaid: 0,
  //     giftDate: '',
  //     isHeir: false
  //   };
    
  //   updateFormData({
  //     assets: {
  //       ...formData.assets,
  //       giftsAdded: {
  //         ...formData.assets.giftsAdded,
  //         [type]: [...formData.assets.giftsAdded[type], newGift]
  //       }
  //     }
  //   });
  // };

  // const removeGift = (type: 'realEstate' | 'other', index: number) => {
  //   const updatedGifts = formData.assets.giftsAdded[type].filter((_, i) => i !== index);
    
  //   updateFormData({
  //     assets: {
  //       ...formData.assets,
  //       giftsAdded: {
  //         ...formData.assets.giftsAdded,
  //         [type]: updatedGifts
  //       }
  //     }
  //   });
  // };

  const handleDebtChange = (type: 'funeral' | 'financial' | 'taxes' | 'other', field: string, value: number) => {
    updateFormData({
      debts: {
        ...formData.debts,
        [type]: {
          ...formData.debts[type],
          [field]: value
        }
      }
    });
  };

  const handleDeductionChange = (field: keyof InheritanceData['deductions'], value: boolean | number) => {
    updateFormData({
      deductions: {
        ...formData.deductions,
        [field]: value
      }
    });
  };

  const handleTaxCreditChange = (field: keyof InheritanceData['taxCredits'], value: boolean | number) => {
    updateFormData({
      taxCredits: {
        ...formData.taxCredits,
        [field]: value
      }
    });
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    return true; // 모든 단계에서 진행 가능 (선택사항이므로)
  };

  const handleFinalSubmit = () => {
    onSubmit(formData);
  };

  const formatNumber = (value: string) => {
    return value.replace(/[^\d]/g, '');
  };

  const formatDisplayValue = (value: number) => {
    return value === 0 ? '' : value.toLocaleString();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // 기본 정보 및 총상속재산가액
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">기본 정보 및 총상속재산가액</h3>
              <p className="text-gray-600">피상속인 정보, 상속인 정보, 모든 상속재산을 입력해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  피상속인 이름
                </label>
                <input
                  type="text"
                  value={formData.deceasedName}
                  onChange={(e) => updateFormData({ deceasedName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="피상속인 이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상속인 수
                </label>
                <input
                  type="text"
                  value={formData.heirsCount}
                  onChange={(e) => updateFormData({ heirsCount: parseInt(formatNumber(e.target.value)) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="상속인 수"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배우자 여부
                </label>
                <input
                  type="checkbox"
                  checked={formData.hasSpouse}
                  onChange={(e) => updateFormData({ hasSpouse: e.target.checked })}
                  className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자녀 수
                </label>
                <input
                  type="text"
                  value={formData.childrenCount}
                  onChange={(e) => updateFormData({ childrenCount: parseInt(formatNumber(e.target.value)) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="자녀 수"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소년 자녀 수
                </label>
                <input
                  type="text"
                  value={formData.minorChildrenCount}
                  onChange={(e) => updateFormData({ minorChildrenCount: parseInt(formatNumber(e.target.value)) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="소년 자녀 수"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  노인 자녀 수
                </label>
                <input
                  type="text"
                  value={formData.elderlyCount}
                  onChange={(e) => updateFormData({ elderlyCount: parseInt(formatNumber(e.target.value)) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="노인 자녀 수"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  장애인 자녀 수
                </label>
                <input
                  type="text"
                  value={formData.disabledCount}
                  onChange={(e) => updateFormData({ disabledCount: parseInt(formatNumber(e.target.value)) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="장애인 자녀 수"
                />
              </div>
            </div>
          </div>
        );

      case 2: // 비과세 및 과세가액 불산입 재산
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">비과세 및 과세가액 불산입 재산</h3>
              <p className="text-gray-600">총상속재산가액에서 차감되는 재산을 입력해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주거용 부동산 (원)
                  <span className="text-xs text-gray-500 block">아파트, 주택, 오피스텔 등</span>
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.realEstate.residential)}
                  onChange={(e) => handleRealEstateChange('residential', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 800,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상업용 부동산 (원)
                  <span className="text-xs text-gray-500 block">상가, 사무실, 임대용 건물 등</span>
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.realEstate.commercial)}
                  onChange={(e) => handleRealEstateChange('commercial', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 500,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  토지 (원)
                  <span className="text-xs text-gray-500 block">대지, 전답, 임야, 잡종지 등</span>
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.realEstate.land)}
                  onChange={(e) => handleRealEstateChange('land', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 300,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 부동산 (원)
                  <span className="text-xs text-gray-500 block">펜션, 창고, 공장 등</span>
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.realEstate.other)}
                  onChange={(e) => handleRealEstateChange('other', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 100,000,000"
                />
              </div>
            </div>
          </div>
        );

      case 3: // 채무 및 공과금, 장례비용
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">채무 및 공과금, 장례비용</h3>
              <p className="text-gray-600">상속세 과세가액에서 공제되는 항목을 입력해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주택담보대출 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.debts.financial.mortgage)}
                  onChange={(e) => handleDebtChange('financial', 'mortgage', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 200,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신용대출 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.debts.financial.credit_loan)}
                  onChange={(e) => handleDebtChange('financial', 'credit_loan', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 30,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카드대금 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.debts.financial.card_debt)}
                  onChange={(e) => handleDebtChange('financial', 'card_debt', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 5,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  장례비 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.debts.funeral.ceremony)}
                  onChange={(e) => handleDebtChange('funeral', 'ceremony', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 10,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소득세 미납액 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.debts.taxes.income_tax)}
                  onChange={(e) => handleDebtChange('taxes', 'income_tax', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 3,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 채무 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.debts.other.other)}
                  onChange={(e) => handleDebtChange('other', 'other', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 5,000,000"
                />
              </div>
            </div>
          </div>
        );

      case 4: // 사전증여재산
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">사전증여재산</h3>
              <p className="text-gray-600">상속세 과세가액에 가산되는 재산을 입력해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  증여받은 부동산 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.giftsAdded.realEstate.reduce((total, gift) => total + gift.value, 0))}
                  onChange={(e) => handleGiftAddedChange('realEstate', 0, 'value', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 200,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  증여받은 기타재산 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.giftsAdded.other.reduce((total, gift) => total + gift.value, 0))}
                  onChange={(e) => handleGiftAddedChange('other', 0, 'value', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 50,000,000"
                />
              </div>
            </div>
          </div>
        );

      case 5: // 상속공제
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">상속공제</h3>
              <p className="text-gray-600">다양한 상속공제 항목을 선택해주세요</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deductions.basic}
                    onChange={(e) => handleDeductionChange('basic', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">일괄공제</span>
                    <p className="text-sm text-gray-600">5억원 (기초공제 2억원 + 인적공제 포함)</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deductions.spouse}
                    onChange={(e) => handleDeductionChange('spouse', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">배우자 공제</span>
                    <p className="text-sm text-gray-600">최소 5억원 (실제 상속분 또는 5억원 중 큰 금액, 최대 30억원)</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deductions.disabled}
                    onChange={(e) => handleDeductionChange('disabled', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">장애인 공제</span>
                    <p className="text-sm text-gray-600">1천만원 × 기대여명연수 (장애인 상속인)</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.deductions.minor}
                    onChange={(e) => handleDeductionChange('minor', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">미성년 공제</span>
                    <p className="text-sm text-gray-600">1천만원 × (19세 - 현재나이) (미성년 상속인)</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 일괄공제는 기초공제+인적공제와 비교하여 큰 금액이 자동 적용됩니다. 금융재산공제(금융재산 4천만원 초과 시 20%, 최대 2억원)도 자동 계산됩니다.
              </p>
            </div>
          </div>
        );

      case 6: // 세액공제
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">세액공제</h3>
              <p className="text-gray-600">산출세액에서 공제되는 항목을 선택해주세요</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.taxCredits.generationSkipSurcharge}
                    onChange={(e) => handleTaxCreditChange('generationSkipSurcharge', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">세대전 증세 공제</span>
                    <p className="text-sm text-gray-600">최대 1억원 (세대전 증세 과세 포함)</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.taxCredits.giftTaxCredit}
                    onChange={(e) => handleTaxCreditChange('giftTaxCredit', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">선물세 공제</span>
                    <p className="text-sm text-gray-600">최대 1억원 (선물세 과세 포함)</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.taxCredits.foreignTaxCredit}
                    onChange={(e) => handleTaxCreditChange('foreignTaxCredit', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">외국세 공제</span>
                    <p className="text-sm text-gray-600">최대 1억원 (외국세 과세 포함)</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.taxCredits.shortTermReinheritanceCredit}
                    onChange={(e) => handleTaxCreditChange('shortTermReinheritanceCredit', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">단기재상속 공제</span>
                    <p className="text-sm text-gray-600">최대 1억원 (단기재상속 과세 포함)</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 세대전 증세 공제는 기초공제+인적공제와 비교하여 큰 금액이 자동 적용됩니다. 선물세 공제는 선물세 과세 포함 금액이 자동 적용됩니다. 외국세 공제는 외국세 과세 포함 금액이 자동 적용됩니다. 단기재상속 공제는 단기재상속 과세 포함 금액이 자동 적용됩니다.
              </p>
            </div>
          </div>
        );

      case 7: // 최종 결과
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">최종 결과</h3>
              <p className="text-gray-600">계산된 상속세액 및 상세 내역을 확인해주세요</p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">상속세 계산 요약</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>총상속재산가액:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>비과세 및 과세가액 불산입액:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>공과금, 장례비용, 채무:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>사전증여재산 합계:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>상속세 과세가액:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>상속공제액:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>상속세 과세표준:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>상속세 산출세액:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>세액공제액:</span>
                  <span>{formatDisplayValue(0)} 원</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>최종 납부할 상속세액:</span>
                  <span className="text-blue-600">{formatDisplayValue(0)} 원</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⚠️ 위 금액은 입력하신 정보를 바탕으로 계산된 예상 세액이며, 실제 세액과 차이가 있을 수 있습니다. 
                자세한 내용은 세무 전문가와 상담하시기 바랍니다.
              </p>
            </div>

            {/* 전문가 상담 버튼 */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowExpertModal(true)}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2 mx-auto whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>전문가상담</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 진행률 표시 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">상속세 계산기</h2>
          <div className="text-white text-sm">
            {currentStep} / {STEPS.length}
          </div>
        </div>
        
        {/* 진행률 바 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              {currentStep}/{STEPS.length}
            </span>
            <span className="text-sm text-blue-100">
              {Math.round((currentStep / STEPS.length) * 100)}% 완료
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            ></div>
          </div>
          
          {/* 단계 표시 */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-white text-blue-600' 
                    : 'bg-blue-300 text-blue-600'
                  }
                `}>
                  {step.id}
                </div>
                <span className="text-xs text-blue-100 mt-1 text-center max-w-16">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 폼 내용 */}
      <div className="p-8">
        {renderStepContent()}
        
        {/* 네비게이션 버튼 */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap
              ${currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            이전
          </button>

          {currentStep === STEPS.length ? (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading || !canProceed()}
              className={`
                px-8 py-3 rounded-lg font-medium transition-colors whitespace-nowrap
                ${loading || !canProceed()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }
              `}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  계산 중...
                </div>
              ) : (
                '계산하기'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className={`
                px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap
                ${!canProceed()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }
              `}
            >
              다음
            </button>
          )}
        </div>
      </div>

      {/* 전문가 상담 모달 */}
      <ExpertConsultModal 
        isOpen={showExpertModal} 
        onClose={() => setShowExpertModal(false)} 
        user={user}
        onShowAuthModal={onShowAuthModal}
      />
    </div>
  );
} 