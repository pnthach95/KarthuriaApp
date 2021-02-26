import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextStyle } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  seconds: number;
  interval?: number;
  style?: TextStyle;
};

const TimerCountdown: React.FC<Props> = ({
  seconds,
  interval = 1000,
  style,
}) => {
  const [remaining, setRemaining] = useState(seconds);

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

TimerCountdown.propTypes = {
  interval: PropTypes.any,
  seconds: PropTypes.any,
  style: PropTypes.any,
};

export default TimerCountdown;
