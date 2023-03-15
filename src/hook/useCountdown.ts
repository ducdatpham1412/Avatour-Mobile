import {useEffect, useState, useMemo, useCallback, useRef} from 'react';

const useCountdown = (initValue: number) => {
  const timeOut = useRef<any>();
  const [reset, setReset] = useState(true);
  const [countdown, setCountdown] = useState(initValue - 1);

  const timeEnd = useMemo(() => {
    setCountdown(initValue - 1);
    return new Date().getTime() + (initValue - 1) * 1000;
  }, [reset]);

  const resetCountdown = useCallback(
    () => setReset((prevReset: boolean) => !prevReset),
    [],
  );

  const clearCountdown = () => setCountdown(-1);

  useEffect(() => {
    let diff = Math.floor((timeEnd - new Date().getTime()) / 1000);
    if (countdown > 0) {
      timeOut.current = setTimeout(() => setCountdown(diff), 1000);
    }
    return () => clearTimeout(timeOut.current);
  }, [countdown]);

  return {countdown, resetCountdown, clearCountdown};
};

export default useCountdown;
