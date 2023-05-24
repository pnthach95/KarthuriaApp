import {BottomSheetHandle} from '@gorhom/bottom-sheet';
import React from 'react';
import {useTheme} from 'react-native-paper';
import type {BottomSheetHandleProps} from '@gorhom/bottom-sheet';

const CustomHandle: React.FC<BottomSheetHandleProps> = props => {
  const {colors} = useTheme();
  const indicatorStyle = {backgroundColor: colors.onBackground};

  return <BottomSheetHandle {...props} indicatorStyle={indicatorStyle} />;
};

export default CustomHandle;
