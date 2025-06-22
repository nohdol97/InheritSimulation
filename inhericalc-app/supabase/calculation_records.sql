-- 계산 기록 테이블 생성
CREATE TABLE IF NOT EXISTS calculation_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_data JSONB NOT NULL,
  calculation_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE calculation_records ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 계산 기록만 조회/삽입 가능
CREATE POLICY "Users can view own calculation records" ON calculation_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculation records" ON calculation_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculation records" ON calculation_records
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_calculation_records_user_id ON calculation_records(user_id);
CREATE INDEX IF NOT EXISTS idx_calculation_records_created_at ON calculation_records(created_at); 