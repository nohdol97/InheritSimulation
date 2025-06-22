-- 테이블 구조 확인 (Supabase SQL Editor용)
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('user_profiles', 'calculation_records', 'expert_applications')
ORDER BY table_name, ordinal_position; 