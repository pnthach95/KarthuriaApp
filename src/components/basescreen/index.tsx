import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {IconButton, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStyles from 'theme/styles';
import ErrorView from '../errorview';
import Kirin from '../kirin';
import ScrollViewWithBackButton from '../scrollviewwithbackbutton';

type Props = {
  children: React.ReactNode;
  loading: boolean;
  hasData: boolean;
};

const BaseScreen = ({children, loading, hasData}: Props) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
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
        icon="arrow-left"
        style={[AppStyles.absolute, top, {backgroundColor: colors.background}]}
        onPress={goBack}
      />
    </>
  );
};

BaseScreen.whyDidYouRender = true;

export default BaseScreen;
