import {
  BottomSheetFlatList,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {iconAttribute} from 'api/images';
import Separator from 'components/separator';
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import CustomBackdrop from './backdrop';
import CustomBackground from './background';
import CustomHandle from './handle';
import type {ListRenderItem} from 'react-native';

type Props = {
  elements: boolean[];
  onPress: (i: number) => void;
};

type ElementsBottomSheet = {
  openSheet: () => void;
};

const keyExtractor = (item: boolean, i: number) => `element_${i}`;

const ElementsBottomSheet = forwardRef<ElementsBottomSheet, Props>(
  ({elements, onPress}, ref) => {
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

    const renderItem: ListRenderItem<boolean> = ({item, index}) => {
      const bgColor = {
        backgroundColor: item ? colors.primary : undefined,
      };
      const _onPress = () => {
        onPress(index);
      };

      return (
        <View className="w-1/7 p-1">
          <TouchableRipple
            borderless
            className="items-center justify-center rounded-full p-0.5"
            style={bgColor}
            onPress={_onPress}>
            <FastImage
              className="aspect-square w-full"
              source={{uri: iconAttribute(index + 1)}}
            />
          </TouchableRipple>
        </View>
      );
    };

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
          <Text variant="labelMedium">{t('elements')}</Text>
          <BottomSheetFlatList
            data={elements}
            ItemSeparatorComponent={Separator}
            keyExtractor={keyExtractor}
            numColumns={7}
            renderItem={renderItem}
          />
        </View>
      </BottomSheetModal>
    );
  },
);

export default ElementsBottomSheet;
