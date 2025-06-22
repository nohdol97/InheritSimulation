-- 1. 임시로 RLS 비활성화
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. 기존 정책들 모두 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete access for users based on user_id" ON user_profiles;

-- 3. 새로운 정책 생성 (더 관대한 정책)
CREATE POLICY "Allow authenticated users to view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- 4. RLS 다시 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. 디버깅을 위한 테스트 쿼리 (실행 후 결과 확인)
SELECT 
    'Current session info:' as info,
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 6. 현재 사용자의 프로필 존재 여부 확인
SELECT 
    'Profile check:' as info,
    user_id,
    email,
    name,
    agree_marketing
FROM user_profiles 
WHERE user_id = auth.uid(); 