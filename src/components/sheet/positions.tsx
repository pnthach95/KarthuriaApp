import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {position} from 'assets';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import CustomBackdrop from './backdrop';
import CustomBackground from './background';
import CustomHandle from './handle';
import type {ListRenderItem} from 'react-native';

type Props = {
  positions: boolean[];
  onPress: (i: number) => void;
};

type PositionsBottomSheet = {
  openSheet: () => void;
};

const keyExtractor = (item: boolean, i: number): string => `p_${i}`;

const styles = StyleSheet.create({
  positionImg: {
    height: (responsiveWidth(10) * 2) / 3,
    width: responsiveWidth(10),
  },
  positionImgContainer: {
    height: (responsiveWidth(12) * 2) / 3,
    width: responsiveWidth(12),
  },
});

const PositionsBottomSheet = forwardRef<PositionsBottomSheet, Props>(
  ({positions, onPress}, ref) => {
    const {t} = useTranslation();
    const {colors} = useTheme();
    const bottom = useSafeAreaPaddingBottom(24, {paddingHorizontal: 8});
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(
      ref,
      () => ({
        openSheet: () => {
          bottomSheetModalRef.current?.present();
        },
      }),
      [],
    );

    const renderItem: ListRenderItem<boolean> = ({item, index}) => {
      const bgColor = {
        backgroundColor: item ? colors.primary : undefined,
      };
      const _onPress = () => {
        onPress(index);
      };

      return (
        <View className="flex-row">
          <TouchableRipple
            borderless
            className="items-center justify-center rounded-md"
            style={[styles.positionImgContainer, bgColor]}
            onPress={_onPress}>
            <Image
              source={position(index as TRole)}
              style={styles.positionImg}
            />
          </TouchableRipple>
          <View className="w-3" />
        </View>
      );
    };

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}>
        <BottomSheetView style={bottom}>
          <Text className="mb-3" variant="labelMedium">
            {t('position')}
          </Text>
          <BottomSheetFlatList
            horizontal
            data={positions}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default PositionsBottomSheet;
