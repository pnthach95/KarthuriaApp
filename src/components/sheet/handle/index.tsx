import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import React from 'react';
import {View} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';

const CustomHandle = () => {
  const {dismissAll} = useBottomSheetModal();
  const {colors} = useTheme();

  return (
    <View>
      <View className="self-end">
        <IconButton
          containerColor={colors.errorContainer}
          icon="close"
          iconColor={colors.error}
          onPress={dismissAll}
        />
      </View>
    </View>
  );
};

CustomHandle.whyDidYouRender = true;

export default CustomHandle;
