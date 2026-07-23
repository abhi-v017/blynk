import { useEffect, useRef } from "react";

export function useDebouncedEffect(effect: () => void, deps: unknown[], delay = 700) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const handle = setTimeout(effect, delay);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
