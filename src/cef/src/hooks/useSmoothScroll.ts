import { useRef, useCallback, useEffect } from 'react';

const useSmoothWheelScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number>(0);
  const targetScroll = useRef(0);
  const startScroll = useRef(0);
  const startTime = useRef(0);
  const duration = 300; // длительность анимации в ms

  const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 3);
  };

  const animate = useCallback((timestamp: number) => {
    if (!startTime.current) startTime.current = timestamp;

    const elapsed = timestamp - startTime.current;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeOutCubic(progress);

    if (!scrollRef.current) return;

    const element = scrollRef.current;
    const currentScroll = startScroll.current + (targetScroll.current - startScroll.current) * easeProgress;

    element.scrollTop = currentScroll;

    if (progress < 1) {
      animationFrame.current = requestAnimationFrame(animate);
    }
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    if (!scrollRef.current) return;

    const element = scrollRef.current;
    const delta = e.deltaY;

    // Обновляем целевую позицию
    targetScroll.current += delta;
    targetScroll.current = Math.max(
        0,
        Math.min(targetScroll.current, element.scrollHeight - element.clientHeight)
    );

    // Сбрасываем анимацию
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    startScroll.current = element.scrollTop;
    startTime.current = 0;
    animationFrame.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    targetScroll.current = element.scrollTop;
    startScroll.current = element.scrollTop;

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [handleWheel]);

  return scrollRef;
};

export default useSmoothWheelScroll;