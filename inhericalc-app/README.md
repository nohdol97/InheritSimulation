# TaxSimp - 상속세 계산기

한국의 상속세를 간편하게 계산할 수 있는 웹 기반 서비스입니다.

## 🚀 주요 기능

- **단계별 입력**: 재산 정보, 채무 정보, 공제 항목을 단계별로 입력
- **실시간 계산**: 입력하는 즉시 상속세 계산 결과 확인
- **정확한 계산**: 2025년 기준 상속세율과 공제 적용
- **반응형 디자인**: 모바일과 데스크톱에서 모두 사용 가능

## 🛠 기술 스택

- **프론트엔드**: React 19, TypeScript, TailwindCSS
- **백엔드**: Next.js 15 API Routes
- **배포**: Vercel
- **개발 도구**: ESLint, TypeScript

## 📋 계산 방법

1. **총 재산가액 - 총 채무 = 순 재산가액**
2. **순 재산가액 - 공제액 = 과세표준**
3. **과세표준 × 세율 - 누진공제 = 산출세액**

## 💰 주요 공제 항목 (2025년 기준)

- **일괄공제**: 2억원
- **배우자공제**: 6억원
- **장애인공제**: 1억원
- **미성년공제**: 1억원

## 🚀 시작하기

### 개발 환경 설정

```bash
# 저장소 클론
git clone [repository-url]
cd inhericalc-app

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Vercel 배포
vercel --prod
```

## 📁 프로젝트 구조

```
inhericalc-app/
├── src/
│   ├── app/
│   │   ├── api/           # API 엔드포인트
│   │   │   ├── tax/       # 상속세 계산 API
│   │   │   └── preset/    # 샘플 데이터 API
│   │   ├── page.tsx       # 메인 페이지
│   │   └── layout.tsx     # 레이아웃
│   ├── components/        # React 컴포넌트
│   │   ├── StepForm.tsx   # 단계별 입력 폼
│   │   ├── LiveCalculation.tsx # 실시간 계산
│   │   └── ResultSummary.tsx   # 결과 요약
│   ├── lib/              # 유틸리티 함수
│   │   ├── calculator.ts  # 상속세 계산 로직
│   │   └── presets.ts     # 샘플 데이터
│   └── types/            # TypeScript 타입 정의
├── public/               # 정적 파일
└── package.json
```

## 🔧 API 엔드포인트

### POST /api/tax/calculate
상속세 계산을 수행합니다.

**요청 본문:**
```json
{
  "deathDate": "2024-01-01",
  "deceasedName": "홍길동",
  "heirsCount": 2,
  "assets": {
    "realEstate": 500000000,
    "deposits": 100000000,
    "stocks": 50000000,
    "insurance": 0,
    "business": 0,
    "vehicles": 0,
    "other": 0
  },
  "debts": {
    "funeral": 5000000,
    "financial": 0,
    "taxes": 0,
    "other": 0
  },
  "deductions": {
    "spouse": true,
    "disabled": false,
    "minor": false,
    "basic": true
  }
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "totalAssets": 650000000,
    "totalDebts": 5000000,
    "netAssets": 645000000,
    "totalDeductions": 600000000,
    "taxableAmount": 45000000,
    "taxRate": 0.1,
    "progressiveDeduction": 0,
    "calculatedTax": 4500000,
    "taxPerHeir": 2250000
  }
}
```

### GET /api/preset/example
샘플 입력 데이터를 반환합니다.

## 🧪 테스트

```bash
# 린트 검사
npm run lint

# 타입 체크
npx tsc --noEmit

# 빌드 테스트
npm run build
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## ⚠️ 면책 조항

이 계산기는 참고용이며, 실제 상속세는 전문가와 상담하시기 바랍니다. 계산 결과는 법적 효력이 없습니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**TaxSimp** - 간편하고 정확한 상속세 계산기
