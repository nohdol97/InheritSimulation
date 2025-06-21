'use client';

import React, { useState } from 'react';
import { ExpertApplicationFormData } from '@/types';

interface ExpertApplicationFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const ExpertApplicationForm: React.FC<ExpertApplicationFormProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState<ExpertApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    region: '',
    profession: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 전화번호 입력 처리 함수
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 추출
    const numbersOnly = value.replace(/[^0-9]/g, '');
    
    // 길이 제한 (11자리까지)
    if (numbersOnly.length > 11) return;
    
    // 자동 하이픈 추가
    let formattedPhone = '';
    if (numbersOnly.length <= 3) {
      formattedPhone = numbersOnly;
    } else if (numbersOnly.length <= 7) {
      formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else {
      formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7)}`;
    }
    
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/expert/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        setFormData({
          name: '',
          email: '',
          phone: '',
          region: '',
          profession: ''
        });
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setMessage({ type: 'error', text: result.error || '신청 처리 중 오류가 발생했습니다.' });
      }
    } catch (error) {
      console.error('전문가 신청 오류:', error);
      setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const regions = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
    '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
  ];

  const professions = [
    '세무사', '회계사', '변호사', '법무사', '감정평가사', '부동산중개사', '보험설계사', '금융상품판매인',
    '투자상담사', '재무설계사', '기타'
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">전문가 신청</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            이름 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="홍길동"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            휴대폰 번호 *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="010-1234-5678"
            maxLength={13}
          />
          <p className="text-xs text-gray-500 mt-1">숫자만 입력하면 자동으로 하이픈이 추가됩니다</p>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            활동 지역 *
          </label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="" className="text-gray-400">지역을 선택해주세요</option>
            {regions.map((region) => (
              <option key={region} value={region} className="text-gray-900">
                {region}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
            직업/전문분야 *
          </label>
          <select
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="" className="text-gray-400">직업을 선택해주세요</option>
            {professions.map((profession) => (
              <option key={profession} value={profession} className="text-gray-900">
                {profession}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          } text-white`}
        >
          {isSubmitting ? '신청 중...' : '전문가 신청하기'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>* 필수 입력 항목</p>
        <p>신청 후 검토를 거쳐 승인 여부를 이메일로 안내드립니다.</p>
      </div>
    </div>
  );
};

export default ExpertApplicationForm; 