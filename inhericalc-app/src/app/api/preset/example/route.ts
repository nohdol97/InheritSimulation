import { NextResponse } from 'next/server';
import { presetExamples } from '@/lib/presets';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: presetExamples,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('샘플 데이터 조회 오류:', error);
    return NextResponse.json(
      { error: '샘플 데이터 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 