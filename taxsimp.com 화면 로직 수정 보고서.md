# taxsimp.com 화면 로직 수정 보고서

## 1. 개요

본 보고서는 국세청 상속세 세액계산 흐름도에 맞춰 taxsimp.com의 화면 로직을 개선한 내용을 설명합니다. `InheritanceData` 인터페이스와 `StepForm.tsx` 파일의 `renderStepContent` 함수가 주요 수정 대상입니다.

## 2. `InheritanceData` 인터페이스 수정 내용

상속세 계산의 정확성을 높이고 현행 세법을 반영하기 위해 `InheritanceData` 인터페이스를 다음과 같이 확장했습니다.

### 2.1. 기본 정보 추가

*   `hasSpouse`: 배우자 유무 (boolean)
*   `childrenCount`: 자녀 수 (number)
*   `minorChildrenCount`: 미성년 자녀 수 (number)
*   `elderlyCount`: 연로자 (만 65세 이상) 수 (number)
*   `disabledCount`: 장애인 수 (number)

이 필드들은 인적공제 계산의 기초 자료로 활용됩니다.

### 2.2. 자산 항목 확장

*   `financial`에 `insuranceProceeds` (보험금) 및 `severancePay` (퇴직금) 추가.
*   `nonTaxableAssets` 객체 추가: 비과세 상속재산 및 과세가액 불산입 상속재산(`stateDonation`, `culturalProperty`, `religiousProperty`, `publicInterestDonation`, `otherNonTaxable`)을 명확히 구분하여 입력받도록 했습니다.
*   `giftsAdded` 객체 변경: 10년 이내 증여재산(`realEstate`, `other`)을 배열 형태로 관리하여 여러 건의 증여를 입력할 수 있도록 했으며, 각 증여 건별로 `value`, `giftTaxPaid`, `giftDate`, `isHeir`를 입력받도록 했습니다.

### 2.3. 채무 항목 확장

*   `debts.other`에 `publicUtilities` (공과금) 필드 추가.

### 2.4. 공제 항목 확장

*   `deductions`에 `elderly`, `financialAsset`, `businessSuccession`, `farmingSuccession`, `cohabitingHouse`, `disasterLoss`, `disasterLossAmount` 필드 추가.

### 2.5. 세액공제 항목 추가

*   `taxCredits` 객체 추가: `generationSkipSurcharge`, `generationSkipSurchargeAmount`, `giftTaxCredit`, `foreignTaxCredit`, `foreignTaxCreditAmount`, `shortTermReinheritanceCredit`, `shortTermReinheritanceCreditAmount` 필드를 포함하여 세액공제 관련 정보를 입력받도록 했습니다.

## 3. `StepForm.tsx`의 `renderStepContent` 함수 수정 내용

`renderStepContent` 함수는 국세청 상속세 세액계산 흐름도에 따라 단계를 재구성하고, 확장된 `InheritanceData` 인터페이스에 맞춰 입력 필드를 추가 및 수정했습니다.

### 3.1. 단계 재구성

기존 5단계에서 7단계로 확장하여 상속세 계산 흐름을 보다 명확하게 반영했습니다.

*   **1단계: 기본 정보 및 총상속재산가액**
    *   피상속인 및 상속인 정보 입력 필드(`hasSpouse`, `childrenCount`, `minorChildrenCount`, `elderlyCount`, `disabledCount`) 추가.
    *   기존 부동산, 금융자산, 기타자산 입력 필드 유지.
    *   금융자산에 `보험금`과 `퇴직금` 입력 필드 추가.

*   **2단계: 비과세 및 과세가액 불산입 재산**
    *   `nonTaxableAssets`에 해당하는 입력 필드(`stateDonation`, `culturalProperty`, `religiousProperty`, `publicInterestDonation`, `otherNonTaxable`) 추가.

*   **3단계: 채무 및 공과금, 장례비용**
    *   기존 채무 및 장례비용 입력 필드 유지.
    *   기타 채무에 `공과금` 입력 필드 추가.

*   **4단계: 사전증여재산**
    *   `giftsAdded` 배열을 활용하여 부동산 및 기타 사전증여 재산을 동적으로 추가/삭제할 수 있는 UI 구현.
    *   각 증여 건별로 `증여재산 가액`, `납부한 증여세액`, `증여일`, `상속인 여부`를 입력받도록 함.

*   **5단계: 상속공제**
    *   인적공제 섹션에 `미성년자공제`, `연로자공제`, `장애인공제` 체크박스 추가.
    *   물적공제 섹션에 `금융재산 상속공제`, `가업상속공제`, `영농상속공제`, `동거주택 상속공제`, `재해손실공제` 체크박스 및 `재해손실액` 입력 필드 추가.

*   **6단계: 세액공제**
    *   `세대생략 할증과세`, `증여세액공제`, `외국납부세액공제`, `단기재상속세액공제` 체크박스 및 관련 금액 입력 필드 추가.

*   **7단계: 최종 결과**
    *   계산된 상속세액 및 상세 내역을 요약하여 표시하는 영역 추가. (실제 계산 로직은 백엔드 또는 별도의 계산 모듈에서 처리되어야 함)

## 4. 코드 파일

수정된 `InheritanceData.ts` 및 `StepForm_improved.tsx` 파일은 다음 경로에 저장되어 있습니다.

*   `InheritanceData.ts`: `/home/ubuntu/InheritanceData.ts`
*   `StepForm_improved.tsx`: `/home/ubuntu/StepForm_improved.tsx`

## 5. 결론

이번 화면 로직 개선은 국세청 상속세 세액계산 흐름도와 현행 세법을 최대한 반영하여 사용자 입력의 정확성과 계산의 신뢰도를 높이는 데 중점을 두었습니다. 제시된 코드와 보고서를 참고하여 taxsimp.com의 상속세 계산 기능을 더욱 고도화할 수 있기를 바랍니다.


