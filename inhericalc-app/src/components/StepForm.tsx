'use client';

import { useState } from 'react';
import { InheritanceData } from '@/types';
import { User } from '@supabase/supabase-js';
import ExpertConsultModal from './ExpertConsultModal';
import TooltipLabel from './TooltipLabel';
import ProgressIndicator from './ProgressIndicator';

interface StepFormProps {
  onSubmit: (data: InheritanceData) => void;
  loading?: boolean;
  onFormDataChange?: (data: InheritanceData) => void;
  user?: User | null;
  onShowAuthModal?: () => void;
}

const STEPS = [
  { id: 1, title: '기본정보', shortTitle: '기본', description: '피상속인 정보, 상속인 정보' },
  { id: 2, title: '총재산가액', shortTitle: '재산', description: '모든 상속재산' },
  { id: 3, title: '채무공제', shortTitle: '채무', description: '차감되는 채무 및 비용' },
  { id: 4, title: '사전증여', shortTitle: '증여', description: '가산되는 증여재산' },
  { id: 5, title: '상속공제', shortTitle: '공제', description: '상속공제 항목' },
  { id: 6, title: '세액공제', shortTitle: '세액', description: '세액공제 항목' }
];

export default function StepForm({ onSubmit, loading = false, onFormDataChange, user, onShowAuthModal }: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [formData, setFormData] = useState<InheritanceData>({
    deathDate: new Date().toISOString().split('T')[0],
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

  const handleSubmit = () => {
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
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">기본 정보</h3>
              <p className="text-sm text-gray-600">상속인 정보를 입력해주세요</p>
            </div>
            
            {/* 상속인 정보 카드 */}
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                상속인 정보
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <TooltipLabel
                      label="상속인 수"
                      hint="돌아가신 분의 배우자와 자녀, 상속 받을 사람의 총 숫자예요."
                    />
                    <input
                      type="text"
                      value={formData.heirsCount}
                      onChange={(e) => updateFormData({ heirsCount: parseInt(formatNumber(e.target.value)) || 0 })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="명"
                    />
                  </div>
                  <div>
                    <TooltipLabel
                      label="자녀 수"
                      hint="돌아가신 분의 자녀 숫자예요. 어른이든 아이든 모두 포함해요."
                    />
                    <input
                      type="text"
                      value={formData.childrenCount}
                      onChange={(e) => updateFormData({ childrenCount: parseInt(formatNumber(e.target.value)) || 0 })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="명"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <TooltipLabel
                      label="미성년자"
                      hint="자녀 중에서 19세가 안 된 아이의 숫자를 적어주세요."
                    />
                    <input
                      type="text"
                      value={formData.minorChildrenCount}
                      onChange={(e) => updateFormData({ minorChildrenCount: parseInt(formatNumber(e.target.value)) || 0 })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="명"
                    />
                  </div>
                  <div>
                    <TooltipLabel
                      label="65세 이상"
                      hint="자녀 중에서 65세 이상인 분의 숫자를 적어주세요."
                    />
                    <input
                      type="text"
                      value={formData.elderlyCount}
                      onChange={(e) => updateFormData({ elderlyCount: parseInt(formatNumber(e.target.value)) || 0 })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="명"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <TooltipLabel
                      label="장애인"
                      hint="자녀나 상속인 중 장애가 있는 분의 숫자를 써주세요."
                    />
                    <input
                      type="text"
                      value={formData.disabledCount}
                      onChange={(e) => updateFormData({ disabledCount: parseInt(formatNumber(e.target.value)) || 0 })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="명"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hasSpouse}
                        onChange={(e) => updateFormData({ hasSpouse: e.target.checked })}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">배우자 있음</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // 비과세 및 과세가액 불산입 재산
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">총상속재산</h3>
              <p className="text-sm text-gray-600">모든 상속재산을 입력해주세요</p>
            </div>
            
            {/* 부동산 카드 */}
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                부동산
              </h4>
              <div className="space-y-3">
                <div>
                  <TooltipLabel
                    label="주거용 부동산"
                    hint="사람이 살기 위해 쓰는 집이에요. 아파트, 단독주택, 오피스텔 등이 여기에 들어가요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.assets.realEstate.residential)}
                      onChange={(e) => handleRealEstateChange('residential', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
                
                <div>
                  <TooltipLabel
                    label="상업용 부동산"
                    hint="돈을 벌기 위한 건물이에요. 상가, 사무실, 임대용 건물 등이 포함돼요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.assets.realEstate.commercial)}
                      onChange={(e) => handleRealEstateChange('commercial', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
                
                <div>
                  <TooltipLabel
                    label="토지"
                    hint="건물이 없는 땅이에요. 대지, 전답, 임야, 잡종지가 포함돼요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.assets.realEstate.land)}
                      onChange={(e) => handleRealEstateChange('land', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
                
                <div>
                  <TooltipLabel
                    label="기타 부동산"
                    hint="펜션, 창고, 공장처럼 집도 아니고 상가도 아닌 부동산이에요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.assets.realEstate.other)}
                      onChange={(e) => handleRealEstateChange('other', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 입력이 복잡하다면 주요 재산만 입력하고 나중에 전문가와 상담받으실 수 있습니다.
              </p>
            </div>
          </div>
        );

      case 3: // 채무 및 공과금, 장례비용
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">채무 및 비용</h3>
              <p className="text-sm text-gray-600">차감할 채무와 비용을 입력해주세요</p>
            </div>
            
            {/* 대출 및 채무 카드 */}
            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                대출 및 채무
              </h4>
              <div className="space-y-3">
                <div>
                  <TooltipLabel
                    label="주택담보대출"
                    hint="집을 담보로 빌린 돈이에요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.debts.financial.mortgage)}
                      onChange={(e) => handleDebtChange('financial', 'mortgage', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
                
                <div>
                  <TooltipLabel
                    label="신용대출"
                    hint="은행이나 금융사에서 빌린 돈이에요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.debts.financial.credit_loan)}
                      onChange={(e) => handleDebtChange('financial', 'credit_loan', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
                
                <div>
                  <TooltipLabel
                    label="카드대금 및 기타 채무"
                    hint="돌아가신 분이 쓴 카드값이에요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.debts.financial.card_debt)}
                      onChange={(e) => handleDebtChange('financial', 'card_debt', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 장례비 및 세금 카드 */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                장례비 및 세금
              </h4>
              <div className="space-y-3">
                <div>
                  <TooltipLabel
                    label="장례비용"
                    hint="장례식을 치르면서 쓴 돈이에요. 최대 500만원까지만 공제돼요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.debts.funeral.ceremony)}
                      onChange={(e) => handleDebtChange('funeral', 'ceremony', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
                
                <div>
                  <TooltipLabel
                    label="미납 소득세"
                    hint="돌아가신 분이 내야 했던 소득세예요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.debts.taxes.income_tax)}
                      onChange={(e) => handleDebtChange('taxes', 'income_tax', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // 사전증여재산
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">사전증여재산</h3>
              <p className="text-sm text-gray-600">10년 내 증여받은 재산을 입력해주세요</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                증여재산
              </h4>
              <div className="space-y-3">
                <div>
                  <TooltipLabel
                    label="증여받은 부동산"
                    hint="살아계실 때 미리 물려준 집, 땅, 건물이에요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.assets.giftsAdded.realEstate.reduce((total, gift) => total + gift.value, 0))}
                      onChange={(e) => handleGiftAddedChange('realEstate', 0, 'value', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
                
                <div>
                  <TooltipLabel
                    label="증여받은 기타재산"
                    hint="현금, 주식 같은 다른 재산을 미리 준 것들이에요."
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={formatDisplayValue(formData.assets.giftsAdded.other.reduce((total, gift) => total + gift.value, 0))}
                      onChange={(e) => handleGiftAddedChange('other', 0, 'value', parseInt(formatNumber(e.target.value)) || 0)}
                      className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">원</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 상속개시 전 10년 내(직계비속은 5년 내) 증여받은 재산이 포함됩니다.
              </p>
            </div>
          </div>
        );

      case 5: // 상속공제
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">상속공제</h3>
              <p className="text-sm text-gray-600">해당되는 공제 항목을 선택해주세요 (2025년 기준)</p>
            </div>
            
            {/* 기초공제 안내 */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">기초공제 (자동 적용)</span>
                <span className="text-sm font-bold text-gray-600">5천만원 × 상속인 수</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">모든 상속에 기본으로 적용되는 공제입니다</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.deductions.basic}
                    onChange={(e) => handleDeductionChange('basic', e.target.checked)}
                    className="mr-3 mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">일괄공제</span>
                      <span className="text-sm font-bold text-green-600">2억원</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">2억원과 기초공제 중 큰 금액 적용 (배우자공제와 중복 ❌)</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.deductions.spouse}
                    onChange={(e) => handleDeductionChange('spouse', e.target.checked)}
                    className="mr-3 mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">배우자공제</span>
                      <span className="text-sm font-bold text-blue-600">최소 5억원 보장</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">배우자 상속분에 대해 최소 5억원 보장 (일괄공제와 중복 ❌)</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.deductions.minor}
                    onChange={(e) => handleDeductionChange('minor', e.target.checked)}
                    className="mr-3 mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">미성년자공제</span>
                      <span className="text-sm font-bold text-purple-600">1천만원 × (19세 - 나이)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">미성년 상속인 1명당 (19세 - 현재나이) × 1천만원</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.deductions.disabled}
                    onChange={(e) => handleDeductionChange('disabled', e.target.checked)}
                    className="mr-3 mt-1 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">장애인공제</span>
                      <span className="text-sm font-bold text-orange-600">1천만원 × 기대여명</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">장애인 상속인 1명당 기대여명연수 × 1천만원</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.deductions.elderly}
                    onChange={(e) => handleDeductionChange('elderly', e.target.checked)}
                    className="mr-3 mt-1 h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">연로자공제</span>
                      <span className="text-sm font-bold text-yellow-600">5천만원</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">65세 이상 상속인 1명당 5천만원</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.deductions.financialAsset}
                    onChange={(e) => handleDeductionChange('financialAsset', e.target.checked)}
                    className="mr-3 mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">금융재산공제</span>
                      <span className="text-sm font-bold text-indigo-600">금융재산의 20%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">예금, 적금, 주식 등 금융재산의 20% 공제</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-teal-50 rounded-lg p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.deductions.cohabitingHouse}
                    onChange={(e) => handleDeductionChange('cohabitingHouse', e.target.checked)}
                    className="mr-3 mt-1 h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">동거주택공제</span>
                      <span className="text-sm font-bold text-teal-600">최대 6억원</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">10년 이상 동거한 직계비속이 상속받는 주택</p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* 2025년 법령 안내 */}
            <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                2025년 상속세 법령 기준
              </h4>
              <p className="text-sm text-gray-700 mb-2">
                • 기초공제: 5천만원 × 상속인 수
              </p>
              <p className="text-sm text-gray-700 mb-2">
                • 일괄공제: 2억원 (기존 5억원에서 변경)
              </p>
              <p className="text-sm text-gray-700 mb-2">
                • 배우자공제: 최소 5억원 보장 (일괄공제와 중복 적용 불가)
              </p>
              <p className="text-sm text-blue-700 font-medium">
                ➜ 배우자가 있으면 배우자공제 선택이 일반적으로 유리합니다.
              </p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 2025년 법령 개정으로 일괄공제가 2억원으로 축소되었습니다.
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
                    <span className="font-medium text-gray-900">세대생략 가산세</span>
                    <p className="text-sm text-gray-600">세대를 생략한 증여·상속에 대한 가산세 공제</p>
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
                    <span className="font-medium text-gray-900">증여세액공제</span>
                    <p className="text-sm text-gray-600">사전증여재산에 대해 기납부한 증여세액 공제</p>
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
                    <span className="font-medium text-gray-900">외국납부세액공제</span>
                    <p className="text-sm text-gray-600">외국에서 납부한 상속세액 공제</p>
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
                    <span className="font-medium text-gray-900">단기재상속공제</span>
                    <p className="text-sm text-gray-600">10년 내 재상속 발생 시 이전 상속세액 공제</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 세액공제는 산출세액에서 차감되는 항목입니다. 해당되는 항목이 있을 때만 선택하세요.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 2025년 법령 변경사항 알림 배너 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg border border-blue-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">🎯 2025년 상속세 법령 기준 적용</h3>
            <div className="text-sm space-y-1 mb-3">
              <p><strong>주요 변경사항:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>일괄공제:</strong> 5억원 → 2억원으로 감소</li>
                <li><strong>배우자공제:</strong> 최대 30억원 → 최소 5억원 보장</li>
                <li><strong>기초공제:</strong> 고정 2억원 → 5천만원 × 상속인 수</li>
                <li><strong>금융재산공제:</strong> 기준금액 제한 없이 20% 적용</li>
              </ul>
            </div>
            <div className="text-xs bg-white bg-opacity-10 p-2 rounded">
              <strong>💡 참고:</strong> 본 계산기는 2025년 개정된 상속세법을 기준으로 합니다. 정확한 세액은 세무 전문가와 상담하시기 바랍니다.
            </div>
          </div>
        </div>
      </div>

      <ProgressIndicator currentStep={currentStep} totalSteps={STEPS.length} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}
        
        {/* 네비게이션 버튼 */}
        <div className="space-y-3 mt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`
                flex-1 py-3 rounded-lg font-medium transition-colors text-sm
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
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className={`
                  flex-1 py-3 rounded-lg font-medium transition-colors text-sm
                  ${loading || !canProceed()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    계산중...
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
                  flex-1 py-3 rounded-lg font-medium transition-colors text-sm
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

          {/* 마지막 단계에만 전문가 상담 버튼 표시 */}
          {currentStep === STEPS.length && (
            <button
              type="button"
              onClick={() => setShowExpertModal(true)}
              className="w-full py-3 rounded-lg font-medium transition-colors text-sm bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              전문가 상담받기
            </button>
          )}
        </div>
      </form>

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