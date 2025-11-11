import { useState, useCallback, useRef } from 'react';

export function useHistoryCreateChar<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const historyRef = useRef<T[]>([initialState]);
  const currentIndexRef = useRef(0);

  const push = useCallback((newState: T) => {
    // Если это то же состояние, что и текущее, не добавляем в историю
    if (JSON.stringify(newState) === JSON.stringify(historyRef.current[currentIndexRef.current])) {
      return;
    }

    // Удаляем все состояния после текущего индекса
    historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);

    // Добавляем новое состояние
    historyRef.current.push(newState);
    currentIndexRef.current = historyRef.current.length - 1;

    // Ограничиваем размер истории
    if (historyRef.current.length > 50) {
      historyRef.current = historyRef.current.slice(-50);
      currentIndexRef.current = 49;
    }

    setState(newState);
  }, []);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current--;
      const previousState = historyRef.current[currentIndexRef.current];
      setState(previousState);
      return true;
    }
    return false;
  }, []);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current++;
      const nextState = historyRef.current[currentIndexRef.current];
      setState(nextState);
      return true;
    }
    return false;
  }, []);

  const canUndo = currentIndexRef.current > 0;
  const canRedo = currentIndexRef.current < historyRef.current.length - 1;

  return {
    current: state,
    push,
    undo,
    redo,
    canUndo,
    canRedo,
    historySize: historyRef.current.length,
    currentIndex: currentIndexRef.current
  };
}