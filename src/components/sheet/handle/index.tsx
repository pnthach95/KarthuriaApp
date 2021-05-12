import React from 'react';
import { View } from 'react-native';
import { Colors, IconButton } from 'react-native-paper';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import AppStyles from '~/theme/styles';

const CustomHandle = (): JSX.Element => {
  const { dismissAll } = useBottomSheetModal();

  return (
    <View>
      <View style={AppStyles.selfEnd}>
        <IconButton icon='close' color={Colors.red600} onPress={dismissAll} />
      </View>
    </View>
  );
};

CustomHandle.whyDidYouRender = true;

export default CustomHandle;
