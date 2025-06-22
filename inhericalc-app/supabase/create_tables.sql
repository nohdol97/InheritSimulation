-- 간단한 테이블 생성 스크립트
-- Supabase SQL Editor에서 직접 실행하세요

-- 1. user_profiles 테이블 생성
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '사용자',
  phone TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  agree_terms BOOLEAN DEFAULT FALSE,
  agree_privacy BOOLEAN DEFAULT FALSE,
  agree_marketing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. calculation_records 테이블 생성
CREATE TABLE IF NOT EXISTS calculation_records (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL,
  calculation_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS (Row Level Security) 설정
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_records ENABLE ROW LEVEL SECURITY;

-- 4. user_profiles 테이블 정책 설정
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. calculation_records 테이블 정책 설정
DROP POLICY IF EXISTS "Users can view own calculation records" ON calculation_records;
DROP POLICY IF EXISTS "Users can insert own calculation records" ON calculation_records;
DROP POLICY IF EXISTS "Users can delete own calculation records" ON calculation_records;

CREATE POLICY "Users can view own calculation records" ON calculation_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculation records" ON calculation_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculation records" ON calculation_records
  FOR DELETE USING (auth.uid() = user_id);

-- 6. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_calculation_records_created_at ON calculation_records(created_at);

-- 7. 확인 쿼리
SELECT 'user_profiles' as table_name, COUNT(*) as row_count FROM user_profiles
UNION ALL
SELECT 'calculation_records' as table_name, COUNT(*) as row_count FROM calculation_records; 