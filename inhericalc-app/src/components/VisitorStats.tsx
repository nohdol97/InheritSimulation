'use client';

import { useState, useEffect } from 'react';

interface VisitorStatsData {
  stats: Array<{
    visit_date: string;
    daily_visitors: number;
    total_visitors: number;
  }>;
  today: {
    date: string;
    dailyVisitors: number;
    totalVisitors: number;
  };
}

export default function VisitorStats() {
  const [stats, setStats] = useState<VisitorStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 방문자 통계 업데이트
    const updateVisitorStats = async () => {
      try {
        await fetch('/api/stats/visitors', {
          method: 'POST',
          credentials: 'include'
        });
        console.log('방문자 통계 업데이트 완료');
      } catch (error) {
        console.error('방문자 통계 업데이트 실패:', error);
      }
    };

    // 방문자 통계 조회
    const fetchVisitorStats = async () => {
      try {
        const response = await fetch('/api/stats/visitors?days=7');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setStats(result.data);
          console.log('방문자 통계 조회 성공:', result.data);
        } else {
          // API 오류 시 임시 데이터 사용
          const tempData = {
            stats: [],
            today: {
              date: new Date().toISOString().split('T')[0],
              dailyVisitors: 0,
              totalVisitors: 0
            }
          };
          setStats(tempData);
        }
      } catch (error) {
        console.error('방문자 통계 조회 실패:', error);
        // 오류 발생 시 임시 데이터 사용
        const tempData = {
          stats: [],
          today: {
            date: new Date().toISOString().split('T')[0],
            dailyVisitors: 0,
            totalVisitors: 0
          }
        };
        setStats(tempData);
      } finally {
        setLoading(false);
      }
    };

    // 방문자 통계 업데이트 후 조회
    updateVisitorStats().then(() => {
      // 업데이트 후 약간의 지연을 두고 조회 (DB 반영 시간 고려)
      setTimeout(fetchVisitorStats, 500);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">방문자 통계</h3>
      
      {/* 오늘 통계 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.today.dailyVisitors.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">오늘 방문자</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.today.totalVisitors.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">총 방문자</div>
        </div>
      </div>

      {/* 최근 7일 통계 - 데이터가 있을 때만 표시 */}
      {stats.stats && stats.stats.length > 0 && (
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">최근 7일</h4>
          <div className="space-y-2">
            {stats.stats.slice(0, 7).map((day) => (
              <div key={day.visit_date} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {new Date(day.visit_date).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="font-medium text-gray-800">
                  {day.daily_visitors.toLocaleString()}명
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 