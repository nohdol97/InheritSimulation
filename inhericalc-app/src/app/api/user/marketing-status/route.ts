import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== 마케팅 상태 API 시작 ===');
  
  try {
    const cookieStore = await cookies();
    
    // 쿠키 정보 로깅
    const allCookies = cookieStore.getAll();
    console.log('모든 쿠키:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name);
            console.log(`쿠키 조회: ${name} = ${cookie ? '존재함' : '없음'}`);
            return cookie?.value;
          },
        },
      }
    );
    
    console.log('Supabase 클라이언트 생성 완료');
    
    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('인증 확인 결과:', { 
      userId: user?.id, 
      userEmail: user?.email,
      authError: authError?.message 
    });
    
    if (authError || !user) {
      console.error('인증 오류:', authError);
      return NextResponse.json(
        { error: '로그인이 필요합니다.', isLoggedIn: false },
        { status: 401 }
      );
    }

    // 사용자 프로필에서 마케팅 동의 상태 확인
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('agree_marketing')
      .eq('user_id', user.id)
      .single();

    console.log('프로필 조회 결과:', { profile, profileError });

    if (profileError) {
      console.error('프로필 조회 오류:', profileError);
      
      // 프로필이 존재하지 않는 경우 (PGRST116 오류)
      if (profileError.code === 'PGRST116') {
        console.log('프로필이 존재하지 않음');
        return NextResponse.json({ 
          isLoggedIn: true,
          marketingConsent: false,
          userId: user.id,
          profileExists: false
        });
      }
      
      return NextResponse.json(
        { error: '프로필 조회에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('=== 마케팅 상태 API 성공 ===');
    return NextResponse.json({ 
      isLoggedIn: true,
      marketingConsent: profile?.agree_marketing || false,
      userId: user.id,
      profileExists: true
    });

  } catch (error) {
    console.error('마케팅 상태 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 