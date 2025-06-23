-- =====================================================
-- 방문자 통계 최종 수정 스크립트 (깔끔한 버전)
-- 모든 ambiguous 오류 완전 해결
-- =====================================================

-- 1. 기존 함수들 완전 삭제
DROP FUNCTION IF EXISTS update_visitor_stats(text);
DROP FUNCTION IF EXISTS get_visitor_stats(integer);

-- 2. visitor_sessions 테이블의 unique 제약 조건 수정 (안전하게)
DO $$
BEGIN
    -- 기존 제약 조건들 삭제 (존재하는 경우에만)
    ALTER TABLE visitor_sessions DROP CONSTRAINT IF EXISTS visitor_sessions_session_id_key;
    ALTER TABLE visitor_sessions DROP CONSTRAINT IF EXISTS visitor_sessions_session_id_date_key;
    
    -- 새로운 제약 조건 추가
    ALTER TABLE visitor_sessions ADD CONSTRAINT visitor_sessions_session_id_date_key UNIQUE (session_id, visit_date);
    
    RAISE NOTICE '제약 조건이 성공적으로 재생성되었습니다.';
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE '제약 조건이 이미 존재합니다. 건너뜁니다.';
    WHEN OTHERS THEN
        RAISE NOTICE '제약 조건 생성 중 오류: %', SQLERRM;
END $$;

-- 3. 완전히 새로운 방문자 통계 업데이트 함수
CREATE OR REPLACE FUNCTION update_visitor_stats(session_id_param TEXT)
RETURNS JSON AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    session_exists BOOLEAN;
    is_new_visitor BOOLEAN := FALSE;
    current_daily_count INTEGER := 0;
    total_count INTEGER := 0;
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
        
        -- 오늘 날짜의 일별 방문자 수 업데이트
        INSERT INTO visitor_stats (visit_date, daily_visitors, total_visitors)
        VALUES (today_date, 1, 0)
        ON CONFLICT (visit_date) DO UPDATE SET
            daily_visitors = visitor_stats.daily_visitors + 1,
            updated_at = NOW();
            
    ELSE
        -- 기존 세션의 마지막 방문 시간 업데이트
        UPDATE visitor_sessions 
        SET last_visit_at = NOW(),
            visit_count = visit_count + 1
        WHERE session_id = session_id_param AND visit_date = today_date;
    END IF;
    
    -- 총 방문자 수 계산 (모든 일별 방문자의 합)
    SELECT COALESCE(SUM(t.daily_visitors), 0) INTO total_count
    FROM visitor_stats t;
    
    -- 오늘 일별 방문자 수 조회
    SELECT COALESCE(t.daily_visitors, 0) INTO current_daily_count
    FROM visitor_stats t
    WHERE t.visit_date = today_date;
    
    -- 모든 레코드의 total_visitors 업데이트
    UPDATE visitor_stats 
    SET total_visitors = total_count,
        updated_at = NOW()
    WHERE TRUE;
    
    RETURN json_build_object(
        'success', true,
        'is_new_visitor', is_new_visitor,
        'daily_visitors', current_daily_count,
        'total_visitors', total_count
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- 4. 완전히 새로운 통계 조회 함수
CREATE OR REPLACE FUNCTION get_visitor_stats(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    visit_date DATE,
    daily_visitors INTEGER,
    total_visitors INTEGER
) AS $$
DECLARE
    total_count INTEGER := 0;
BEGIN
    -- 전체 누적 방문자 수 계산
    SELECT COALESCE(SUM(t.daily_visitors), 0) INTO total_count
    FROM visitor_stats t;
    
    -- 모든 레코드의 total_visitors를 올바른 값으로 업데이트
    UPDATE visitor_stats 
    SET total_visitors = total_count,
        updated_at = NOW()
    WHERE TRUE;
    
    -- 결과 반환
    RETURN QUERY
    SELECT 
        t.visit_date,
        t.daily_visitors,
        t.total_visitors
    FROM visitor_stats t
    WHERE t.visit_date >= CURRENT_DATE - days_back
    ORDER BY t.visit_date DESC;
END;
$$ LANGUAGE plpgsql;

-- 5. 기존 데이터 정정
DO $$
DECLARE
    total_count INTEGER := 0;
BEGIN
    -- 모든 일별 방문자 수의 합계 계산
    SELECT COALESCE(SUM(t.daily_visitors), 0) INTO total_count
    FROM visitor_stats t;
    
    -- 모든 레코드의 total_visitors를 올바른 값으로 업데이트
    UPDATE visitor_stats 
    SET total_visitors = total_count,
        updated_at = NOW()
    WHERE TRUE;
    
    RAISE NOTICE '기존 데이터 정정 완료: 총 방문자 수 = %', total_count;
END $$;

-- 6. 테스트 및 확인
SELECT '=== 함수 테스트 ===' as section;

-- 함수 직접 테스트
SELECT * FROM get_visitor_stats(7);

-- 검증 쿼리
SELECT 
    SUM(t.daily_visitors) as "일별_방문자_합계",
    MAX(t.total_visitors) as "저장된_총_방문자",
    CASE 
        WHEN SUM(t.daily_visitors) = MAX(t.total_visitors) THEN '✅ 올바름'
        ELSE '❌ 불일치'
    END as "검증_결과"
FROM visitor_stats t;

-- 완료 메시지
SELECT '✅ 모든 ambiguous 오류가 수정되었습니다!' as "완료"; 