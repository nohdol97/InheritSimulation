import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { InheritanceData, TaxCalculationResult } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 클라이언트 사이드에서만 Supabase 클라이언트 생성
let supabase: SupabaseClient | null = null;

if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('Supabase 클라이언트 초기화 실패:', error);
  }
}

export { supabase };

// 계산 기록 저장
export async function saveCalculationRecord(userId: string, data: InheritanceData, result: TaxCalculationResult) {
  if (!supabase) {
    console.warn('Supabase 클라이언트가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
    return null;
  }
  
  try {
    const { data: record, error } = await supabase
      .from('calculation_records')
      .insert([
        {
          user_id: userId,
          input_data: data,
          calculation_result: result,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return record;
  } catch (error) {
    console.error('계산 기록 저장 오류:', error);
    throw error;
  }
}

// 사용자의 계산 기록 조회
export async function getCalculationRecords(userId: string) {
  if (!supabase) {
    console.warn('Supabase 클라이언트가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
    return [];
  }
  
  try {
    const { data: records, error } = await supabase
      .from('calculation_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return records || [];
  } catch (error) {
    console.error('계산 기록 조회 오류:', error);
    return [];
  }
}

// 사용자 인증 상태 확인 (더 안전한 버전)
export async function getCurrentUser() {
  if (!supabase) {
    console.warn('Supabase 클라이언트가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
    return null;
  }
  
  try {
    // 먼저 세션 확인
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('세션 조회 오류:', sessionError.message);
      return null;
    }
    
    if (!session) {
      // 세션이 없으면 null 반환 (에러가 아님)
      return null;
    }
    
    // 세션이 있으면 사용자 정보 반환
    return session.user;
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return null;
  }
}

// 로그인
export async function signIn(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
}

// 회원가입
export async function signUp(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
}

// Google로 로그인
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
  }
  
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // 인증 후 현재 페이지로 리디렉션
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    throw error;
  }
}

// Kakao로 로그인
export async function signInWithKakao() {
  if (!supabase) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
  }
  
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin,
        scopes: 'profile_image profile_nickname'
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error('Kakao 로그인 오류:', error);
    throw error;
  }
}

// 로그아웃
export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase 클라이언트가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
} 