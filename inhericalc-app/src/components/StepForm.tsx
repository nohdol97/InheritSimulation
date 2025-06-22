'use client';

import { useState } from 'react';
import { InheritanceData } from '@/types';

interface StepFormProps {
  onSubmit: (data: InheritanceData) => void;
  loading?: boolean;
  onFormDataChange?: (data: InheritanceData) => void;
}

const STEPS = [
  { id: 1, title: '부동산', description: '집, 땅, 상가 등' },
  { id: 2, title: '금융자산', description: '예금, 주식, 펀드 등' },
  { id: 3, title: '기타자산', description: '차량, 보험, 사업 등' },
  { id: 4, title: '채무', description: '대출, 빚 등' },
  { id: 5, title: '공제항목', description: '적용 가능한 공제 선택' }
];

export default function StepForm({ onSubmit, loading = false, onFormDataChange }: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InheritanceData>({
    deathDate: new Date().toISOString().split('T')[0],
    deceasedName: '피상속인',
    heirsCount: 1,
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
        other: 0,
        gifts_real_estate: 0,
        gifts_other: 0
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
        other: 0
      }
    },
    deductions: {
      basic: true,
      spouse: false,
      disabled: false,
      minor: false
    }
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

  const handleFinancialChange = (field: keyof InheritanceData['assets']['financial'], value: number) => {
    updateFormData({
      assets: {
        ...formData.assets,
        financial: {
          ...formData.assets.financial,
          [field]: value
        }
      }
    });
  };

  const handleOtherAssetsChange = (type: 'insurance' | 'business' | 'movables' | 'other', field: string, value: number) => {
    updateFormData({
      assets: {
        ...formData.assets,
        [type]: {
          ...formData.assets[type],
          [field]: value
        }
      }
    });
  };

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

  const handleDeductionChange = (type: keyof InheritanceData['deductions'], value: boolean) => {
    updateFormData({
      deductions: {
        ...formData.deductions,
        [type]: value
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
      case 1: // 부동산
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">부동산</h3>
              <p className="text-gray-600">주거용, 상업용, 토지 등 부동산 자산을 입력해주세요</p>
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
            
            {/* 10년 이내 증여재산 */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                10년 이내 증여재산 (선택)
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                피상속인이 사망일 전 10년 이내에 상속인에게 증여한 재산이 있다면 입력해주세요
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    증여받은 부동산 (원)
                  </label>
                  <input
                    type="text"
                    value={formatDisplayValue(formData.assets.other.gifts_real_estate || 0)}
                    onChange={(e) => handleOtherAssetsChange('other', 'gifts_real_estate', parseInt(formatNumber(e.target.value)) || 0)}
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
                    value={formatDisplayValue(formData.assets.other.gifts_other || 0)}
                    onChange={(e) => handleOtherAssetsChange('other', 'gifts_other', parseInt(formatNumber(e.target.value)) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="예: 50,000,000"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // 금융자산
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">금융자산</h3>
              <p className="text-gray-600">예금, 주식, 펀드 등 금융자산을 입력해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예금 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.financial.deposits)}
                  onChange={(e) => handleFinancialChange('deposits', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 50,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  적금 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.financial.savings)}
                  onChange={(e) => handleFinancialChange('savings', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 30,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주식 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.financial.stocks)}
                  onChange={(e) => handleFinancialChange('stocks', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 50,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  펀드 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.financial.funds)}
                  onChange={(e) => handleFinancialChange('funds', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 20,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  채권 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.financial.bonds)}
                  onChange={(e) => handleFinancialChange('bonds', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 10,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  암호화폐 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.financial.crypto)}
                  onChange={(e) => handleFinancialChange('crypto', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 10,000,000"
                />
              </div>
            </div>
          </div>
        );

      case 3: // 기타자산
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">기타 자산</h3>
              <p className="text-gray-600">차량, 보험, 사업 등 기타 자산을 입력해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  차량 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.movables.vehicles)}
                  onChange={(e) => handleOtherAssetsChange('movables', 'vehicles', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 30,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생명보험금 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.insurance.life)}
                  onChange={(e) => handleOtherAssetsChange('insurance', 'life', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 30,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연금보험 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.insurance.annuity)}
                  onChange={(e) => handleOtherAssetsChange('insurance', 'annuity', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 20,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업지분 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.business.shares)}
                  onChange={(e) => handleOtherAssetsChange('business', 'shares', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 100,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  보석/귀금속 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.movables.jewelry)}
                  onChange={(e) => handleOtherAssetsChange('movables', 'jewelry', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 10,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 자산 (원)
                </label>
                <input
                  type="text"
                  value={formatDisplayValue(formData.assets.other.other)}
                  onChange={(e) => handleOtherAssetsChange('other', 'other', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="예: 20,000,000"
                />
              </div>
            </div>
          </div>
        );

      case 4: // 채무
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">채무</h3>
              <p className="text-gray-600">대출, 빚 등 채무를 입력해주세요</p>
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

      case 5: // 공제항목
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">공제 항목</h3>
              <p className="text-gray-600">적용 가능한 공제를 선택해주세요</p>
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
                    <p className="text-sm text-gray-600">2억원 (기본 공제)</p>
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
                    <p className="text-sm text-gray-600">6억원 (배우자가 있는 경우)</p>
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
                    <p className="text-sm text-gray-600">1억원 (장애인 상속인이 있는 경우)</p>
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
                    <p className="text-sm text-gray-600">1억원 (미성년 상속인이 있는 경우)</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 공제 항목은 중복 적용 가능하며, 상속세 계산 시 자동으로 반영됩니다.
              </p>
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
              px-6 py-3 rounded-lg font-medium transition-colors
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
                px-8 py-3 rounded-lg font-medium transition-colors
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
                px-6 py-3 rounded-lg font-medium transition-colors
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
    </div>
  );
} 