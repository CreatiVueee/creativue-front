import { useEffect, useRef } from "react";

/**
 * setInterval을 React 생명주기에 맞게 래핑한 훅.
 * - callback ref를 통해 최신 클로저를 유지하므로 stale closure 없음
 * - delay가 변경되면 기존 인터벌을 정리하고 재등록
 */
export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
