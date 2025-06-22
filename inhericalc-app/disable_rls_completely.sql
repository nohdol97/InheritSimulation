-- =====================================================
-- RLS 완전 비활성화 스크립트
-- 이 스크립트는 user_profiles 테이블의 RLS를 완전히 비활성화합니다
-- =====================================================

-- 1. 모든 정책 삭제
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

-- 2. RLS 완전 비활성화
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 3. 테이블 구조 확인
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 4. 현재 테이블 상태 확인
SELECT 
    'user_profiles table status:' as info,
    COUNT(*) as total_rows,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as rows_with_user_id,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as rows_without_user_id
FROM user_profiles;

-- 5. RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 6. 정책 상태 확인 (모두 삭제되었는지 확인)
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 완료 메시지
SELECT 'RLS가 완전히 비활성화되었습니다. 이제 모든 인증된 사용자가 프로필에 접근할 수 있습니다.' as "완료"; 