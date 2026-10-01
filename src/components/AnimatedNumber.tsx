import { useEffect, useRef } from "react";

/** Only the decorative digits interpolate; assistive tech always gets the exact value. */
export function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const node = useRef<HTMLSpanElement>(null);
  const initial = useRef(value.toFixed(decimals));
  const current = useRef(value);
  useEffect(() => {
    const element = node.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const finish = () => {
      cancelAnimationFrame(frame);
      current.current = value;
      element.textContent = value.toFixed(decimals);
    };
    const from = current.current;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 650, 1);
      current.current = from + (value - from) * (1 - Math.pow(1 - progress, 3));
      element.textContent = current.current.toFixed(decimals);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const onPreference = () => { if (media.matches) finish(); };
    media.addEventListener("change", onPreference);
    if (media.matches) finish(); else frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", onPreference); };
  }, [value, decimals]);
  return <><span ref={node} aria-hidden="true">{initial.current}</span><span className="sr-only">{value.toFixed(decimals)}</span></>;
}
