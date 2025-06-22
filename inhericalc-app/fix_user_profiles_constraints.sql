-- 1. 기존 RLS 정책들을 임시로 비활성화
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. user_profiles 테이블의 user_id 컬럼을 NOT NULL로 변경
-- 먼저 기존 NULL 값들을 처리 (있다면)
UPDATE user_profiles SET user_id = id::uuid WHERE user_id IS NULL;

-- user_id 컬럼을 NOT NULL로 변경
ALTER TABLE user_profiles ALTER COLUMN user_id SET NOT NULL;

-- 3. 기존 정책들을 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- 4. 새로운 RLS 정책 생성 (더 명확한 조건)
CREATE POLICY "Enable read access for users based on user_id" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for users based on user_id" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for users based on user_id" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for users based on user_id" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- 5. RLS 다시 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. 테스트용: 현재 사용자 정보 확인
SELECT 'Current auth.uid():', auth.uid();
SELECT 'User profiles with matching user_id:', count(*) FROM user_profiles WHERE user_id = auth.uid(); 