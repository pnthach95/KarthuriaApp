import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { IconButton, useTheme } from 'react-native-paper';
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
  const { colors } = useTheme();
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  if (!loading && hasData) {
    return <ScrollViewWithBackButton>{children}</ScrollViewWithBackButton>;
  }

  return (
    <>
      <IconButton
        icon='arrow-left'
        onPress={goBack}
        style={[AppStyles.absolute, { backgroundColor: colors.background }]}
      />
      {loading ? <Kirin /> : <ErrorView />}
    </>
  );
};

export default BaseScreen;
