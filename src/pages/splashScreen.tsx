import { useEffect, useState } from 'react';
import logoWhite from '@/assets/logos/logo-white.svg';

type SplashScreenProps = {
  onFinish?: () => void;
  duration?: number; // ms
};

const SplashScreen = ({ onFinish, duration = 2000 }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 400);

    const finishTimer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-point transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src={logoWhite}
        alt='DoLink'
        className={`h-auto w-[128px] transition-all duration-500 ${
          fadeOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      />
    </div>
  );
};

export default SplashScreen;
