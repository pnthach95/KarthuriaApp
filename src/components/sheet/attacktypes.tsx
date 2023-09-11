import {
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {attackType} from 'assets';
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import AppStyles, {useSafeAreaPaddingBottom} from 'theme/styles';
import CustomBackdrop from './backdrop';
import CustomBackground from './background';
import CustomHandle from './handle';

type Props = {
  attackTypes: boolean[];
  onPress0: () => void;
  onPress1: () => void;
};

type AttackTypesBottomSheet = {
  openSheet: () => void;
};

const AttackTypesBottomSheet = forwardRef<AttackTypesBottomSheet, Props>(
  ({attackTypes, onPress0, onPress1}, ref) => {
    const {t} = useTranslation();
    const {colors} = useTheme();
    const bottom = useSafeAreaPaddingBottom(24);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

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
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        contentHeight={animatedContentHeight}
        handleComponent={CustomHandle}
        handleHeight={animatedHandleHeight}
        // @ts-ignore animatedSnapPoints
        snapPoints={animatedSnapPoints}>
        <View
          className="flex-1 px-3"
          style={bottom}
          onLayout={handleContentLayout}>
          <Text variant="labelMedium">{t('attack-type')}</Text>
          <View className="flex-row">
            <TouchableRipple
              borderless
              className="items-center justify-center rounded-xl"
              style={[
                AppStyles.squareW12,
                {
                  backgroundColor: attackTypes[0] ? colors.primary : undefined,
                },
              ]}
              onPress={onPress0}>
              <Image source={attackType(1)} style={AppStyles.squareW10} />
            </TouchableRipple>
            <View className="w-3" />
            <TouchableRipple
              borderless
              className="items-center justify-center rounded-xl"
              style={[
                AppStyles.squareW12,
                {
                  backgroundColor: attackTypes[1] ? colors.primary : undefined,
                },
              ]}
              onPress={onPress1}>
              <Image source={attackType(2)} style={AppStyles.squareW10} />
            </TouchableRipple>
          </View>
        </View>
      </BottomSheetModal>
    );
  },
);

export default AttackTypesBottomSheet;
