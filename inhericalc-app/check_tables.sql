-- 테이블 구조 확인
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('user_profiles', 'calculation_records', 'expert_applications')
ORDER BY table_name, ordinal_position;

-- 또는 각 테이블의 구조를 개별적으로 확인
\d user_profiles
\d calculation_records  
\d expert_applications 