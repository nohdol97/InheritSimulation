import React, { useState } from 'react';
import AgreementDetailModal from './AgreementDetailModal';
import { TERMS_OF_SERVICE, PRIVACY_REQUIRED, MARKETING } from './agreements';

const AGREEMENTS = [
  {
    key: 'terms',
    label: '[필수] 이용약관 동의',
    required: true,
    content: TERMS_OF_SERVICE,
  },
  {
    key: 'privacy_required',
    label: '[필수] 개인정보 수집 및 이용 동의',
    required: true,
    content: PRIVACY_REQUIRED,
  },
  {
    key: 'marketing',
    label: '[선택] 마케팅 활용 동의',
    required: false,
    content: MARKETING,
  },
];

type AgreementState = {
  [key: string]: boolean;
};

interface AgreementSectionProps {
  value: AgreementState;
  onChange: (value: AgreementState) => void;
}

export default function AgreementSection({ value, onChange }: AgreementSectionProps) {
  const [modal, setModal] = useState<{ key: string; open: boolean }>({ key: '', open: false });

  const allChecked = AGREEMENTS.every(a => value[a.key]);
  const handleAll = (checked: boolean) => {
    const next: AgreementState = {};
    AGREEMENTS.forEach(a => {
      next[a.key] = checked;
    });
    onChange(next);
  };

  const handleChange = (key: string, checked: boolean) => {
    onChange({ ...value, [key]: checked });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={e => handleAll(e.target.checked)}
          className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded"
        />
        <span className="font-semibold text-gray-900">전체 동의</span>
      </div>
      <div className="space-y-2">
        {AGREEMENTS.map(a => (
          <div key={a.key} className="flex items-center justify-between bg-gray-50 rounded p-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={!!value[a.key]}
                onChange={e => handleChange(a.key, e.target.checked)}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
              <div className="flex flex-col">
                <span className="text-gray-800 text-sm">
                  {a.label}
                </span>
                {a.key === 'marketing' && (
                  <span className="text-xs font-semibold text-red-600 mt-1">5,000P 지급</span>
                )}
              </div>
            </div>
            <button
              type="button"
              className="text-blue-600 underline text-xs whitespace-nowrap"
              onClick={() => setModal({ key: a.key, open: true })}
            >상세보기</button>
            <AgreementDetailModal
              open={modal.open && modal.key === a.key}
              onClose={() => setModal({ key: '', open: false })}
              title={a.label}
              content={a.content}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 