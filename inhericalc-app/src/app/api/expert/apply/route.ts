import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExpertApplicationFormData } from '@/types';

// 환경 변수 체크 (빌드 시점에 확인)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 디버깅을 위한 로그 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  console.log('Environment check:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'NOT SET');
}

// 서버 사이드에서 사용할 Supabase 클라이언트 (Service Role Key 사용)
let supabase: SupabaseClient | null = null;

// 환경 변수가 있을 때만 클라이언트 초기화
if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('Supabase client initialized successfully');
    }
  } catch (error) {
    console.error('Supabase 클라이언트 초기화 실패:', error);
    supabase = null;
  }
} else {
  console.error('Supabase 환경 변수 누락:', {
    url: !!supabaseUrl,
    serviceKey: !!supabaseServiceKey
  });
}

export async function POST(request: NextRequest) {
  console.log('=== 전문가 신청 API 호출 시작 ===');
  
  try {
    const body: ExpertApplicationFormData = await request.json();
    console.log('받은 데이터:', body);
    
    // 입력 데이터 검증
    const { name, email, phone, region, profession } = body;
    
    if (!name || !email || !phone || !region || !profession) {
      console.log('필수 필드 누락');
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('이메일 형식 오류:', email);
      return NextResponse.json(
        { error: '올바른 이메일 형식을 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 전화번호 형식 검증 (하이픈 제거 후 11자리 숫자인지 확인)
    const phoneNumbers = phone.replace(/[^0-9]/g, '');
    if (phoneNumbers.length !== 11 || !phoneNumbers.startsWith('010')) {
      console.log('전화번호 형식 오류:', phone, '→', phoneNumbers);
      return NextResponse.json(
        { error: '올바른 휴대폰 번호 형식을 입력해주세요. (010으로 시작하는 11자리)' },
        { status: 400 }
      );
    }

    // Supabase 설정 확인
    if (!supabase) {
      console.error('Supabase 클라이언트가 없습니다.');
      return NextResponse.json(
        { error: 'Supabase 설정 오류가 발생했습니다.' },
        { status: 503 }
      );
    }
    
    console.log('중복 신청 확인 중...');
    // 중복 신청 확인 (이메일 기준)
    const { data: existingApplication, error: checkError } = await supabase
      .from('expert_applications')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();
    
    if (checkError) {
      console.log('중복 확인 결과:', checkError.code, checkError.message);
      if (checkError.code !== 'PGRST116') { // PGRST116은 "not found" 에러
        console.error('중복 확인 오류:', checkError);
        return NextResponse.json(
          { error: '신청 처리 중 오류가 발생했습니다. (중복 확인 실패)' },
          { status: 500 }
        );
      }
    }
    
    if (existingApplication) {
      console.log('중복 신청 발견:', existingApplication);
      return NextResponse.json(
        { error: '이미 해당 이메일로 신청이 접수되었습니다.' },
        { status: 409 }
      );
    }
    
    console.log('데이터 저장 중...');
    // 전문가 신청 데이터 저장
    const { data, error } = await supabase
      .from('expert_applications')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          region: region.trim(),
          profession: profession.trim(),
          status: 'pending'
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('데이터 저장 오류:', error);
      return NextResponse.json(
        { error: '신청 처리 중 오류가 발생했습니다. (저장 실패)' },
        { status: 500 }
      );
    }
    
    console.log('저장 성공:', data);
    return NextResponse.json({
      success: true,
      message: '전문가 신청이 성공적으로 접수되었습니다. 검토 후 이메일로 연락드리겠습니다.',
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        status: data.status,
        created_at: data.created_at
      }
    });
    
  } catch (error) {
    console.error('전문가 신청 API 전체 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 