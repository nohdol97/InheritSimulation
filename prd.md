1. Project Overview

앱 이름: InheritCalculator (Inheritance Tax Calculator)

목적: 사용자가 간단한 입력만으로 본인의 상속세 부담을 미리 계산하고, 가족 구성과 재산 내역을 반영한 맞춤형 시뮬레이션 결과를 확인할 수 있는 웹 기반 서비스 제공

타깃 사용자: 일반 사용자, 은퇴 준비자, 상속세가 걱정되는 자산가, 세무/법률 초보자

사용 기술:
	•	프론트엔드: React (with TypeScript), TailwindCSS
	•	백엔드: Next.js API Routes (with TypeScript)
	•	DB: Supabase (PostgreSQL 기반)
	•	챗봇: GPT API (OpenAI GPT-4 Turbo) 연동
	•	배포: Vercel (전체 프로젝트 프론트 + 백엔드 포함)
	•	인증: Supabase Auth (Email/Password, Google OAuth, Kakao OAuth)

⸻

2. Core Functionality

기능 설명

1) 상속세 계산 기능
	•	기본 입력 (사망일, 피상속인 정보, 상속인 수, 관계)
	•	재산 항목: 부동산, 예금, 주식, 보험금, 사업체, 차량 등 자산별 금액 입력
	•	채무 항목: 장례비, 금융채무, 세금 미납 등 입력
	•	공제 항목: 배우자공제, 장애인공제, 미성년공제, 일괄공제 등 자동 적용
	•	결과 출력: 총 과세표준, 공제 금액, 세율 적용, 총 상속세 산정 결과

2) 시뮬레이션 기능
	•	상속인 수 및 분배 비율 변경 시 결과 실시간 반영
	•	증여 이력 포함 여부 설정 가능 (10년 내 증여 합산)
	•	그래프/차트로 시각화 제공

3) 사용자 인증 기능
	•	이메일/비밀번호 회원가입 및 로그인
	•	Google 계정 연동 로그인/회원가입
	•	카카오 계정 연동 로그인/회원가입
	•	개인정보 활용 동의 (회원가입 시)
	•	로그인 시 계산 기록 저장 및 조회

4) 문서 요약 제공 (옵션)
	•	자동 생성된 상속 요약 보고서 (PDF 다운로드 가능)

⸻

3. Docs
	•	GET /api/tax/simulate : 상속세 시뮬레이션 결과 반환
	•	POST /api/tax/calculate : 입력 기반 상속세 계산 수행
	•	POST /api/chat : GPT 기반 Q&A 응답 처리
	•	GET /api/preset/example : 샘플 입력 예시 반환

⸻

4. File Structure

/inhericalc-app
  /public
  /src
    /components
      - InputForm.tsx
      - ResultSummary.tsx
      - TaxBreakdownChart.tsx
      - ChatbotPanel.tsx
    /pages
      - index.tsx
      - api/
        - tax.ts
        - chat.ts
    /lib
      - calculator.ts  // 상속세 계산 로직
      - presets.ts     // 샘플 입력값
    /styles
    /types
    /utils
  tailwind.config.ts
  next.config.ts
  tsconfig.json
  package.json
  .env

/supabase
  schema.sql

⸻

5. Implementation Checklist (긴급 개발 버전 - 하루 배포)

## Phase 1: 프로젝트 초기 설정 (1-2시간)
- [x] Next.js + TypeScript 프로젝트 생성
- [x] TailwindCSS 설정
- [x] 기본 폴더 구조 생성
- [x] 환경 변수 설정 (.env 파일)

## Phase 2: 핵심 계산 로직 구현 (2-3시간)
- [x] 상속세 계산 알고리즘 구현 (/lib/calculator.ts)
- [x] 기본 공제 항목 계산 로직 (배우자공제, 일괄공제)
- [x] 세율 적용 로직
- [x] 기본 샘플 데이터 (/lib/presets.ts)

## Phase 3: API 엔드포인트 구현 (1-2시간)
- [x] POST /api/tax/calculate 구현
- [x] GET /api/preset/example 구현
- [x] 기본 에러 핸들링

## Phase 4: 프론트엔드 핵심 컴포넌트 (3-4시간)
- [x] InputForm.tsx - 기본 입력 폼
- [x] ResultSummary.tsx - 계산 결과 표시
- [x] 메인 페이지 (index.tsx) 레이아웃
- [x] 기본 반응형 디자인
- [x] 단계별 입력 폼 구현 (Step by Step)
- [x] 실시간 계산 결과 표시
- [x] UI/UX 개선 (모던한 디자인)
- [x] 진행률 표시 및 네비게이션

## Phase 5: 배포 준비 (1-2시간)
- [x] Vercel 배포 설정
- [x] 환경 변수 설정
- [x] 기본 테스트 및 버그 수정
- [x] README.md 작성
- [x] Supabase 연동 (사용자 인증, 계산 기록 저장)

## 우선순위 (하루 배포용)
1. **필수 기능만 구현**: 상속세 계산, 기본 UI, 배포
2. **선택 기능**: 시뮬레이션, 챗봇, PDF 생성은 다음 버전에서
3. **최소 기능**: 계산 결과만 정확히 나오면 OK

## 시간 배분
- 오전 (4시간): Phase 1-2 (기반 설정 + 계산 로직)
- 오후 (4시간): Phase 3-4 (API + 프론트엔드)
- 저녁 (2시간): Phase 5 (배포 및 최종 점검)

## 다음 버전에서 추가할 기능
- [ ] 시뮬레이션 기능
- [ ] GPT 챗봇 기능
- [ ] 차트/그래프 시각화
- [ ] PDF 보고서 생성
- [ ] 고급 공제 항목 (장애인공제, 미성년공제)
- [ ] 증여 합산 계산

## 긴급 개발 시 주의사항
- MVP(Minimum Viable Product) 원칙 적용
- 핵심 기능 우선, 부가 기능은 다음 버전에서
- 코드 품질보다는 동작하는 기능 우선
- 배포 후 지속적인 개선 계획 수립

---

## 2025년 1월 개선 작업 체크리스트

### Phase 1: UI/UX 개선 (1-2시간)
- [x] 1. 구글/카카오 로그인 UI 임시 주석 처리
- [x] 2. 실시간 계산결과 카카오톡 공유 UI 주석 처리  
- [x] 3. 하단 '주요 공제' 섹션 왼쪽 정렬 수정
- [x] 4. 입력 필드 스타일 개선 (회색 0 → 검정 입력값)
- [x] 5. 모든 회색 숫자를 검정색으로 변경
- [x] 6. 입력 불가능한 필드들 수정
- [x] 7. 모바일로 봤을 때, 웹 하단에 '예상 상속세' 고정(아래 스크롤 시 사라짐, 위로 스크롤 시 보이게 함)

### Phase 2: 회원가입 기능 확장 (2-3시간)
- [ ] 7. 회원가입 UI에 추가 필드 구현 (이름, 전화번호, 비밀번호 확인, 지역)
- [ ] 8. 이용약관/개인정보처리/마케팅 동의 체크박스 추가
- [ ] 9. Supabase 사용자 프로필 테이블 필드 확장
- [ ] 10. 회원가입 시 추가 정보 저장 로직 구현

### Phase 3: 데이터 저장 기능 (1-2시간)
- [ ] 11. 계산 데이터 Supabase 저장 기능 구현
- [ ] 12. 버튼 클릭 시 데이터 저장 로직 연동

### Phase 4: SEO 최적화 (1시간)
- [ ] 13. 메타 태그 최적화
- [ ] 14. 웹 파비콘 추가
- [ ] 15. 사이트 제목 및 설명 최적화

### 총 예상 시간: 5-8시간
### 우선순위: 1 → 4 → 2 → 3 (UI 개선 먼저, SEO 다음, 기능 확장 마지막)

---

## 작업 진행 상황
- **시작 시간**: 2025-01-22
- **현재 상태**: Phase 1 진행 중 (3/7 완료)
- **완료된 작업**: 
  - ✅ 5단계 구조 복원 (부동산, 금융자산, 기타자산, 채무, 공제항목)
  - ✅ 구글/카카오 로그인 UI 주석 처리
  - ✅ 실시간 계산결과 카카오톡 공유 UI 주석 처리
  - ✅ 입력 필드 스타일 개선 (검정색 텍스트)
  - ✅ 하단 '주요 공제' 섹션 정렬 수정
- **진행 중인 작업**: Phase 1 - UI/UX 개선 (남은 작업: 입력 불가능한 필드 수정, 모바일 고정 UI)