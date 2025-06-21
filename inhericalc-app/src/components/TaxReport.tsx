'use client';

import { InheritanceData, TaxCalculationResult } from '@/types';
import { formatCurrency } from '@/lib/calculator';

interface TaxReportProps {
  formData: InheritanceData;
  calculationResult: TaxCalculationResult;
}

export default function TaxReport({ formData, calculationResult }: TaxReportProps) {
  const currentDate = new Date().toLocaleDateString('ko-KR');
  
  return (
    <div 
      className="max-w-4xl mx-auto" 
      style={{ 
        fontSize: '12px', 
        lineHeight: '1.4',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '32px'
      }}
    >
      {/* 신고서 제목 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#000000' }}>
          상속세 과세표준 신고서
        </h1>
        <p style={{ fontSize: '14px', color: '#666666' }}>국세청 제출용</p>
      </div>

      {/* 기본 정보 */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          borderBottom: '2px solid #d1d5db', 
          paddingBottom: '8px',
          color: '#000000'
        }}>
          1. 기본 정보
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#000000' }}>피상속인 성명:</span>
              <span style={{ 
                marginLeft: '8px', 
                borderBottom: '1px solid #d1d5db', 
                display: 'inline-block', 
                width: '128px', 
                textAlign: 'center',
                color: '#000000'
              }}>
                {formData.deceasedName || '___________'}
              </span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#000000' }}>사망일자:</span>
              <span style={{ 
                marginLeft: '8px', 
                borderBottom: '1px solid #d1d5db', 
                display: 'inline-block', 
                width: '128px', 
                textAlign: 'center',
                color: '#000000'
              }}>
                {formData.deathDate || '___________'}
              </span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#000000' }}>상속인 수:</span>
              <span style={{ 
                marginLeft: '8px', 
                borderBottom: '1px solid #d1d5db', 
                display: 'inline-block', 
                width: '64px', 
                textAlign: 'center',
                color: '#000000'
              }}>
                {formData.heirsCount || '___'}
              </span>명
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#000000' }}>신고일자:</span>
              <span style={{ 
                marginLeft: '8px', 
                borderBottom: '1px solid #d1d5db', 
                display: 'inline-block', 
                width: '128px', 
                textAlign: 'center',
                color: '#000000'
              }}>
                {currentDate}
              </span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', color: '#000000' }}>신고인:</span>
              <span style={{ 
                marginLeft: '8px', 
                borderBottom: '1px solid #d1d5db', 
                display: 'inline-block', 
                width: '128px', 
                textAlign: 'center',
                color: '#000000'
              }}>
                ___________
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 재산 내역 */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', 
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
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', color: '#000000' }}>재산 종류</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>금액 (원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>부동산</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.assets?.realEstate || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>예금</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.assets?.deposits || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>주식</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.assets?.stocks || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>보험금</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.assets?.insurance || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>사업체</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.assets?.business || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>차량</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.assets?.vehicles || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>기타 재산</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.assets?.other || 0)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: 'bold', color: '#000000' }}>총 재산가액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#000000' }}>
                {formatCurrency(calculationResult.totalAssets)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 채무 내역 */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', 
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
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', color: '#000000' }}>채무 종류</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>금액 (원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>장례비</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.debts?.funeral || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>금융채무</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.debts?.financial || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>세금 미납액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.debts?.taxes || 0)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>기타 채무</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.debts?.other || 0)}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: 'bold', color: '#000000' }}>총 채무액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#000000' }}>
                {formatCurrency(calculationResult.totalDebts)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 계산 결과 */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', 
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
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: '600', color: '#000000' }}>총 재산가액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(calculationResult.totalAssets)}원
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: '600', color: '#000000' }}>총 채무액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#dc2626' }}>
                -{formatCurrency(calculationResult.totalDebts)}원
              </td>
            </tr>
            <tr style={{ backgroundColor: '#dbeafe' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: 'bold', color: '#000000' }}>순 재산가액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#000000' }}>
                {formatCurrency(calculationResult.netAssets)}원
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: '600', color: '#000000' }}>공제액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#16a34a' }}>
                -{formatCurrency(calculationResult.totalDeductions)}원
              </td>
            </tr>
            <tr style={{ backgroundColor: '#fef3c7' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: 'bold', color: '#000000' }}>과세표준</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#000000' }}>
                {formatCurrency(calculationResult.taxableAmount)}원
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: '600', color: '#000000' }}>적용 세율</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {(calculationResult.taxRate * 100).toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: '600', color: '#000000' }}>산출세액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(calculationResult.calculatedTax)}원
              </td>
            </tr>
            <tr style={{ backgroundColor: '#dcfce7' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: 'bold', fontSize: '18px', color: '#000000' }}>최종 상속세액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#16a34a' }}>
                {formatCurrency(calculationResult.finalTax)}원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 공제 내역 상세 */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', 
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
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left', color: '#000000' }}>공제 종류</th>
              <th style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>공제액 (원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>기초공제</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>200,000,000</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>인적공제 (상속인 수 × 5천만원)</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formatCurrency(formData.heirsCount * 50000000)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', color: '#000000' }}>배우자공제</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', color: '#000000' }}>
                {formData.deductions?.spouse ? formatCurrency(Math.min(calculationResult.netAssets * 0.3, 3000000000)) : '0'}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', fontWeight: 'bold', color: '#000000' }}>총 공제액</td>
              <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#000000' }}>
                {formatCurrency(calculationResult.totalDeductions)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 서명란 */}
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #d1d5db' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ marginBottom: '16px', color: '#000000' }}>위와 같이 신고합니다.</p>
            <p style={{ fontSize: '14px', color: '#666666' }}>
              신고일: {currentDate}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #d1d5db', width: '128px', marginBottom: '8px', paddingBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666666' }}>신고인 서명</span>
            </div>
            <div style={{ width: '128px', height: '32px' }}></div>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: '#f9fafb', 
        border: '1px solid #e5e7eb', 
        borderRadius: '4px' 
      }}>
        <p style={{ fontSize: '12px', color: '#666666' }}>
          <strong>주의사항:</strong> 본 신고서는 InheriCalc 상속세 계산기를 통해 자동 생성된 것으로, 
          실제 국세청 제출 전 세무 전문가의 검토를 받으시기 바랍니다. 
          정확한 세액 계산을 위해서는 국세청 홈텍스 또는 세무서에 문의하시기 바랍니다.
        </p>
      </div>
    </div>
  );
} 