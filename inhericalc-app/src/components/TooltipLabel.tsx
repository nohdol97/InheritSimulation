'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface TooltipLabelProps {
  label: string;
  hint: string;
  required?: boolean;
}

export default function TooltipLabel({ label, hint, required = false }: TooltipLabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 툴팁 위치 및 스타일 계산 함수
  const calculateTooltipPosition = useCallback(() => {
    if (!buttonRef.current || !mounted) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 기본 툴팁 크기 설정
    const tooltipMaxWidth = Math.min(280, windowWidth * 0.9);
    const padding = 16;
    
    // 기본 위치 계산 (버튼 오른쪽)
    let tooltipLeft = buttonRect.right + 8;
    let tooltipTop = buttonRect.top - 8;
    let arrowLeft = -4;
    let arrowTop = 16;
    
    // 오른쪽 공간이 부족한 경우 왼쪽으로
    if (tooltipLeft + tooltipMaxWidth > windowWidth - padding) {
      tooltipLeft = buttonRect.left - tooltipMaxWidth - 8;
      arrowLeft = tooltipMaxWidth - 4;
    }
    
    // 왼쪽 공간도 부족한 경우 위나 아래로
    if (tooltipLeft < padding) {
      tooltipLeft = Math.max(padding, buttonRect.left + buttonRect.width / 2 - tooltipMaxWidth / 2);
      
      // 위쪽에 공간이 있는지 확인
      if (buttonRect.top > 100) {
        tooltipTop = buttonRect.top - 60;
        arrowTop = 52;
        arrowLeft = Math.max(4, Math.min(tooltipMaxWidth - 20, buttonRect.left + buttonRect.width / 2 - tooltipLeft));
      } else {
        tooltipTop = buttonRect.bottom + 8;
        arrowTop = -4;
        arrowLeft = Math.max(4, Math.min(tooltipMaxWidth - 20, buttonRect.left + buttonRect.width / 2 - tooltipLeft));
      }
    }
    
    // 화면 경계 체크 및 조정
    if (tooltipLeft < padding) tooltipLeft = padding;
    if (tooltipLeft + tooltipMaxWidth > windowWidth - padding) {
      tooltipLeft = windowWidth - tooltipMaxWidth - padding;
    }
    if (tooltipTop < padding) tooltipTop = padding;
    if (tooltipTop + 100 > windowHeight - padding) {
      tooltipTop = windowHeight - 100 - padding;
    }
    
    setTooltipStyle({
      position: 'fixed',
      left: `${tooltipLeft}px`,
      top: `${tooltipTop}px`,
      maxWidth: `${tooltipMaxWidth}px`,
      width: 'max-content',
      zIndex: 9999,
      pointerEvents: 'auto'
    });
    
    setArrowStyle({
      position: 'absolute',
      left: `${arrowLeft}px`,
      top: `${arrowTop}px`,
      width: '8px',
      height: '8px',
      backgroundColor: '#1f2937',
      transform: 'rotate(45deg)',
      zIndex: -1
    });
  }, [mounted]);

  // 툴팁 표시
  const handleShowTooltip = useCallback(() => {
    setShowTooltip(true);
    // 다음 프레임에서 위치 계산 (DOM 업데이트 후)
    setTimeout(calculateTooltipPosition, 0);
  }, [calculateTooltipPosition]);

  // 툴팁 숨기기
  const handleHideTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTooltip]);

  // 윈도우 리사이즈 시 위치 재계산
  useEffect(() => {
    const handleResize = () => {
      if (showTooltip) {
        calculateTooltipPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showTooltip, calculateTooltipPosition]);

  // 스크롤 시 툴팁 닫기
  useEffect(() => {
    const handleScroll = () => {
      if (showTooltip) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, [showTooltip]);

  const handleButtonClick = () => {
    if (!showTooltip) {
      handleShowTooltip();
    } else {
      handleHideTooltip();
    }
  };

  const tooltipContent = showTooltip && mounted ? (
    <div 
      ref={tooltipRef}
      style={tooltipStyle}
      className="bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 whitespace-normal break-words leading-relaxed"
      role="tooltip"
      aria-hidden={!showTooltip}
    >
      <div style={arrowStyle}></div>
      {hint}
    </div>
  ) : null;

  return (
    <div className="flex items-center space-x-2 mb-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onMouseEnter={handleShowTooltip}
          onMouseLeave={handleHideTooltip}
          onClick={handleButtonClick}
          className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 transition-colors touch-manipulation"
          aria-label={`${label} 도움말`}
        >
          ?
        </button>
        {mounted && createPortal(tooltipContent, document.body)}
      </div>
    </div>
  );
} 