import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Kirin from '../kirin';
import ScrollViewWithBackButton from '../scrollviewwithbackbutton';
import ErrorView from '../errorview';
import AppStyles from '~/theme/styles';

type Props = {
  children: React.ReactNode;
  loading: boolean;
  hasData: boolean;
};

const BaseScreen = ({ children, loading, hasData }: Props): JSX.Element => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  const top = {
    top: insets.top,
  };

  if (!loading && hasData) {
    return <ScrollViewWithBackButton>{children}</ScrollViewWithBackButton>;
  }

  return (
    <>
      {loading ? <Kirin /> : <ErrorView />}
      <IconButton
        icon='arrow-left'
        onPress={goBack}
        style={[
          AppStyles.absolute,
          top,
          { backgroundColor: colors.background },
        ]}
      />
    </>
  );
};

export default BaseScreen;
