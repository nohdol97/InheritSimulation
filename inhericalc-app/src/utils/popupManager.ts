// 팝업 관리 유틸리티

const STORAGE_KEYS = {
  WELCOME_POPUP_HIDDEN_UNTIL: 'welcome_popup_hidden_until',
  FIRST_VISIT: 'first_visit_done',
} as const;

/**
 * 오늘 하루 동안 웰컴 팝업을 숨기도록 설정
 */
export const hideWelcomePopupToday = (): void => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // 다음날 자정
  
  localStorage.setItem(STORAGE_KEYS.WELCOME_POPUP_HIDDEN_UNTIL, tomorrow.getTime().toString());
};

/**
 * 웰컴 팝업을 표시해야 하는지 확인
 * @returns {boolean} 팝업을 표시해야 하면 true
 */
export const shouldShowWelcomePopup = (): boolean => {
  try {
    // 첫 방문이 아니면 팝업 표시하지 않음
    const isFirstVisit = !localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
    if (!isFirstVisit) {
      return false;
    }

    // 숨김 설정 확인
    const hiddenUntilStr = localStorage.getItem(STORAGE_KEYS.WELCOME_POPUP_HIDDEN_UNTIL);
    if (!hiddenUntilStr) {
      return true; // 숨김 설정이 없으면 표시
    }

    const hiddenUntil = parseInt(hiddenUntilStr, 10);
    const now = new Date().getTime();
    
    return now > hiddenUntil; // 숨김 기간이 지났으면 표시
  } catch (error) {
    console.warn('팝업 표시 여부 확인 중 오류:', error);
    return true; // 오류 시 기본적으로 표시
  }
};

/**
 * 첫 방문 완료로 표시
 */
export const markFirstVisitDone = (): void => {
  localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, 'true');
};

/**
 * 팝업 표시 기록 초기화 (개발/테스트용)
 */
export const resetPopupSettings = (): void => {
  localStorage.removeItem(STORAGE_KEYS.WELCOME_POPUP_HIDDEN_UNTIL);
  localStorage.removeItem(STORAGE_KEYS.FIRST_VISIT);
};

/**
 * 사용자가 로그인했는지 확인하는 헬퍼 함수
 * @param user - Supabase User 객체 또는 null
 * @returns {boolean} 로그인 상태면 true
 */
export const isUserLoggedIn = (user: unknown): boolean => {
  return user !== null && user !== undefined;
};

/**
 * 팝업 표시 조건을 종합적으로 확인
 * @param user - 현재 사용자 정보
 * @returns {boolean} 웰컴 팝업을 표시해야 하면 true
 */
export const canShowWelcomePopup = (user: unknown): boolean => {
  // 로그인한 사용자에게는 웰컴 팝업 표시하지 않음
  if (isUserLoggedIn(user)) {
    return false;
  }

  // 기본 팝업 표시 조건 확인
  return shouldShowWelcomePopup();
};

/**
 * 팝업 표시 지연 시간 (밀리초)
 */
export const POPUP_DELAY = {
  WELCOME: 2000, // 2초 후 웰컴 팝업 표시
} as const;

/**
 * 팝업 우선순위 관리
 * 여러 팝업이 동시에 표시되려 할 때의 우선순위
 */
export const POPUP_PRIORITY = {
  LOGIN_REQUIRED: 1, // 가장 높은 우선순위
  WELCOME_SIGNUP: 2,
  EXPERT_CONSULT: 3,
} as const;

/**
 * 현재 표시 중인 팝업 추적
 */
let currentPopupPriority: number | null = null;

/**
 * 팝업 표시 권한 확인
 * @param priority - 표시하려는 팝업의 우선순위
 * @returns {boolean} 표시 가능하면 true
 */
export const canShowPopupWithPriority = (priority: number): boolean => {
  return currentPopupPriority === null || priority <= currentPopupPriority;
};

/**
 * 팝업 표시 시작
 * @param priority - 팝업의 우선순위
 */
export const startShowingPopup = (priority: number): void => {
  currentPopupPriority = priority;
};

/**
 * 팝업 표시 종료
 */
export const stopShowingPopup = (): void => {
  currentPopupPriority = null;
}; 