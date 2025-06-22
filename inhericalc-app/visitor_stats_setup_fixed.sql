-- =====================================================
-- 방문자 통계 시스템 설정 (수정 버전)
-- 기존 함수 삭제 후 재생성
-- =====================================================

-- 1. 기존 함수들 삭제 (있다면)
DROP FUNCTION IF EXISTS update_visitor_stats(text);
DROP FUNCTION IF EXISTS get_visitor_stats(integer);

-- 2. 방문자 통계 테이블 생성
CREATE TABLE IF NOT EXISTS visitor_stats (
    id SERIAL PRIMARY KEY,
    visit_date DATE NOT NULL UNIQUE,
    daily_visitors INTEGER DEFAULT 0,
    total_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 방문자 세션 테이블 생성 (중복 방문 방지)
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    visit_date DATE NOT NULL,
    first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_stats(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_date ON visitor_sessions(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON visitor_sessions(session_id);

-- 5. 방문자 통계 업데이트 함수 생성 (새 버전)
CREATE OR REPLACE FUNCTION update_visitor_stats(session_id_param TEXT)
RETURNS JSON AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    session_exists BOOLEAN;
    is_new_visitor BOOLEAN := FALSE;
    current_total INTEGER := 0;
BEGIN
    -- 오늘 날짜의 세션이 이미 존재하는지 확인
    SELECT EXISTS(
        SELECT 1 FROM visitor_sessions 
        WHERE session_id = session_id_param AND visit_date = today_date
    ) INTO session_exists;
    
    IF NOT session_exists THEN
        -- 새로운 방문자
        is_new_visitor := TRUE;
        
        -- 새로운 세션 추가
        INSERT INTO visitor_sessions (session_id, visit_date)
        VALUES (session_id_param, today_date);
        
        -- 오늘 날짜의 통계가 있는지 확인하고 업데이트
        INSERT INTO visitor_stats (visit_date, daily_visitors, total_visitors)
        VALUES (today_date, 1, 1)
        ON CONFLICT (visit_date) DO UPDATE SET
            daily_visitors = visitor_stats.daily_visitors + 1,
            total_visitors = visitor_stats.total_visitors + 1,
            updated_at = NOW();
            
    ELSE
        -- 기존 세션의 마지막 방문 시간 업데이트
        UPDATE visitor_sessions 
        SET last_visit_at = NOW(),
            visit_count = visit_count + 1
        WHERE session_id = session_id_param AND visit_date = today_date;
    END IF;
    
    -- 현재 총 방문자 수 조회
    SELECT COALESCE(total_visitors, 0) INTO current_total
    FROM visitor_stats 
    WHERE visit_date = today_date;
    
    RETURN json_build_object(
        'success', true,
        'is_new_visitor', is_new_visitor,
        'total_visitors', current_total
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- 6. 통계 조회 함수 생성 (새 버전)
CREATE OR REPLACE FUNCTION get_visitor_stats(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    visit_date DATE,
    daily_visitors INTEGER,
    total_visitors INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vs.visit_date,
        vs.daily_visitors,
        vs.total_visitors
    FROM visitor_stats vs
    WHERE vs.visit_date >= CURRENT_DATE - days_back
    ORDER BY vs.visit_date DESC;
END;
$$ LANGUAGE plpgsql;

-- 7. RLS 정책 설정 (모든 사용자가 접근 가능하도록)
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- 기존 정책들 삭제
DROP POLICY IF EXISTS "Allow all to view stats" ON visitor_stats;
DROP POLICY IF EXISTS "Allow all to manage sessions" ON visitor_sessions;
DROP POLICY IF EXISTS "Allow all to update stats" ON visitor_stats;

-- 새 정책들 생성
CREATE POLICY "Allow all to view stats" ON visitor_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow all to manage sessions" ON visitor_sessions
    FOR ALL USING (true);

CREATE POLICY "Allow all to update stats" ON visitor_stats
    FOR ALL USING (true);

-- 8. 초기 데이터 삽입 (오늘 날짜)
INSERT INTO visitor_stats (visit_date, daily_visitors, total_visitors)
VALUES (CURRENT_DATE, 0, 0)
ON CONFLICT (visit_date) DO NOTHING;

-- 9. 테이블 확인
SELECT 
    'visitor_stats' as table_name,
    COUNT(*) as row_count 
FROM visitor_stats
UNION ALL
SELECT 
    'visitor_sessions' as table_name,
    COUNT(*) as row_count 
FROM visitor_sessions;

-- 10. 완료 메시지
SELECT '방문자 통계 시스템이 성공적으로 설정되었습니다!' as message; 