import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Colors, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Kirin from '~/components/kirin';
import ScrollViewWithBackButton from '~/components/scrollviewwithbackbutton';
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
      {loading ? (
        <Kirin />
      ) : (
        <View style={[AppStyles.flex1, AppStyles.center]}>
          <Icon name='alert-circle-outline' size={70} color={Colors.red600} />
          <Text>{`Can't load data`}</Text>
        </View>
      )}
    </>
  );
};

export default BaseScreen;
