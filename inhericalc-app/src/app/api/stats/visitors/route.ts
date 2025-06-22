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

    // 방문자 통계 조회 (실제 DB 함수 호출)
    const { data: stats, error } = await supabase.rpc('get_visitor_stats', {
      days_back: daysBack
    });

    if (error) {
      console.error('방문자 통계 조회 오류:', error);
      
      // 오류 발생 시 임시 데이터 반환
      const today = new Date().toISOString().split('T')[0];
      return NextResponse.json({
        success: true,
        data: {
          stats: [],
          today: {
            date: today,
            dailyVisitors: 0,
            totalVisitors: 0
          }
        }
      });
    }

    // 오늘 방문자 수와 총 방문자 수 계산
    const today = new Date().toISOString().split('T')[0];
    const todayStats = stats?.find((stat: { visit_date: string; daily_visitors: number; total_visitors: number }) => stat.visit_date === today);
    
    const totalVisitors = todayStats?.total_visitors || 0;
    const dailyVisitors = todayStats?.daily_visitors || 0;

    console.log('방문자 통계 조회 성공:', { todayStats, totalStats: stats?.length });

    return NextResponse.json({
      success: true,
      data: {
        stats: stats || [],
        today: {
          date: today,
          dailyVisitors,
          totalVisitors
        }
      }
    });

  } catch (error) {
    console.error('방문자 통계 조회 API 오류:', error);
    
    // 오류 발생 시에도 임시 데이터 반환
    const today = new Date().toISOString().split('T')[0];
    return NextResponse.json({
      success: true,
      data: {
        stats: [],
        today: {
          date: today,
          dailyVisitors: 0,
          totalVisitors: 0
        }
      }
    });
  }
} 