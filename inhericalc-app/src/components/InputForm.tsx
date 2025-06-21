'use client';

import { useState } from 'react';
import { InheritanceData } from '@/types';

interface InputFormProps {
  onSubmit: (data: InheritanceData) => void;
  loading?: boolean;
}

export default function InputForm({ onSubmit, loading = false }: InputFormProps) {
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssetChange = (field: keyof InheritanceData['assets'], value: number) => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        [field]: value
      }
    }));
  };

  const handleDebtChange = (field: keyof InheritanceData['debts'], value: number) => {
    setFormData(prev => ({
      ...prev,
      debts: {
        ...prev.debts,
        [field]: value
      }
    }));
  };

  const handleDeductionChange = (field: keyof InheritanceData['deductions'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">상속세 계산기</h2>
      
      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사망일
            </label>
            <input
              type="date"
              value={formData.deathDate}
              onChange={(e) => handleInputChange('deathDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              피상속인명
            </label>
            <input
              type="text"
              value={formData.deceasedName}
              onChange={(e) => handleInputChange('deceasedName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상속인 수
            </label>
            <input
              type="number"
              value={formData.heirsCount}
              onChange={(e) => handleInputChange('heirsCount', parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* 재산 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">재산 정보 (원)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              부동산
            </label>
            <input
              type="text"
              value={formData.assets.realEstate.toLocaleString()}
              onChange={(e) => handleAssetChange('realEstate', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              예금
            </label>
            <input
              type="text"
              value={formData.assets.deposits.toLocaleString()}
              onChange={(e) => handleAssetChange('deposits', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주식
            </label>
            <input
              type="text"
              value={formData.assets.stocks.toLocaleString()}
              onChange={(e) => handleAssetChange('stocks', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              보험금
            </label>
            <input
              type="text"
              value={formData.assets.insurance.toLocaleString()}
              onChange={(e) => handleAssetChange('insurance', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사업체
            </label>
            <input
              type="text"
              value={formData.assets.business.toLocaleString()}
              onChange={(e) => handleAssetChange('business', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              차량
            </label>
            <input
              type="text"
              value={formData.assets.vehicles.toLocaleString()}
              onChange={(e) => handleAssetChange('vehicles', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기타 재산
            </label>
            <input
              type="text"
              value={formData.assets.other.toLocaleString()}
              onChange={(e) => handleAssetChange('other', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* 채무 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">채무 정보 (원)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              장례비
            </label>
            <input
              type="text"
              value={formData.debts.funeral.toLocaleString()}
              onChange={(e) => handleDebtChange('funeral', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              금융채무
            </label>
            <input
              type="text"
              value={formData.debts.financial.toLocaleString()}
              onChange={(e) => handleDebtChange('financial', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              세금 미납
            </label>
            <input
              type="text"
              value={formData.debts.taxes.toLocaleString()}
              onChange={(e) => handleDebtChange('taxes', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기타 채무
            </label>
            <input
              type="text"
              value={formData.debts.other.toLocaleString()}
              onChange={(e) => handleDebtChange('other', parseInt(formatNumber(e.target.value)) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* 공제 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">공제 항목</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.deductions.basic}
              onChange={(e) => handleDeductionChange('basic', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">일괄공제 (1억원)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.deductions.spouse}
              onChange={(e) => handleDeductionChange('spouse', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">배우자공제 (5억원)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.deductions.disabled}
              onChange={(e) => handleDeductionChange('disabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">장애인공제 (1억원)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.deductions.minor}
              onChange={(e) => handleDeductionChange('minor', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">미성년공제 (1억원)</span>
          </label>
        </div>
      </div>

      {/* 계산 버튼 */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '계산 중...' : '상속세 계산하기'}
        </button>
      </div>
    </form>
  );
} 