import {
  BottomSheetFlatList,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {charaImgs} from 'assets';
import Separator from 'components/separator';
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import CustomBackdrop from './backdrop';
import CustomBackground from './background';
import CustomHandle from './handle';
import type {ListRenderItem} from 'react-native';

type Props = {
  characters: boolean[];
  filterAll: boolean;
  onPress: (i: number) => void;
  toggleAll: () => void;
};

type CharactersBottomSheet = {
  openSheet: () => void;
};

const keyExtractor = (item: boolean, i: number) => `charaImg_${i}`;

const CharactersBottomSheet = forwardRef<CharactersBottomSheet, Props>(
  ({characters, filterAll, onPress, toggleAll}, ref) => {
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
            className="aspect-square w-full items-center justify-center rounded-full p-0.5"
            style={bgColor}
            onPress={_onPress}>
            <FastImage
              className="aspect-square w-full"
              source={charaImgs[index]}
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
          <View className="mb-3 flex-row items-center justify-between">
            <Text variant="labelMedium">{t('characters')}</Text>
            <Button
              mode={filterAll ? 'contained' : 'outlined'}
              onPress={toggleAll}>
              {t('all')}
            </Button>
          </View>
          <BottomSheetFlatList
            data={characters}
            ItemSeparatorComponent={Separator}
            keyExtractor={keyExtractor}
            numColumns={7}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </BottomSheetModal>
    );
  },
);

export default CharactersBottomSheet;
