-- 전문가 신청 테이블 생성
CREATE TABLE expert_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  region VARCHAR(100) NOT NULL,
  profession VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_expert_applications_email ON expert_applications(email);
CREATE INDEX idx_expert_applications_status ON expert_applications(status);
CREATE INDEX idx_expert_applications_created_at ON expert_applications(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE expert_applications ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (모든 사용자가 신청서를 제출할 수 있음)
CREATE POLICY "Anyone can insert expert applications" ON expert_applications
  FOR INSERT WITH CHECK (true);

-- 관리자만 조회 가능한 정책 (나중에 관리자 기능 추가 시 사용)
CREATE POLICY "Only admins can view expert applications" ON expert_applications
  FOR SELECT USING (false); -- 일단 모든 조회 차단, 관리자 기능 추가 시 수정

-- 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_expert_applications_updated_at 
  BEFORE UPDATE ON expert_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 코멘트 추가
COMMENT ON TABLE expert_applications IS '전문가 신청 정보를 저장하는 테이블';
COMMENT ON COLUMN expert_applications.name IS '신청자 이름';
COMMENT ON COLUMN expert_applications.email IS '신청자 이메일';
COMMENT ON COLUMN expert_applications.phone IS '신청자 전화번호';
COMMENT ON COLUMN expert_applications.region IS '활동 지역';
COMMENT ON COLUMN expert_applications.profession IS '직업/전문분야';
COMMENT ON COLUMN expert_applications.status IS '신청 상태 (pending: 대기, approved: 승인, rejected: 거절)'; 