'use client';

import { useEffect } from 'react';

interface KakaoShareButtonProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  webUrl?: string;
  className?: string;
}

export default function KakaoShareButton({ 
  title = "TaxSimp - 상속세 계산기",
  description = "2025년 기준 상속세를 간편하게 계산해보세요. 5단계 입력으로 정확한 상속세 예상 금액을 확인할 수 있습니다.",
  imageUrl = "https://www.taxsimp.com/og-image.png",
  webUrl = "https://www.taxsimp.com",
  className = ""
}: KakaoShareButtonProps) {
  
  useEffect(() => {
    // 카카오 SDK 초기화
    const initializeKakao = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const kakao = (window as any).Kakao;
      if (kakao && !kakao.isInitialized()) {
        // 카카오 JavaScript 키를 환경변수에서 가져옵니다
        const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
        if (kakaoJsKey) {
          kakao.init(kakaoJsKey);
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kakao = (window as any).Kakao;
    if (kakao) {
      initializeKakao();
    } else {
      // 카카오 SDK 스크립트 동적 로드
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
      script.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';
      script.crossOrigin = 'anonymous';
      script.onload = initializeKakao;
      document.head.appendChild(script);

      return () => {
        // 컴포넌트 언마운트 시 스크립트 제거
        const existingScript = document.querySelector('script[src*="kakao_js_sdk"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, []);

  const handleKakaoShare = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kakao = (window as any).Kakao;
    if (!kakao || !kakao.isInitialized()) {
      alert('카카오 SDK가 초기화되지 않았습니다.');
      return;
    }

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: webUrl,
          webUrl: webUrl
        }
      },
      buttons: [
        {
          title: '상속세 계산하기',
          link: {
            mobileWebUrl: webUrl,
            webUrl: webUrl
          }
        }
      ]
    });
  };

  return (
    <button
      onClick={handleKakaoShare}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#FEE500] text-black rounded-lg hover:opacity-90 transition-opacity ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M16 4C9.37258 4 4 8.81722 4 14.6667C4 18.5253 6.02899 21.9407 9.03478 23.9919L7.38841 28.9884L11.8928 26.3982C13.1652 26.793 14.542 27 16 27C22.6274 27 28 22.1828 28 16.3333C28 10.4838 22.6274 5.66667 16 5.66667C16 5.25131 16 4.83594 16 4.42058V4.42058L16 4Z" 
          fill="black"
        />
      </svg>
      카카오톡 공유
    </button>
  );
}