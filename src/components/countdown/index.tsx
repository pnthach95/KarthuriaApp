import React, { useState, useEffect } from 'react';
import { TextStyle } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  miliseconds: number;
  interval?: number;
  style?: TextStyle;
  timeUpCallback?: () => void;
};

const Countdown = ({
  miliseconds,
  interval = 1000,
  style,
  timeUpCallback,
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
    const d = days == 0 ? '' : String(days) + (days == 1 ? ' day ' : ' days ');
    h = h === '00' ? '' : String(h) + (h == 1 ? ' hour ' : ' hours ');
    m = m === '00' ? '' : String(m) + (m == 1 ? ' minute ' : ' minutes ');
    if (seconds < 0) {
      timeUpCallback && timeUpCallback();
      return 'Time up';
    }
    return `${d}${h}${m}${s} seconds`;
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setRemaining(remaining - interval);
    }, interval);
    return () => {
      clearTimeout(id);
    };
  });

  return <Text style={style}>{getFormattedTime(remaining)}</Text>;
};

export default Countdown;
