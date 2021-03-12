import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import {
  Caption,
  FAB,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import API, { links } from '~/api';
import { memoirImg, skillIcon } from '~/api/images';
import { charaImgs, rarity } from '~/assets';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import CustomBackdrop from '~/components/sheet/backdrop';
import CustomBackground from '~/components/sheet/background';
import CustomHandle from '~/components/sheet/handle';
import AppStyles from '~/theme/styles';
import { characterToIndex } from '~/util';
import frame from '~/assets/common/frame_equip.png';

import type {
  TEquipBasicInfo,
  TEquipList,
  MemoirsScreenProps,
} from '~/typings';

type TFilter = Record<'characters' | 'rarity' | 'skills', boolean[]>;

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
    height: 160 * 0.5,
    width: 144 * 0.5,
  },
  item: {
    borderWidth: 1,
    flex: 1,
    padding: 5,
  },
  rarity: {
    alignSelf: 'center',
    height: 14,
    width: 70,
  },
  skillIcon: {
    height: 25,
    width: 25,
  },
});

const Memoirs = ({ navigation }: MemoirsScreenProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const [loading, setLoading] = useState(true);
  /** List for filter */
  const [mList, setMList] = useState<TEquipBasicInfo[]>([]);
  /** List for render */
  const [rmList, setRMList] = useState<TEquipBasicInfo[]>([]);
  /** Filter */
  const [filter, setFilter] = useState<TFilter>({
    characters: charaImgs.map(() => true),
    rarity: [true, true, true, true],
    skills: [],
  });
  /** Top inset for iOS */
  const top = {
    paddingTop: insets.top,
  };
  const bottom = {
    paddingBottom: insets.bottom,
  };

  /** Load data here */
  useEffect(() => {
    const loadData = async () => {
      try {
        const gotData = await API.get<TEquipList>(links.LIST.EQUIP);
        if (gotData.ok && gotData.data) {
          setMList(
            Object.values(gotData.data).sort((a, b) =>
              a.basicInfo.published.ja < b.basicInfo.published.ja ? 1 : -1,
            ),
          );
          setFilter({
            ...filter,
            skills: [],
          });
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  /** Handle filter */
  useEffect(() => {
    if (mList.length > 0) {
      const afterFilter = mList.filter((item) => {
        const checkRarity = filter.rarity[item.basicInfo.rarity - 1];
        const checkCharacter = Array.isArray(item.basicInfo.charas)
          ? item.basicInfo.charas.reduce(
              (prev, current) =>
                prev && filter.characters[characterToIndex(current)],
              true,
            )
          : true;
        return checkRarity && checkCharacter;
      });
      setRMList(afterFilter);
    }
  }, [filter, mList]);

  const openSheet = () => bottomSheetModalRef.current?.present();

  const keyExtractor = (item: TEquipBasicInfo) =>
    'memoir_' + item.basicInfo.cardID;

  const renderItem = ({ item }: { item: TEquipBasicInfo }) => {
    const onPress = () =>
      navigation.navigate('MemoirDetail', { id: item.basicInfo.cardID });

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View style={[styles.item, { borderColor: colors.border }]}>
          <View style={styles.frame}>
            <FastImage
              source={{ uri: memoirImg(item.basicInfo.cardID) }}
              style={styles.frame}
            />
            <Image source={frame} style={[styles.frame, AppStyles.absolute]} />
          </View>
          <View style={[AppStyles.center, AppStyles.row]}>
            <Image
              source={rarity(item.basicInfo.rarity)}
              resizeMode='contain'
              style={styles.rarity}
            />
            <FastImage
              source={{ uri: skillIcon(item.skill.iconID) }}
              style={styles.skillIcon}
            />
          </View>
          <Text style={AppStyles.centerText}>
            {item.basicInfo.name.en || item.basicInfo.name.ja}
          </Text>
        </View>
      </TouchableRipple>
    );
  };

  if (loading) {
    return <Kirin />;
  }

  if (mList.length > 0) {
    return (
      <>
        <FlatList
          data={rmList}
          numColumns={2}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={top}
          initialNumToRender={12}
        />
        <FAB style={AppStyles.fab} icon='filter' onPress={openSheet} />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          backdropComponent={CustomBackdrop}
          backgroundComponent={CustomBackground}
          handleComponent={CustomHandle}>
          <BottomSheetScrollView
            contentContainerStyle={[AppStyles.paddingHorizontal, bottom]}>
            <Caption>Characters</Caption>
            <View style={[AppStyles.row, AppStyles.spaceBetween]}>
              {filter.characters.map((value, i) => {
                const bgColor = {
                  backgroundColor: value ? colors.primary : undefined,
                };
                const onPress = () =>
                  setFilter({
                    ...filter,
                    characters: filter.characters.map((v, j) =>
                      i === j ? !v : v,
                    ),
                  });
                return (
                  <TouchableRipple
                    key={`charaImg_${i}`}
                    borderless
                    style={[AppStyles.charaImgContainer, bgColor]}
                    onPress={onPress}>
                    <Image source={charaImgs[i]} style={AppStyles.charaImg} />
                  </TouchableRipple>
                );
              })}
            </View>
            <Caption>Skills</Caption>
            <View style={AppStyles.row}></View>
            <Caption>Rarity</Caption>
            <View style={AppStyles.row}>
              {filter.rarity.map((value, i) => {
                const bgColor = {
                  backgroundColor: value ? colors.primary : undefined,
                };
                const onPress = () =>
                  setFilter({
                    ...filter,
                    rarity: filter.rarity.map((v, j) => (i === j ? !v : v)),
                  });
                return (
                  <View key={`r_${i}`} style={AppStyles.row}>
                    <TouchableRipple
                      borderless
                      style={[
                        AppStyles.center,
                        AppStyles.rarityImgContainer,
                        bgColor,
                      ]}
                      onPress={onPress}>
                      <Image source={rarity(i + 1)} resizeMode='contain' />
                    </TouchableRipple>
                    <View style={AppStyles.spaceHorizontal} />
                  </View>
                );
              })}
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    );
  }

  return <ErrorView />;
};

export default Memoirs;
