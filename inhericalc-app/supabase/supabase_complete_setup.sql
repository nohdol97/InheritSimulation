-- =====================================================
-- InheritCalculator Supabase 완전 설정 스크립트
-- =====================================================

-- 1. 기존 테이블들 삭제 (있다면)
DROP TABLE IF EXISTS calculation_records CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. user_profiles 테이블 생성
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  region TEXT NOT NULL,
  agree_terms BOOLEAN DEFAULT FALSE,
  agree_privacy BOOLEAN DEFAULT FALSE,
  agree_privacy_optional BOOLEAN DEFAULT FALSE,
  agree_marketing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. calculation_records 테이블 생성
CREATE TABLE calculation_records (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL,
  calculation_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS (Row Level Security) 설정
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_records ENABLE ROW LEVEL SECURITY;

-- 5. user_profiles 테이블 정책 설정
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. calculation_records 테이블 정책 설정
CREATE POLICY "Users can view own calculation records" ON calculation_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculation records" ON calculation_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculation records" ON calculation_records
  FOR DELETE USING (auth.uid() = user_id);

-- 7. 인덱스 생성
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_calculation_records_created_at ON calculation_records(created_at);

-- 8. 테이블 생성 확인
SELECT 'user_profiles' as table_name, COUNT(*) as row_count FROM user_profiles
UNION ALL
SELECT 'calculation_records' as table_name, COUNT(*) as row_count FROM calculation_records; 