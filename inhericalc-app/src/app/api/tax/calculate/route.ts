import { NextRequest, NextResponse } from 'next/server';
import { calculateInheritanceTax } from '@/lib/calculator';
import { InheritanceData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: InheritanceData = body;

    // 기본 유효성 검사
    if (!data.deathDate || !data.deceasedName || data.heirsCount <= 0) {
      return NextResponse.json(
        { error: '필수 입력 항목이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 재산 가액 검증 - 중첩된 객체 구조 처리
    const calculateTotalAssets = (assets: InheritanceData['assets']): number => {
      const realEstateTotal = Object.values(assets.realEstate).reduce((sum, value) => sum + value, 0);
      const financialTotal = Object.values(assets.financial).reduce((sum, value) => sum + value, 0);
      const insuranceTotal = Object.values(assets.insurance).reduce((sum, value) => sum + value, 0);
      const businessTotal = Object.values(assets.business).reduce((sum, value) => sum + value, 0);
      const movablesTotal = Object.values(assets.movables).reduce((sum, value) => sum + value, 0);
      const otherTotal = Object.values(assets.other).reduce((sum, value) => sum + value, 0);
      
      return realEstateTotal + financialTotal + insuranceTotal + businessTotal + movablesTotal + otherTotal;
    };

    const totalAssets = calculateTotalAssets(data.assets);
    if (totalAssets < 0) {
      return NextResponse.json(
        { error: '재산 가액은 0 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 채무 검증 - 중첩된 객체 구조 처리
    const calculateTotalDebts = (debts: InheritanceData['debts']): number => {
      const funeralTotal = Object.values(debts.funeral).reduce((sum, value) => sum + value, 0);
      const financialTotal = Object.values(debts.financial).reduce((sum, value) => sum + value, 0);
      const taxesTotal = Object.values(debts.taxes).reduce((sum, value) => sum + value, 0);
      const otherTotal = Object.values(debts.other).reduce((sum, value) => sum + value, 0);
      
      return funeralTotal + financialTotal + taxesTotal + otherTotal;
    };

    const totalDebts = calculateTotalDebts(data.debts);
    if (totalDebts < 0) {
      return NextResponse.json(
        { error: '채무는 0 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 상속세 계산
    const result = calculateInheritanceTax(data);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('상속세 계산 오류:', error);
    return NextResponse.json(
      { error: '상속세 계산 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 