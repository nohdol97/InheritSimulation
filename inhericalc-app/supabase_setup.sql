-- =====================================================
-- InheritCalculator Supabase V2 설정 스크립트
-- 1. 테이블 스키마 수정
-- 2. 포인트 지급 트리거 설정
-- =====================================================

-- 1. user_profiles 테이블 수정
-- 기존 테이블이 있다면, points 컬럼 추가 및 agree_privacy_optional 컬럼 삭제
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
  DROP COLUMN IF EXISTS agree_privacy_optional;

-- 2. 포인트 지급 및 프로필 생성을 위한 함수 정의
-- 이 함수는 새 사용자가 가입할 때 트리거됩니다.
-- 프로필을 생성하고, 마케팅 동의 시 5,000 포인트를 지급합니다.
create or replace function public.handle_new_user_and_points()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  marketing_agreed boolean;
  user_points integer;
begin
  -- 마케팅 동의 여부 확인 (null일 경우 false로 처리)
  marketing_agreed := (new.raw_user_meta_data->>'agreeMarketing')::boolean;
  IF marketing_agreed IS NULL THEN
    marketing_agreed := false;
  END IF;

  -- 마케팅 동의 시 5000 포인트, 미동의 시 0 포인트 설정
  if marketing_agreed then
    user_points := 5000;
  else
    user_points := 0;
  end if;

  -- user_profiles 테이블에 데이터 삽입
  insert into public.user_profiles (user_id, email, name, phone, region, agree_terms, agree_privacy, agree_marketing, points)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'region',
    (new.raw_user_meta_data->>'agreeTerms')::boolean,
    (new.raw_user_meta_data->>'agreePrivacy')::boolean,
    marketing_agreed,
    user_points
  );
  return new;
end;
$$;

-- 3. 기존 트리거 삭제 및 신규 트리거 생성
-- 새 사용자가 생성될 때 위 함수를 호출하는 트리거입니다.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_and_points();

-- 4. RLS 정책 확인 (필요시 재설정)
-- user_profiles 테이블에 대한 기존 정책이 없다면 추가합니다.
-- (기존 정책이 있다면 이 부분은 생략 가능)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can insert own profile' AND polrelid = 'public.user_profiles'::regclass) THEN
    CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can view own profile' AND polrelid = 'public.user_profiles'::regclass) THEN
    CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can update own profile' AND polrelid = 'public.user_profiles'::regclass) THEN
    CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END;
$$;

-- 5. 스키마 권한 부여 (필요시)
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT SELECT ON auth.users TO postgres;

-- 설정 완료 메시지
SELECT '포인트 시스템 및 마케팅 동의 통합 설정이 완료되었습니다.' as "Status"; 