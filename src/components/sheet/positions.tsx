import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {position} from 'assets';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet} from 'react-native';
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import AppStyles, {useSafeAreaPaddingBottom} from 'theme/styles';
import CustomBackdrop from './backdrop';
import CustomBackground from './background';
import CustomHandle from './handle';

type Props = {
  positions: boolean[];
  onPress: (i: number) => void;
};

type RenderProps = {
  item: boolean;
  index: number;
  onPress: (i: number) => void;
};

type PositionsBottomSheet = {
  openSheet: () => void;
};

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 8,
  },
  positionImg: {
    height: (responsiveWidth(10) * 2) / 3,
    width: responsiveWidth(10),
  },
  positionImgContainer: {
    height: (responsiveWidth(12) * 2) / 3,
    width: responsiveWidth(12),
  },
});

const RenderItem = ({item, index, onPress}: RenderProps) => {
  const {colors} = useTheme();
  const bgColor = {
    backgroundColor: item ? colors.primary : undefined,
  };
  const _onPress = () => {
    onPress(index);
  };

  return (
    <TouchableRipple
      borderless
      className="items-center justify-center rounded-md"
      style={[styles.positionImgContainer, bgColor]}
      onPress={_onPress}>
      <Image source={position(index as TRole)} style={styles.positionImg} />
    </TouchableRipple>
  );
};

const PositionsBottomSheet = forwardRef<PositionsBottomSheet, Props>(
  ({positions, onPress}, ref) => {
    const {t} = useTranslation();
    const bottom = useSafeAreaPaddingBottom(24, styles.bottom);
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

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}>
        <BottomSheetView style={AppStyles.margin}>
          <Text variant="labelMedium">{t('position')}</Text>
        </BottomSheetView>
        <BottomSheetView style={[bottom, styles.bottom]}>
          {positions.map((p, i) => (
            <RenderItem key={`p_${i}`} index={i} item={p} onPress={onPress} />
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default PositionsBottomSheet;
