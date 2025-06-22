-- user_profiles 테이블에 대한 RLS 정책 설정

-- 1. 사용자가 자신의 프로필을 조회할 수 있는 정책
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- 2. 사용자가 자신의 프로필을 생성할 수 있는 정책
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. 사용자가 자신의 프로필을 수정할 수 있는 정책
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. 사용자가 자신의 프로필을 삭제할 수 있는 정책 (선택사항)
CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- calculation_records 테이블에 대한 RLS 정책도 추가
CREATE POLICY "Users can view own calculations" ON calculation_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations" ON calculation_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations" ON calculation_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations" ON calculation_records
    FOR DELETE USING (auth.uid() = user_id);

-- expert_applications 테이블에 대한 RLS 정책도 추가
CREATE POLICY "Users can view own applications" ON expert_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON expert_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON expert_applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON expert_applications
    FOR DELETE USING (auth.uid() = user_id); 