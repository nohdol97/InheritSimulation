'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { id: 1, title: '기본 정보', shortTitle: '기본' },
  { id: 2, title: '재산 정보', shortTitle: '재산' },
  { id: 3, title: '채무 정보', shortTitle: '채무' },
  { id: 4, title: '세액공제', shortTitle: '세액' },
  { id: 5, title: '상속공제', shortTitle: '공제' },
  { id: 6, title: '계산 결과', shortTitle: '결과' }
];

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">상속세 계산기</h2>
        <div className="text-white text-sm">
          {currentStep} / {totalSteps}
        </div>
      </div>
      
      {/* 진행률 바 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">
            {STEPS[currentStep - 1]?.title}
          </span>
          <span className="text-sm text-blue-100">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        {/* 단계 표시 - 모바일용 축약형 */}
        <div className="flex justify-between mt-3 px-1">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${currentStep >= step.id 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-300 text-blue-600'
                }
              `}>
                {step.id}
              </div>
              <span className="text-xs text-blue-100 mt-1 text-center max-w-12">
                {step.shortTitle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 