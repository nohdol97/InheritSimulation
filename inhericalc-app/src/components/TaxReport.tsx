'use client';

import { InheritanceData, TaxCalculationResult } from '@/types';

interface TaxReportProps {
  formData: InheritanceData;
  calculationResult: TaxCalculationResult;
}

export default function TaxReport({ formData, calculationResult }: TaxReportProps) {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('ko-KR');
  };

  // 자산 계산 - 중첩된 객체 구조 처리
  const realEstateTotal = Object.values(formData.assets.realEstate).reduce((sum, value) => sum + value, 0);
  const financialTotal = Object.values(formData.assets.financial).reduce((sum, value) => sum + value, 0);
  const insuranceTotal = Object.values(formData.assets.insurance).reduce((sum, value) => sum + value, 0);
  const businessTotal = Object.values(formData.assets.business).reduce((sum, value) => sum + value, 0);
  const movablesTotal = Object.values(formData.assets.movables).reduce((sum, value) => sum + value, 0);
  const otherAssetsTotal = Object.values(formData.assets.other).reduce((sum, value) => sum + value, 0);

  // 채무 계산 - 중첩된 객체 구조 처리
  const funeralTotal = Object.values(formData.debts.funeral).reduce((sum, value) => sum + value, 0);
  const financialDebtTotal = Object.values(formData.debts.financial).reduce((sum, value) => sum + value, 0);
  const taxesTotal = Object.values(formData.debts.taxes).reduce((sum, value) => sum + value, 0);
  const otherDebtsTotal = Object.values(formData.debts.other).reduce((sum, value) => sum + value, 0);

  // 세액공제 계산
  const giftTaxCredit = formData.taxCredits.giftTaxCredit ? 100000000 : 0; // 증여세액공제 1억원
  const foreignTaxCredit = formData.taxCredits.foreignTaxCredit && formData.taxCredits.foreignTaxCreditAmount 
    ? formData.taxCredits.foreignTaxCreditAmount : 0;
  const shortTermCredit = formData.taxCredits.shortTermReinheritanceCredit && formData.taxCredits.shortTermReinheritanceCreditAmount
    ? formData.taxCredits.shortTermReinheritanceCreditAmount : 0;
  const totalTaxCredits = giftTaxCredit + foreignTaxCredit + shortTermCredit;

  // 공제 계산 (2025년 법령 기준)
  const basicDeduction = 50000000 * formData.heirsCount; // 기초공제: 5천만원 × 상속인 수
  const lumpSumDeduction = formData.deductions.basic ? Math.max(200000000, basicDeduction) : 0; // 일괄공제: 2억원과 기초공제 중 큰 금액
  const spouseDeduction = formData.deductions.spouse ? Math.max(500000000, basicDeduction) : 0; // 배우자공제: 최소 5억원 보장
  const disabledDeduction = formData.deductions.disabled ? 10000000 * 10 * formData.disabledCount : 0; // 장애인공제: 1천만원 × 10년 × 장애인 수
  const minorDeduction = formData.deductions.minor ? 10000000 * 10 * formData.minorChildrenCount : 0; // 미성년자공제: 1천만원 × 10년 × 미성년자 수
  const elderlyDeduction = formData.deductions.elderly ? 50000000 * formData.elderlyCount : 0; // 연로자공제: 5천만원 × 연로자 수
  const financialAssetDeduction = formData.deductions.financialAsset ? financialTotal * 0.2 : 0; // 금융재산공제: 20%
  const cohabitingHouseDeduction = formData.deductions.cohabitingHouse ? 600000000 : 0; // 동거주택공제: 최대 6억원
  
  // 총 공제액: 기초공제/일괄공제/배우자공제 중 하나 + 인적공제들 + 기타공제들
  let totalDeductions = 0;
  if (formData.deductions.spouse && formData.hasSpouse) {
    totalDeductions = spouseDeduction; // 배우자공제 선택
  } else if (formData.deductions.basic) {
    totalDeductions = lumpSumDeduction; // 일괄공제 선택
  } else {
    totalDeductions = basicDeduction; // 기초공제만
  }
  totalDeductions += disabledDeduction + minorDeduction + elderlyDeduction + financialAssetDeduction + cohabitingHouseDeduction;

  return (
    <div id="tax-report" style={{ 
      backgroundColor: '#ffffff', 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      lineHeight: '1.6'
    }}>
      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #2563eb', paddingBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          margin: '0 0 8px 0',
          color: '#1e40af'
        }}>
          상속세 신고서
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280', 
          margin: '0'
        }}>
          TaxSimp 상속세 계산 결과
        </p>
      </div>

      {/* 기본 정보 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          borderBottom: '2px solid #d1d5db', 
          paddingBottom: '8px',
          color: '#000000'
        }}>
          1. 기본 정보
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '16px',
          backgroundColor: '#f9fafb',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ padding: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>피상속인</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>피상속인</div>
          </div>
          <div style={{ padding: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>사망일</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>{formData.deathDate}</div>
          </div>
          <div style={{ padding: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>상속인 수</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>{formData.heirsCount}명</div>
          </div>
        </div>
      </div>

      {/* 재산 내역 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          borderBottom: '2px solid #d1d5db', 
          paddingBottom: '8px',
          color: '#000000'
        }}>
          2. 재산 내역
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', color: '#000000', fontWeight: 'bold' }}>재산 종류</th>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#000000', fontWeight: 'bold' }}>금액 (원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>부동산</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(realEstateTotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>금융자산</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(financialTotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>보험</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(insuranceTotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>사업자산</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(businessTotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>동산</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(movablesTotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>기타 재산</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(otherAssetsTotal)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#dbeafe' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', fontWeight: 'bold', color: '#000000' }}>총 재산가액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#1d4ed8' }}>
                {formatCurrency(calculationResult.totalAssets)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 채무 내역 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          borderBottom: '2px solid #d1d5db', 
          paddingBottom: '8px',
          color: '#000000'
        }}>
          3. 채무 내역
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', color: '#000000', fontWeight: 'bold' }}>채무 종류</th>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#000000', fontWeight: 'bold' }}>금액 (원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>장례비</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(funeralTotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>금융채무</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(financialDebtTotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>세금 미납액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(taxesTotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>기타 채무</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(otherDebtsTotal)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#fef2f2' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', fontWeight: 'bold', color: '#000000' }}>총 채무액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }}>
                {formatCurrency(calculationResult.totalDebts)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 상속세 계산 과정 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          borderBottom: '2px solid #d1d5db', 
          paddingBottom: '8px',
          color: '#000000'
        }}>
          4. 상속세 계산 과정
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: '600', color: '#000000', width: '50%' }}>총 재산가액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(calculationResult.totalAssets)}원
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: '600', color: '#000000' }}>총 채무액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#dc2626' }}>
                -{formatCurrency(calculationResult.totalDebts)}원
              </td>
            </tr>
            <tr style={{ backgroundColor: '#dbeafe' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: 'bold', color: '#000000' }}>과세가액 (총재산 - 채무)</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#1d4ed8' }}>
                {formatCurrency(calculationResult.netAssets)}원
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: '600', color: '#000000' }}>총 공제액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#16a34a' }}>
                -{formatCurrency(totalDeductions)}원
              </td>
            </tr>
            <tr style={{ backgroundColor: '#fef3c7' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: 'bold', color: '#000000' }}>과세표준 (과세가액 - 공제액)</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#d97706' }}>
                {formatCurrency(calculationResult.taxableAmount)}원
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: '600', color: '#000000' }}>적용 세율</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#000000' }}>
                {(calculationResult.taxRate * 100).toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: '600', color: '#000000' }}>산출세액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(calculationResult.calculatedTax)}원
              </td>
            </tr>
            {totalTaxCredits > 0 && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: '600', color: '#000000' }}>세액공제</td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#16a34a' }}>
                  -{formatCurrency(totalTaxCredits)}원
                </td>
              </tr>
            )}
            <tr style={{ backgroundColor: '#dcfce7' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: 'bold', fontSize: '18px', color: '#000000' }}>최종 상속세액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#16a34a' }}>
                {formatCurrency(calculationResult.finalTax)}원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 공제 내역 상세 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          borderBottom: '2px solid #d1d5db', 
          paddingBottom: '8px',
          color: '#000000'
        }}>
          5. 공제 내역 상세
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', color: '#000000', fontWeight: 'bold' }}>공제 종류</th>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'center', color: '#000000', fontWeight: 'bold' }}>적용 여부</th>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#000000', fontWeight: 'bold' }}>공제액 (원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>기초공제</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#000000' }}>✓</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(200000000)}
              </td>
            </tr>
            {formData.deductions.basic && !formData.deductions.spouse && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>일괄공제 (5억원)</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#16a34a' }}>✓</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(500000000)}
                </td>
              </tr>
            )}
            {formData.deductions.spouse && formData.hasSpouse && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>배우자공제 (최대 30억원)</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#16a34a' }}>✓</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(600000000)}
                </td>
              </tr>
            )}
            {formData.deductions.disabled && formData.disabledCount > 0 && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>장애인공제 ({formData.disabledCount}명)</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#16a34a' }}>✓</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(100000000 * formData.disabledCount)}
                </td>
              </tr>
            )}
            {formData.deductions.minor && formData.minorChildrenCount > 0 && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>미성년공제 ({formData.minorChildrenCount}명)</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#16a34a' }}>✓</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(100000000 * formData.minorChildrenCount)}
                </td>
              </tr>
            )}
            {formData.deductions.elderly && formData.elderlyCount > 0 && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>연로자공제 ({formData.elderlyCount}명)</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#16a34a' }}>✓</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(50000000 * formData.elderlyCount)}
                </td>
              </tr>
            )}
            <tr style={{ backgroundColor: '#f0fdf4' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', fontWeight: 'bold', color: '#000000' }}>총 공제액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#16a34a', fontWeight: 'bold' }}>-</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>
                {formatCurrency(totalDeductions)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 세액공제 내역 */}
      {totalTaxCredits > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '16px', 
            borderBottom: '2px solid #d1d5db', 
            paddingBottom: '8px',
            color: '#000000'
          }}>
            6. 세액공제 내역
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', color: '#000000', fontWeight: 'bold' }}>세액공제 종류</th>
                <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#000000', fontWeight: 'bold' }}>공제액 (원)</th>
              </tr>
            </thead>
            <tbody>
              {formData.taxCredits.giftTaxCredit && (
                <tr>
                  <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>증여세액공제</td>
                  <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                    {formatCurrency(giftTaxCredit)}
                  </td>
                </tr>
              )}
              {formData.taxCredits.foreignTaxCredit && foreignTaxCredit > 0 && (
                <tr>
                  <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>외국세액공제</td>
                  <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                    {formatCurrency(foreignTaxCredit)}
                  </td>
                </tr>
              )}
              {formData.taxCredits.shortTermReinheritanceCredit && shortTermCredit > 0 && (
                <tr>
                  <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>단기재상속세액공제</td>
                  <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                    {formatCurrency(shortTermCredit)}
                  </td>
                </tr>
              )}
              <tr style={{ backgroundColor: '#f0fdf4' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', fontWeight: 'bold', color: '#000000' }}>총 세액공제</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>
                  {formatCurrency(totalTaxCredits)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 상속인별 세액 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          borderBottom: '2px solid #d1d5db', 
          paddingBottom: '8px',
          color: '#000000'
        }}>
          {totalTaxCredits > 0 ? '7' : '6'}. 상속인별 세액
        </h2>
        <div style={{ 
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>상속인 수</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>{formData.heirsCount}명</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>상속인별 세액</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>
                {formatCurrency(calculationResult.taxPerHeir)}원
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div style={{ 
        marginTop: '40px', 
        paddingTop: '20px', 
        borderTop: '2px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
          본 계산서는 TaxSimp에서 제공하는 상속세 추정 계산 결과입니다.
        </p>
        <p style={{ margin: '0', fontSize: '12px' }}>
          정확한 세액은 세무 전문가와 상담하시기 바랍니다.
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
          생성일: {new Date().toLocaleDateString('ko-KR')}
        </p>
      </div>
    </div>
  );
} 