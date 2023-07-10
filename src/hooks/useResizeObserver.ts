import { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';

export function useResizeObserver<T extends HTMLElement = any>() {
  const frameID = useRef(0);
  const ref = useRef<T>(null);

  const [rect, setRect] = useState<DOMRectReadOnly>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  } as DOMRectReadOnly);

  const observer = useMemo(() => (
    typeof window !== 'undefined'
    ? new ResizeObserver((entries: any) => {
        const entry = entries[0] as ResizeObserverEntry;

        if (entry) {
          cancelAnimationFrame(frameID.current);

          frameID.current = requestAnimationFrame(() => {
            if (ref.current) {
              setRect(entry.contentRect);
            }
          });
        }
      })
    : null
  ), []);

  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
      setRect(ref.current.getBoundingClientRect());
    }

    return () => {
      observer?.disconnect();

      if (frameID.current) {
        cancelAnimationFrame(frameID.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observer, ref.current]);

  useLayoutEffect(() => {
    if (ref.current) {
      setRect(ref.current?.getBoundingClientRect() as DOMRectReadOnly);
    }
  }, []);

  return [ref, rect] as const;
}
