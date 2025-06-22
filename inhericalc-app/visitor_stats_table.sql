-- =====================================================
-- 방문자 통계 테이블 생성 스크립트
-- 일별 방문자 수와 총 방문자 수를 추적합니다
-- =====================================================

-- 1. 방문자 통계 테이블 생성
CREATE TABLE IF NOT EXISTS visitor_stats (
    id SERIAL PRIMARY KEY,
    visit_date DATE NOT NULL UNIQUE,
    daily_visitors INTEGER DEFAULT 0,
    total_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 방문자 세션 테이블 생성 (중복 방문 방지)
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    visit_date DATE NOT NULL,
    first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1
);

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_visitor_stats_date ON visitor_stats(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_date ON visitor_sessions(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON visitor_sessions(session_id);

-- 4. 방문자 통계 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_visitor_stats(session_id_param TEXT)
RETURNS VOID AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    session_exists BOOLEAN;
    daily_count INTEGER;
    total_count INTEGER;
BEGIN
    -- 오늘 날짜의 세션이 이미 존재하는지 확인
    SELECT EXISTS(
        SELECT 1 FROM visitor_sessions 
        WHERE session_id = session_id_param AND visit_date = today_date
    ) INTO session_exists;
    
    IF NOT session_exists THEN
        -- 새로운 세션 추가
        INSERT INTO visitor_sessions (session_id, visit_date)
        VALUES (session_id_param, today_date);
        
        -- 오늘 날짜의 통계가 있는지 확인
        SELECT daily_visitors, total_visitors 
        INTO daily_count, total_count
        FROM visitor_stats 
        WHERE visit_date = today_date;
        
        IF daily_count IS NULL THEN
            -- 오늘 날짜의 통계가 없으면 새로 생성
            INSERT INTO visitor_stats (visit_date, daily_visitors, total_visitors)
            VALUES (today_date, 1, 1);
        ELSE
            -- 오늘 날짜의 통계가 있으면 업데이트
            UPDATE visitor_stats 
            SET daily_visitors = daily_visitors + 1,
                total_visitors = total_visitors + 1,
                updated_at = NOW()
            WHERE visit_date = today_date;
        END IF;
    ELSE
        -- 기존 세션의 마지막 방문 시간 업데이트
        UPDATE visitor_sessions 
        SET last_visit_at = NOW(),
            visit_count = visit_count + 1
        WHERE session_id = session_id_param AND visit_date = today_date;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 5. 통계 조회 함수 생성
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

-- 6. RLS 설정 (통계 테이블은 읽기 전용으로 모든 사용자에게 허용)
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- 통계 조회 정책 (모든 인증된 사용자가 조회 가능)
CREATE POLICY "Allow authenticated users to view stats" ON visitor_stats
    FOR SELECT USING (auth.role() = 'authenticated');

-- 세션 관리 정책 (모든 사용자가 세션 생성/업데이트 가능)
CREATE POLICY "Allow all users to manage sessions" ON visitor_sessions
    FOR ALL USING (true);

-- 7. 초기 데이터 삽입 (오늘 날짜)
INSERT INTO visitor_stats (visit_date, daily_visitors, total_visitors)
VALUES (CURRENT_DATE, 0, 0)
ON CONFLICT (visit_date) DO NOTHING;

-- 8. 테이블 생성 확인
SELECT 
    'visitor_stats' as table_name,
    COUNT(*) as row_count 
FROM visitor_stats
UNION ALL
SELECT 
    'visitor_sessions' as table_name,
    COUNT(*) as row_count 
FROM visitor_sessions;

-- 완료 메시지
SELECT '방문자 통계 테이블이 성공적으로 생성되었습니다.' as "완료"; 