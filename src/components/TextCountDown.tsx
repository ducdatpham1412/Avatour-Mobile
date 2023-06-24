import {useCountdown} from 'hook';
import React, {useEffect} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {StyleText} from './base';

interface Props {
  initSeconds: number;
  style?: StyleProp<TextStyle>;
  onFinished?: () => void;
}

export const formatCountdown = (countdown: number) => {
  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown - hours * 3600) / 60);
  const seconds = countdown - hours * 3600 - minutes * 60;

  const textHours = hours < 10 ? `0${hours}` : `${hours}`;
  const textMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const textSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${textHours}:${textMinutes}:${textSeconds}`;
};

const TextCountDown = ({initSeconds, style, onFinished}: Props) => {
  const {countdown} = useCountdown(initSeconds);

  const isFinished = countdown <= 0;

  useEffect(() => {
    if (isFinished) {
      onFinished?.();
    }
  }, [isFinished]);

  return (
    <StyleText originValue={formatCountdown(countdown)} customStyle={style} />
  );
};

export default TextCountDown;
