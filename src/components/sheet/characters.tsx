import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {charaImgs} from 'assets';
import Separator from 'components/separator';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
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
        <View className="w-1/7 p-1">
          <TouchableRipple
            borderless
            className="aspect-square w-full items-center justify-center rounded-full p-0.5"
            style={bgColor}
            onPress={_onPress}>
            <Image className="aspect-square w-full" source={charaImgs[index]} />
          </TouchableRipple>
        </View>
      );
    };

    const listHeader = () => (
      <View className="m-3 flex-row items-center justify-between">
        <Text variant="labelMedium">{t('characters')}</Text>
        <Button mode={filterAll ? 'contained' : 'outlined'} onPress={toggleAll}>
          {t('all')}
        </Button>
      </View>
    );

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableDynamicSizing
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}>
        <BottomSheetFlatList
          contentContainerStyle={bottom}
          data={characters}
          ItemSeparatorComponent={Separator}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          numColumns={7}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheetModal>
    );
  },
);

export default CharactersBottomSheet;
