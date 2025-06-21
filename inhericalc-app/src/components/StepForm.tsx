'use client';

import { useState } from 'react';
import { InheritanceData } from '@/types';

interface StepFormProps {
  onSubmit: (data: InheritanceData) => void;
  loading?: boolean;
  onFormDataChange?: (data: InheritanceData) => void;
}

const STEPS = [
  { id: 1, title: '기본 정보', description: '피상속인 및 상속인 정보' },
  { id: 2, title: '재산 정보', description: '부동산, 예금, 주식 등' },
  { id: 3, title: '채무 정보', description: '장례비, 금융채무 등' },
  { id: 4, title: '공제 항목', description: '적용 가능한 공제 선택' }
];

export default function StepForm({ onSubmit, loading = false, onFormDataChange }: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InheritanceData>({
    deathDate: new Date().toISOString().split('T')[0],
    deceasedName: '',
    heirsCount: 1,
    assets: {
      realEstate: 0,
      deposits: 0,
      stocks: 0,
      insurance: 0,
      business: 0,
      vehicles: 0,
      other: 0
    },
    debts: {
      funeral: 0,
      financial: 0,
      taxes: 0,
      other: 0
    },
    deductions: {
      spouse: false,
      disabled: false,
      minor: false,
      basic: true
    }
  });

  const handleInputChange = (field: string, value: string | number) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    if (onFormDataChange) {
      onFormDataChange(updatedData);
    }
  };

  const handleAssetChange = (field: keyof InheritanceData['assets'], value: number) => {
    const updatedData = {
      ...formData,
      assets: {
        ...formData.assets,
        [field]: value
      }
    };
    setFormData(updatedData);
    if (onFormDataChange) {
      onFormDataChange(updatedData);
    }
  };

  const handleDebtChange = (field: keyof InheritanceData['debts'], value: number) => {
    const updatedData = {
      ...formData,
      debts: {
        ...formData.debts,
        [field]: value
      }
    };
    setFormData(updatedData);
    if (onFormDataChange) {
      onFormDataChange(updatedData);
    }
  };

  const handleDeductionChange = (field: keyof InheritanceData['deductions'], value: boolean) => {
    const updatedData = {
      ...formData,
      deductions: {
        ...formData.deductions,
        [field]: value
      }
    };
    setFormData(updatedData);
    if (onFormDataChange) {
      onFormDataChange(updatedData);
    }
  };

  const handleFinalSubmit = () => {
    onSubmit(formData);
  };

  const formatNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
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
    switch (currentStep) {
      case 1:
        return formData.deathDate && formData.deceasedName && formData.heirsCount > 0;
      case 2:
        return true; // 재산 정보는 선택사항
      case 3:
        return true; // 채무 정보는 선택사항
      case 4:
        return true; // 공제 항목은 선택사항
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">기본 정보 입력</h3>
              <p className="text-gray-600">피상속인과 상속인에 대한 기본 정보를 입력해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사망일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.deathDate}
                  onChange={(e) => handleInputChange('deathDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  피상속인명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.deceasedName}
                  onChange={(e) => handleInputChange('deceasedName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상속인 수 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.heirsCount}
                  onChange={(e) => handleInputChange('heirsCount', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">재산 정보 입력</h3>
              <p className="text-gray-600">피상속인의 재산 내역을 입력해주세요 (선택사항)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부동산 (원)
                </label>
                <input
                  type="text"
                  value={formData.assets.realEstate.toLocaleString()}
                  onChange={(e) => handleAssetChange('realEstate', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예금 (원)
                </label>
                <input
                  type="text"
                  value={formData.assets.deposits.toLocaleString()}
                  onChange={(e) => handleAssetChange('deposits', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주식 (원)
                </label>
                <input
                  type="text"
                  value={formData.assets.stocks.toLocaleString()}
                  onChange={(e) => handleAssetChange('stocks', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  보험금 (원)
                </label>
                <input
                  type="text"
                  value={formData.assets.insurance.toLocaleString()}
                  onChange={(e) => handleAssetChange('insurance', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업체 (원)
                </label>
                <input
                  type="text"
                  value={formData.assets.business.toLocaleString()}
                  onChange={(e) => handleAssetChange('business', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  차량 (원)
                </label>
                <input
                  type="text"
                  value={formData.assets.vehicles.toLocaleString()}
                  onChange={(e) => handleAssetChange('vehicles', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 재산 (원)
                </label>
                <input
                  type="text"
                  value={formData.assets.other.toLocaleString()}
                  onChange={(e) => handleAssetChange('other', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">채무 정보 입력</h3>
              <p className="text-gray-600">피상속인의 채무 내역을 입력해주세요 (선택사항)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  장례비 (원)
                </label>
                <input
                  type="text"
                  value={formData.debts.funeral.toLocaleString()}
                  onChange={(e) => handleDebtChange('funeral', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  금융채무 (원)
                </label>
                <input
                  type="text"
                  value={formData.debts.financial.toLocaleString()}
                  onChange={(e) => handleDebtChange('financial', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  세금 미납 (원)
                </label>
                <input
                  type="text"
                  value={formData.debts.taxes.toLocaleString()}
                  onChange={(e) => handleDebtChange('taxes', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 채무 (원)
                </label>
                <input
                  type="text"
                  value={formData.debts.other.toLocaleString()}
                  onChange={(e) => handleDebtChange('other', parseInt(formatNumber(e.target.value)) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">공제 항목 선택</h3>
              <p className="text-gray-600">적용 가능한 공제 항목을 선택해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.deductions.basic}
                  onChange={(e) => handleDeductionChange('basic', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">일괄공제</span>
                  <p className="text-xs text-gray-500">1억원 공제</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.deductions.spouse}
                  onChange={(e) => handleDeductionChange('spouse', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">배우자공제</span>
                  <p className="text-xs text-gray-500">5억원 공제</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.deductions.disabled}
                  onChange={(e) => handleDeductionChange('disabled', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">장애인공제</span>
                  <p className="text-xs text-gray-500">1억원 공제</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.deductions.minor}
                  onChange={(e) => handleDeductionChange('minor', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">미성년공제</span>
                  <p className="text-xs text-gray-500">1억원 공제</p>
                </div>
              </label>
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
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          ></div>
        </div>
        
        {/* 단계 표시 */}
        <div className="flex justify-between mt-4">
          {STEPS.map((step) => (
            <div key={step.id} className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id <= currentStep 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white bg-opacity-20 text-white'
              }`}>
                {step.id}
              </div>
              <div className="text-xs text-white mt-1 hidden sm:block">
                {step.title}
              </div>
            </div>
          ))}
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
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            이전
          </button>
          
          <div className="flex gap-3">
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading || !canProceed()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '계산 중...' : '상속세 계산하기'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 