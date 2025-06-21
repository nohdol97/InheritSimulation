import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  try {
    console.log('=== 테스트 API 시작 ===');
    console.log('환경 변수 확인:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: '환경 변수가 설정되지 않았습니다.',
        supabaseUrl: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('Supabase 클라이언트 생성 완료');

    // 직접 테이블에 접근 시도
    console.log('테이블 접근 테스트 중...');
    const { data: testData, error: testError } = await supabase
      .from('expert_applications')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('테이블 접근 오류:', testError);
      
      // 테이블이 없다면 간단한 메시지 반환
      if (testError.code === 'PGRST116' || testError.message.includes('relation') || testError.message.includes('does not exist')) {
        return NextResponse.json({
          error: '테이블이 존재하지 않습니다.',
          suggestion: 'Supabase 대시보드에서 expert_applications 테이블을 생성해주세요.',
          sqlScript: `
CREATE TABLE expert_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  region VARCHAR(100) NOT NULL,
  profession VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE expert_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert expert applications" ON expert_applications
  FOR INSERT WITH CHECK (true);
          `,
          testError: testError
        }, { status: 404 });
      }
      
      return NextResponse.json({
        error: '테이블 접근 실패',
        details: testError
      }, { status: 500 });
    }

    console.log('테이블 접근 성공:', testData);

    // 테스트 데이터 삽입 시도
    console.log('테스트 데이터 삽입 중...');
    const testInsert = {
      name: '테스트',
      email: 'test@example.com',
      phone: '010-1234-5678',
      region: '서울특별시',
      profession: '세무사'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('expert_applications')
      .insert([testInsert])
      .select()
      .single();

    if (insertError) {
      console.error('테스트 삽입 오류:', insertError);
      return NextResponse.json({
        success: false,
        tableExists: true,
        testQuery: 'SUCCESS',
        testInsert: 'FAILED',
        insertError: insertError.message,
        message: '테이블은 존재하지만 삽입 권한이 없습니다.'
      });
    }

    console.log('테스트 삽입 성공:', insertData);

    // 테스트 데이터 삭제
    await supabase
      .from('expert_applications')
      .delete()
      .eq('email', 'test@example.com');

    return NextResponse.json({
      success: true,
      tableExists: true,
      testQuery: 'SUCCESS',
      testInsert: 'SUCCESS',
      message: '모든 테스트 통과! 전문가 신청 기능이 정상 작동합니다.'
    });

  } catch (error) {
    console.error('테스트 API 오류:', error);
    return NextResponse.json({
      error: '테스트 실패',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
} 