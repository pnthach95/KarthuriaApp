import AppStyles from '~/theme/styles';
import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import React from 'react';
import {View} from 'react-native';
import {Colors, IconButton} from 'react-native-paper';

const CustomHandle = () => {
  const {dismissAll} = useBottomSheetModal();

  return (
    <View>
      <View style={AppStyles.selfEnd}>
        <IconButton color={Colors.red600} icon='close' onPress={dismissAll} />
      </View>
    </View>
  );
};

CustomHandle.whyDidYouRender = true;

export default CustomHandle;
