import {FasterImageView} from '@candlefinance/faster-image';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {FlashList} from '@shopify/flash-list';
import API, {links} from 'api';
import {iconAttribute, imgEnemy} from 'api/images';
import EmptyList from 'components/emptylist';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import CustomBackdrop from 'components/sheet/backdrop';
import CustomBackground from 'components/sheet/background';
import CustomHandle from 'components/sheet/handle';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import {Button, FAB, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {useSafeAreaPaddingBottom} from 'theme/styles';
import {useImmer} from 'use-immer';
import type {ContentStyle, ListRenderItem} from '@shopify/flash-list';
import type {RootStackScreenProps} from 'typings/navigation';

const keyExtractor = ({basicInfo}: TEnemyBasicInfo) =>
  `en_${basicInfo.enemyID}`;

const styles = StyleSheet.create({
  img: {aspectRatio: 1, width: 89.6},
});

const EnemiesScreen = ({navigation}: RootStackScreenProps<'Enemies'>) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  /** Loading state */
  const [loading, setLoading] = useState(true);
  /** List for filter */
  const [eList, setEList] = useState<TEnemyBasicInfo[]>([]);
  /** List for render */
  const [reList, setREList] = useState<TEnemyBasicInfo[]>([]);
  /** Filter */
  const [filter, setFilter] = useImmer({
    elements: [true, true, true, true, true, true, true],
    type: [true, true],
    all: true,
  });
  /** Bottom inset for iOS */
  const bottom = useSafeAreaPaddingBottom();
  const sheetBottom = useSafeAreaPaddingBottom(24, {paddingHorizontal: 12});

  /** Load data */
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await API.get<TEnemyList>(links.LIST.ENEMY);
        if (data.ok && data.data) {
          setEList(Object.values(data.data));
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /** Handle filter */
  useEffect(() => {
    if (eList.length > 0) {
      const afterFilter = eList.filter(item => {
        const checkElement = filter.elements[item.basicInfo.attribute - 1];
        const checkType = filter.type[item.basicInfo.isDress];
        return checkElement && checkType;
      });
      setREList(afterFilter);
    }
  }, [filter, eList]);

  //#region Sheet

  const openSheet = () => bottomSheetModalRef.current?.present();

  const toggleAllElements = () => {
    setFilter(draft => {
      draft.elements = draft.elements.map(() => !draft.all);
      draft.all = !draft.all;
    });
  };

  const setStageGirlType = () =>
    setFilter(draft => {
      draft.type = [draft.type[0], !draft.type[1]];
    });

  const setElseType = () =>
    setFilter(draft => {
      draft.type = [!draft.type[0], draft.type[1]];
    });

  //#endregion

  //#region Render enemies

  const renderItem: ListRenderItem<TEnemyBasicInfo> = ({item}) => {
    const {basicInfo} = item;
    const onPress = () => {
      navigation.navigate('EnemyDetail', {id: basicInfo.enemyID});
    };
    const a = iconAttribute(basicInfo.attribute);

    return (
      <TouchableRipple className="flex-1" onPress={onPress}>
        <View className="flex-1 items-center justify-between p-1">
          <View className="items-center justify-center">
            <View className="aspect-square w-[89.6px]">
              <FasterImageView
                source={{url: imgEnemy(basicInfo.icon)}}
                style={styles.img}
              />
              <Image className="absolute aspect-square w-5" source={{uri: a}} />
            </View>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  //#endregion

  if (loading) {
    return <Kirin />;
  }

  if (eList.length > 0) {
    return (
      <>
        <FlashList
          contentContainerStyle={bottom as ContentStyle}
          data={reList}
          estimatedItemSize={96}
          keyExtractor={keyExtractor}
          ListEmptyComponent={EmptyList}
          numColumns={2}
          renderItem={renderItem}
        />
        <FAB
          className="absolute bottom-0 right-0 m-4"
          icon="filter"
          onPress={openSheet}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          enableDynamicSizing
          backdropComponent={CustomBackdrop}
          backgroundComponent={CustomBackground}
          handleComponent={CustomHandle}>
          <BottomSheetScrollView
            // @ts-ignore
            contentContainerStyle={sheetBottom}>
            <View className="mb-2 flex-row items-center justify-between">
              <Text variant="bodySmall">{t('skills')}</Text>
              <Button
                mode={filter.all ? 'contained' : 'outlined'}
                onPress={toggleAllElements}>
                {t('all')}
              </Button>
            </View>
            <View className="flex-row justify-between">
              {filter.elements.map((item, index) => {
                const bgColor = {
                  backgroundColor: item ? colors.primary : undefined,
                };
                const onPress = () =>
                  setFilter(draft => {
                    draft.elements[index] = !draft.elements[index];
                  });
                return (
                  <TouchableRipple
                    key={`element_${index}`}
                    borderless
                    className="aspect-square w-[12%] items-center justify-center rounded-full"
                    style={bgColor}
                    onPress={onPress}>
                    <Image
                      className="aspect-square w-[80%]"
                      source={{uri: iconAttribute(index + 1)}}
                    />
                  </TouchableRipple>
                );
              })}
            </View>
            <Text className="my-2" variant="bodySmall">
              {t('enemy-type')}
            </Text>
            <View className="flex-row space-x-3">
              <Button
                mode={filter.type[1] ? 'contained' : 'outlined'}
                onPress={setStageGirlType}>
                {t('stage-girls')}
              </Button>
              <Button
                mode={filter.type[0] ? 'contained' : 'outlined'}
                onPress={setElseType}>
                {t('else')}
              </Button>
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    );
  }

  return <ErrorView />;
};

export default EnemiesScreen;
