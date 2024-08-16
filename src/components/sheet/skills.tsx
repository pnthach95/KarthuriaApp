import {FasterImageView} from '@candlefinance/faster-image';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {iconSkill} from 'api/images';
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TouchableRipple, useTheme} from 'react-native-paper';
import AppStyles, {useSafeAreaPaddingBottom} from 'theme/styles';
import CustomBackdrop from './backdrop';
import CustomBackground from './background';
import CustomHandle from './handle';
import type {ListRenderItem} from 'react-native';

type Props = {
  skills: TSkill[];
  filterAll: boolean;
  onPress: (i: number) => void;
  toggleAll: () => void;
};

type SkillsBottomSheet = {
  openSheet: () => void;
};

type TSkill = {
  id: number;
  checked: boolean;
};

const styles = StyleSheet.create({
  img: {aspectRatio: 1, width: '83%'},
});

const keyExtractor = (item: TSkill, i: number) => `skill_${i}`;

const SkillsBottomSheet = forwardRef<SkillsBottomSheet, Props>(
  ({onPress, skills, filterAll, toggleAll}, ref) => {
    const {t} = useTranslation();
    const {colors} = useTheme();
    const bottom = useSafeAreaPaddingBottom(0);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const initialSnapPoints = useMemo(() => ['50%'], []);

    useImperativeHandle(
      ref,
      () => ({
        openSheet: () => {
          bottomSheetModalRef.current?.present();
        },
      }),
      [],
    );

    const renderItem: ListRenderItem<TSkill> = ({item, index}) => {
      const bgColor = {
        backgroundColor: item.checked ? colors.primary : undefined,
      };
      const _onPress = () => onPress(index);
      const source = {url: iconSkill(item.id)};

      return (
        <View className="w-1/7 p-1">
          <TouchableRipple
            borderless
            className="mb-2 aspect-square w-full items-center justify-center rounded-full"
            style={bgColor}
            onPress={_onPress}>
            <FasterImageView source={source} style={styles.img} />
          </TouchableRipple>
        </View>
      );
    };

    const listHeader = () => (
      <View className="mb-2 flex-row items-center justify-between">
        <Text variant="labelMedium">{t('skills')}</Text>
        <Button mode={filterAll ? 'contained' : 'outlined'} onPress={toggleAll}>
          {t('all')}
        </Button>
      </View>
    );

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}
        snapPoints={initialSnapPoints}>
        <View className="flex-1" style={bottom}>
          <BottomSheetFlatList
            columnWrapperStyle={AppStyles.spaceBetween}
            contentContainerStyle={AppStyles.paddingHorizontal}
            data={skills}
            keyExtractor={keyExtractor}
            ListHeaderComponent={listHeader}
            numColumns={7}
            renderItem={renderItem}
          />
        </View>
      </BottomSheetModal>
    );
  },
);

export default SkillsBottomSheet;
