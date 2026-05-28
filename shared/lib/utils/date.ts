import { differenceInCalendarDays, parseISO } from "date-fns";

/**
 * ISO 날짜 문자열을 받아 오늘 기준 남은 일수를 반환합니다.
 * - 음수: 마감 지남
 * - 0: 오늘 마감
 * - 양수: 남은 일수
 */
export function calcDday(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInCalendarDays(parseISO(deadline), today);
}

/**
 * D-day 값에 따른 3색 Tailwind 텍스트 색상 클래스를 반환합니다.
 * - ≤ 3일: 빨강
 * - ≤ 7일: 주황
 * - > 7일: 초록
 */
export function getDdayColorClass(dday: number): string {
  if (dday <= 3) return "text-red-500"; // #ef4444
  if (dday <= 7) return "text-orange-600"; // #ea580c
  return "text-green-600"; // #16a34a
}

/**
 * D-day 값을 "D-3", "D-Day", "D+1" 형식의 문자열로 변환합니다.
 */
export function formatDday(dday: number): string {
  if (dday === 0) return "D-Day";
  if (dday > 0) return `D-${dday}`;
  return `D+${Math.abs(dday)}`;
}
