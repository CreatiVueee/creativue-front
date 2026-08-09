/**
 * 상금(원 단위)을 "3천만원", "5백만원", "80만원" 형식의 문자열로 변환합니다.
 */
export function formatPrize(prize: number): string {
  if (prize >= 10_000_000) return `${prize / 10_000_000}천만원`;
  if (prize >= 1_000_000) return `${prize / 1_000_000}백만원`;
  return `${(prize / 10_000).toFixed(0)}만원`;
}
