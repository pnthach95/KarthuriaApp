import React, { useState, useEffect } from 'react';
import { TextStyle } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  miliseconds: number;
  interval?: number;
  style?: TextStyle;
};

const Countdown = ({
  miliseconds,
  interval = 1000,
  style,
}: Props): JSX.Element => {
  const [remaining, setRemaining] = useState(miliseconds);

  const getFormattedTime = (t: number) => {
    const remainingSec = Math.round(t / 1000);
    const seconds = parseInt((remainingSec % 60).toString(), 10);
    const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
    const hours = parseInt(((remainingSec / 3600) % 24).toString(), 10);
    const days = parseInt((remainingSec / (3600 * 24)).toString(), 10);
    const s = seconds < 10 ? `0${seconds}` : seconds;
    let m = minutes < 10 ? `0${minutes}` : minutes;
    let h = hours < 10 ? `0${hours}` : hours;
    const d = days == 0 ? '' : String(days) + ' d ';
    h = h === '00' ? '' : String(h) + ' h ';
    m = m === '00' ? '' : String(m) + ' m ';
    if (seconds < 0) {
      return 'Time up';
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

  return <Text style={style}>{getFormattedTime(remaining)}</Text>;
};

export default Countdown;
