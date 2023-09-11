import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {rarity} from 'assets';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import CustomBackdrop from './backdrop';
import CustomBackground from './background';
import CustomHandle from './handle';

type Props = {
  rarities: boolean[];
  onPress: (i: number) => void;
};

type RaritiesBottomSheet = {
  openSheet: () => void;
};

const RaritiesBottomSheet = forwardRef<RaritiesBottomSheet, Props>(
  ({rarities, onPress}, ref) => {
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

    const renderItem = ({item, index}: {item: boolean; index: number}) => {
      const bgColor = {
        backgroundColor: item ? colors.primary : undefined,
      };
      const _onPress = () => {
        onPress(index);
      };

      return (
        <TouchableRipple
          key={`rarity_${index}`}
          borderless
          className="self-start rounded-xl p-1"
          style={bgColor}
          onPress={_onPress}>
          <Image resizeMode="contain" source={rarity(index + 2)} />
        </TouchableRipple>
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
            {t('rarity')}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {rarities.map((item, index) => {
              return renderItem({index, item});
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default RaritiesBottomSheet;
