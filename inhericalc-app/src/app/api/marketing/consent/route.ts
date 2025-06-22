import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('=== 마케팅 동의 API 시작 ===');
  
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    console.log('Supabase 클라이언트 생성 완료');
    
    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('인증 확인 결과:', { user: user?.id, authError });
    
    if (authError || !user) {
      console.error('인증 오류:', authError);
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { consent } = await request.json();
    console.log('요청 데이터:', { consent, userId: user.id });
    
    if (typeof consent !== 'boolean') {
      return NextResponse.json(
        { error: '잘못된 요청입니다.' },
        { status: 400 }
      );
    }

    // 테이블 존재 여부 확인
    const { data: tables, error: tableError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    console.log('테이블 확인 결과:', { tables, tableError });

    // 먼저 사용자 프로필이 존재하는지 확인
    const { data: existingProfile, error: selectError } = await supabase
      .from('user_profiles')
      .select('user_id, agree_marketing')
      .eq('user_id', user.id)
      .maybeSingle(); // single() 대신 maybeSingle() 사용

    console.log('프로필 조회 결과:', { existingProfile, selectError });

    if (selectError) {
      console.error('프로필 조회 오류:', selectError);
      return NextResponse.json(
        { error: `프로필 조회에 실패했습니다: ${selectError.message}` },
        { status: 500 }
      );
    }

    if (!existingProfile) {
      console.log('프로필이 존재하지 않음, 새로 생성');
      // 프로필이 존재하지 않으면 생성
      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          name: '사용자',
          phone: '',
          region: '',
          agree_terms: false,
          agree_privacy: false,
          agree_marketing: consent
        })
        .select()
        .single();

      console.log('프로필 생성 결과:', { insertData, insertError });

      if (insertError) {
        console.error('프로필 생성 오류:', insertError);
        return NextResponse.json(
          { error: `프로필 생성에 실패했습니다: ${insertError.message}` },
          { status: 500 }
        );
      }
    } else {
      console.log('기존 프로필 업데이트');
      // 프로필이 존재하면 마케팅 동의 상태만 업데이트
      const { data: updateData, error: updateError } = await supabase
        .from('user_profiles')
        .update({ agree_marketing: consent })
        .eq('user_id', user.id)
        .select()
        .single();

      console.log('프로필 업데이트 결과:', { updateData, updateError });

      if (updateError) {
        console.error('마케팅 동의 업데이트 오류:', updateError);
        return NextResponse.json(
          { error: `업데이트에 실패했습니다: ${updateError.message}` },
          { status: 500 }
        );
      }
    }

    console.log('=== 마케팅 동의 API 성공 ===');
    return NextResponse.json({ 
      success: true, 
      message: consent ? '마케팅 동의가 완료되었습니다.' : '마케팅 동의가 철회되었습니다.'
    });

  } catch (error) {
    console.error('마케팅 동의 API 오류:', error);
    return NextResponse.json(
      { error: `서버 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
} 