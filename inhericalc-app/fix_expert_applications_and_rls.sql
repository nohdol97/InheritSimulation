-- 1. expert_applications 테이블에 user_id 컬럼 추가
ALTER TABLE expert_applications 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 2. 기존 정책들을 먼저 삭제 (존재하지 않아도 오류 발생하지 않음)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own calculations" ON calculation_records;
DROP POLICY IF EXISTS "Users can insert own calculations" ON calculation_records;
DROP POLICY IF EXISTS "Users can update own calculations" ON calculation_records;
DROP POLICY IF EXISTS "Users can delete own calculations" ON calculation_records;

DROP POLICY IF EXISTS "Users can view own applications" ON expert_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON expert_applications;
DROP POLICY IF EXISTS "Users can update own applications" ON expert_applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON expert_applications;

-- 3. user_profiles 테이블에 대한 RLS 정책 생성
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- 4. calculation_records 테이블에 대한 RLS 정책
CREATE POLICY "Users can view own calculations" ON calculation_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations" ON calculation_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations" ON calculation_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations" ON calculation_records
    FOR DELETE USING (auth.uid() = user_id);

-- 5. expert_applications 테이블에 대한 RLS 정책
CREATE POLICY "Users can view own applications" ON expert_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON expert_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON expert_applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON expert_applications
    FOR DELETE USING (auth.uid() = user_id);

-- 6. RLS가 활성화되어 있는지 확인하고 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_applications ENABLE ROW LEVEL SECURITY; 