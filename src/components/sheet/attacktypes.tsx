import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {attackType} from 'assets';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
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

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}>
        <BottomSheetView style={bottom}>
          <Text variant="labelMedium">{t('attack-type')}</Text>
          <View className="mt-3 flex-row">
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
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default AttackTypesBottomSheet;
