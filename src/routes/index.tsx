import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetworkProvider } from 'react-native-offline';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Routes from './routes';

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

const MainContainer = () => {
  return (
    <NetworkProvider>
      <SafeAreaProvider>
        <Routes />
      </SafeAreaProvider>
    </NetworkProvider>
  );
};

export default MainContainer;
