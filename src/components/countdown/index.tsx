import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text} from 'react-native-paper';

type Props = {
  miliseconds: number;
  interval?: number;
  center?: boolean;
  right?: boolean;
};

const Countdown = ({miliseconds, interval = 1000, center, right}: Props) => {
  const {t} = useTranslation();
  const [remaining, setRemaining] = useState(miliseconds);

  const getFormattedTime = (tt: number) => {
    const remainingSec = Math.round(tt / 1000);
    const seconds = parseInt((remainingSec % 60).toString(), 10);
    const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
    const hours = parseInt(((remainingSec / 3600) % 24).toString(), 10);
    const days = parseInt((remainingSec / (3600 * 24)).toString(), 10);
    const s = seconds < 10 ? `0${seconds}` : `${seconds}`;
    let m = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let h = hours < 10 ? `0${hours}` : `${hours}`;
    const d = days === 0 ? '' : `${days} d `;
    h = h === '00' ? '' : h + ' h ';
    m = m === '00' ? '' : m + ' m ';
    if (seconds < 0) {
      return t('time-up');
    }
    return `${d}${h}${m}${s} s`;
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if (remaining - interval > 0) {
        setRemaining(remaining - interval);
      }
    }, interval);
    return () => {
      clearTimeout(id);
    };
  });

  return (
    <Text className={center ? 'text-center' : right ? 'text-right' : undefined}>
      {getFormattedTime(remaining)}
    </Text>
  );
};

Countdown.whyDidYouRender = true;

export default Countdown;
