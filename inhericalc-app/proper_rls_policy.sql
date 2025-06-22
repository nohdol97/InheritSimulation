-- =====================================================
-- 올바른 RLS 정책 설정 스크립트
-- 보안을 유지하면서 user_profiles 테이블에 대한 접근을 허용합니다
-- =====================================================

-- 1. 기존 정책들 모두 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_all_access" ON user_profiles;

-- 2. RLS 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. 올바른 정책 생성
-- 사용자는 자신의 프로필만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. 테이블 구조 확인 및 수정
-- user_id 컬럼이 NOT NULL인지 확인
DO $$
BEGIN
    -- user_id가 NULL인 행이 있다면 삭제
    DELETE FROM user_profiles WHERE user_id IS NULL;
    
    -- user_id 컬럼을 NOT NULL로 변경 (이미 NOT NULL이면 오류 발생하지 않음)
    ALTER TABLE user_profiles ALTER COLUMN user_id SET NOT NULL;
    
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'user_id 컬럼 수정 중 오류 발생: %', SQLERRM;
END $$;

-- 5. 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 6. RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 완료 메시지
SELECT 'RLS 정책이 올바르게 설정되었습니다. 사용자는 자신의 프로필만 접근할 수 있습니다.' as "완료"; 