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

  // 공제 계산
  const basicDeduction = formData.deductions.basic ? 200000000 : 0;
  const spouseDeduction = formData.deductions.spouse ? 600000000 : 0;
  const disabledDeduction = formData.deductions.disabled ? 100000000 : 0;
  const minorDeduction = formData.deductions.minor ? 100000000 : 0;

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
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>{formData.deceasedName}</div>
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

      {/* 계산 결과 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          borderBottom: '2px solid #d1d5db', 
          paddingBottom: '8px',
          color: '#000000'
        }}>
          4. 상속세 계산
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
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: 'bold', color: '#000000' }}>순 재산가액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#1d4ed8' }}>
                {formatCurrency(calculationResult.netAssets)}원
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: '600', color: '#000000' }}>공제액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#16a34a' }}>
                -{formatCurrency(calculationResult.totalDeductions)}원
              </td>
            </tr>
            <tr style={{ backgroundColor: '#fef3c7' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '12px', fontWeight: 'bold', color: '#000000' }}>과세표준</td>
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
          5. 공제 내역
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left', color: '#000000', fontWeight: 'bold' }}>공제 종류</th>
              <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'right', color: '#000000', fontWeight: 'bold' }}>공제액 (원)</th>
            </tr>
          </thead>
          <tbody>
            {formData.deductions.basic && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>일괄공제</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(basicDeduction)}
                </td>
              </tr>
            )}
            {formData.deductions.spouse && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>배우자공제</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(spouseDeduction)}
                </td>
              </tr>
            )}
            {formData.deductions.disabled && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>장애인공제</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(disabledDeduction)}
                </td>
              </tr>
            )}
            {formData.deductions.minor && (
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>미성년공제</td>
                <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#000000' }}>
                  {formatCurrency(minorDeduction)}
                </td>
              </tr>
            )}
            <tr style={{ backgroundColor: '#f0fdf4' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', fontWeight: 'bold', color: '#000000' }}>총 공제액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' }}>
                {formatCurrency(calculationResult.totalDeductions)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
          6. 상속인별 세액
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