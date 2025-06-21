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

    // 재산 가액 검증
    const totalAssets = Object.values(data.assets).reduce((sum, value) => sum + value, 0);
    if (totalAssets < 0) {
      return NextResponse.json(
        { error: '재산 가액은 0 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 채무 검증
    const totalDebts = Object.values(data.debts).reduce((sum, value) => sum + value, 0);
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