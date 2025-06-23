import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
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

    // 세션 ID 생성 (쿠키에서 가져오거나 새로 생성)
    let sessionId = request.cookies.get('visitor_session_id')?.value;
    
    if (!sessionId) {
      sessionId = uuidv4();
    }

    // 방문자 통계 업데이트 (실제 DB 함수 호출)
    const { data, error } = await supabase.rpc('update_visitor_stats', {
      session_id_param: sessionId
    });

    if (error) {
      console.error('방문자 통계 업데이트 오류:', error);
      // 오류 발생 시에도 성공으로 처리 (사용자 경험 향상)
      const response = NextResponse.json({ success: true });
      response.cookies.set('visitor_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30일
      });
      return response;
    }

    console.log('방문자 통계 업데이트 성공:', data);

    // 응답에 세션 ID 쿠키 설정
    const response = NextResponse.json({ 
      success: true,
      data: data || {}
    });
    
    response.cookies.set('visitor_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30일
    });

    return response;

  } catch (error) {
    console.error('방문자 통계 API 오류:', error);
    
    // 오류 발생 시에도 성공으로 처리
    const response = NextResponse.json({ success: true });
    
    // 세션 ID 쿠키는 설정
    let sessionId = request.cookies.get('visitor_session_id')?.value;
    if (!sessionId) {
      sessionId = uuidv4();
      response.cookies.set('visitor_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30일
      });
    }
    
    return response;
  }
}

export async function GET(request: NextRequest) {
  console.log('=== 방문자 통계 조회 API 시작 ===');
  
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

    // URL 파라미터에서 일수 가져오기 (기본값: 7일)
    const { searchParams } = new URL(request.url);
    const daysBack = parseInt(searchParams.get('days') || '7');

    console.log('조회 파라미터:', { daysBack });

    // 방문자 통계 조회 (실제 DB 함수 호출)
    const { data: stats, error } = await supabase.rpc('get_visitor_stats', {
      days_back: daysBack
    });

    console.log('DB 함수 호출 결과:', { 
      statsLength: stats?.length, 
      error: error?.message,
      firstStat: stats?.[0],
      fullError: error,
      rawStats: stats
    });

    if (error) {
      console.error('방문자 통계 조회 오류:', error);
      console.error('오류 상세:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // 오류 발생 시에도 기본 구조 반환
      const today = new Date().toISOString().split('T')[0];
      const fallbackData = {
        stats: [],
        today: {
          date: today,
          dailyVisitors: 0,
          totalVisitors: 0
        }
      };
      
      console.log('Fallback 데이터 반환:', fallbackData);
      
      return NextResponse.json({
        success: true,
        data: fallbackData,
        error: error.message
      });
    }

    // 오늘 방문자 수와 총 방문자 수 계산
    const today = new Date().toISOString().split('T')[0];
    console.log('오늘 날짜:', today);
    
    // stats 배열에서 오늘 데이터 찾기
    const todayStats = stats?.find((stat: { visit_date: string; daily_visitors: number; total_visitors: number }) => {
      const statDate = new Date(stat.visit_date).toISOString().split('T')[0];
      return statDate === today;
    });
    
    console.log('오늘 통계 데이터:', todayStats);
    
    // 총 방문자 수는 가장 최근 데이터의 total_visitors 사용
    const totalVisitors = stats && stats.length > 0 ? stats[0].total_visitors : 0;
    const dailyVisitors = todayStats?.daily_visitors || 0;

    console.log('계산된 결과:', { totalVisitors, dailyVisitors });

    const responseData = {
      stats: stats || [],
      today: {
        date: today,
        dailyVisitors,
        totalVisitors
      }
    };

    console.log('=== 방문자 통계 조회 성공 ===', responseData);

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('방문자 통계 조회 API 오류:', error);
    
    // 오류 발생 시에도 임시 데이터 반환
    const today = new Date().toISOString().split('T')[0];
    const errorData = {
      stats: [],
      today: {
        date: today,
        dailyVisitors: 0,
        totalVisitors: 0
      }
    };
    
    return NextResponse.json({
      success: true,
      data: errorData,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 