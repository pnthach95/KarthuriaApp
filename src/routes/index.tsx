import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetworkProvider } from 'react-native-offline';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { AppProvider } from '~/context';
import Routes from './routes';

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

const MainContainer: React.FC<null> = () => {
  return (
    <NetworkProvider>
      <SafeAreaProvider>
        <AppProvider>
          <Routes />
        </AppProvider>
      </SafeAreaProvider>
    </NetworkProvider>
  );
};

export default MainContainer;
