import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FlatList, View, StyleSheet, Image } from 'react-native';
import {
  Caption,
  FAB,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import API, { links } from '~/api';
import { stageGirlImg } from '~/api/images';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import CustomBackdrop from '~/components/sheet/backdrop';
import CustomBackground from '~/components/sheet/background';
import CustomHandle from '~/components/sheet/handle';
import AppStyles from '~/theme/styles';
import { attackType, attribute, charaImgs, position, rarity } from '~/assets';
import frame from '~/assets/common/frame_stage_girl.png';

import type {
  TDressBasicInfo,
  TDressList,
  StageGirlsScreenProps,
  TRole,
} from '~/typings';

type TFilter = Record<
  'characters' | 'elements' | 'position' | 'attackType' | 'rarity' | 'skills',
  boolean[]
>;

const styles = StyleSheet.create({
  attackType: {
    height: 17,
    right: 0,
    width: 20,
  },
  attackTypeImg: {
    height: responsiveWidth(10),
    width: responsiveWidth(10),
  },
  attackTypeImgContainer: {
    borderRadius: 5,
    height: responsiveWidth(12),
    width: responsiveWidth(12),
  },
  attribute: {
    height: 20,
    width: 20,
  },
  charaImg: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
  },
  charaImgContainer: {
    borderRadius: responsiveWidth(6),
    marginBottom: 5,
  },
  elementImg: {
    height: responsiveWidth(10),
    width: responsiveWidth(10),
  },
  elementImgContainer: {
    borderRadius: responsiveWidth(6),
    height: responsiveWidth(12),
    width: responsiveWidth(12),
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: 'absolute',
    right: 0,
  },
  frame: {
    height: 160 * 0.5,
    width: 144 * 0.5,
  },
  item: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    padding: 5,
  },
  positionImg: {
    height: (responsiveWidth(10) * 2) / 3,
    width: responsiveWidth(10),
  },
  positionImgContainer: {
    borderRadius: 5,
    height: (responsiveWidth(12) * 2) / 3,
    width: responsiveWidth(12),
  },
  rarity: {
    alignSelf: 'center',
    bottom: 0,
    height: 14,
    width: 70,
  },
  rarityImgContainer: {
    borderRadius: 5,
    padding: 2,
  },
  role: {
    height: 40 / 3,
    top: 20,
    width: 20,
  },
  space: {
    width: 10,
  },
});

const StageGirls = ({ navigation }: StageGirlsScreenProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const [loading, setLoading] = useState(true);
  /** List to filter */
  const [sgList, setSGList] = useState<TDressBasicInfo[]>([]);
  /** List to render */
  const [rsgList, setRSGList] = useState<TDressBasicInfo[]>([]);
  const [filter, setFilter] = useState<TFilter>({
    characters: charaImgs.map(() => true),
    elements: [true, true, true, true, true, true, true],
    position: [true, true, true],
    attackType: [true, true],
    rarity: [true, true, true],
    skills: [],
  });
  const top = {
    paddingTop: insets.top,
  };
  const bottom = {
    paddingBottom: insets.bottom,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await API.get<TDressList>(links.LIST.DRESS);
        if (data.ok && data.data) {
          setSGList(
            Object.values(data.data).sort((a, b) =>
              a.basicInfo.released.ja < b.basicInfo.released.ja ? 1 : -1,
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

  useEffect(() => {
    if (sgList.length > 0) {
      const afterFilter = sgList.filter((item) => {
        const p = () => {
          switch (item.base.roleIndex.role) {
            case 'front':
              return 0;
            case 'middle':
              return 1;
            default:
              return 2;
          }
        };
        const characterToIndex = () => {
          switch (item.basicInfo.character) {
            case 101:
              return 0;
            case 102:
              return 1;
            case 103:
              return 2;
            case 104:
              return 3;
            case 105:
              return 4;
            case 106:
              return 5;
            case 107:
              return 6;
            case 108:
              return 7;
            case 109:
              return 8;
            case 201:
              return 9;
            case 202:
              return 10;
            case 203:
              return 11;
            case 204:
              return 12;
            case 205:
              return 13;
            case 301:
              return 14;
            case 302:
              return 15;
            case 303:
              return 16;
            case 304:
              return 17;
            case 305:
              return 18;
            case 401:
              return 19;
            case 402:
              return 20;
            case 403:
              return 21;
            case 404:
              return 22;
            case 405:
              return 23;
            case 501:
              return 24;
            case 502:
              return 25;
            case 503:
              return 26;
            default:
              return -1;
          }
        };
        const checkRarity = filter.rarity[item.basicInfo.rarity - 2];
        const checkAtkType = filter.attackType[item.base.attackType - 1];
        const checkPosition = filter.position[p()];
        const checkElement = filter.elements[item.base.attribute - 1];
        const checkCharacter = filter.characters[characterToIndex()];
        return (
          checkRarity &&
          checkAtkType &&
          checkPosition &&
          checkElement &&
          checkCharacter
        );
      });
      setRSGList(afterFilter);
    }
  }, [filter, sgList]);

  const openSheet = () => bottomSheetModalRef.current?.present();

  const keyExtractor = ({ basicInfo }: TDressBasicInfo) =>
    `sg_${basicInfo.cardID}`;

  const renderItem = ({ item }: { item: TDressBasicInfo }) => {
    const { basicInfo, base, stat } = item;
    const onPress = () => {
      navigation.navigate('StageGirlDetail', { id: basicInfo.cardID });
    };

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View style={[styles.item, { borderColor: colors.border }]}>
          <Text style={AppStyles.centerText}>
            {basicInfo.name.en || basicInfo.name.ja}
          </Text>
          <View style={AppStyles.center}>
            <View style={styles.frame}>
              <FastImage
                source={{ uri: stageGirlImg(basicInfo.cardID) }}
                style={styles.frame}
              />
              <Image
                source={frame}
                style={[styles.frame, AppStyles.absolute]}
              />
              <Image
                source={attribute(base.attribute)}
                style={[styles.attribute, AppStyles.absolute]}
              />
              <Image
                source={position(base.roleIndex.role)}
                style={[styles.role, AppStyles.absolute]}
              />
              <Image
                source={rarity(basicInfo.rarity)}
                resizeMode='contain'
                style={[styles.rarity, AppStyles.absolute]}
              />
              <Image
                source={attackType(base.attackType)}
                style={[styles.attackType, AppStyles.absolute]}
              />
            </View>
            <Text style={AppStyles.centerText}>Total: {stat.total}</Text>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  const emptyList = () => {
    return (
      <View style={[AppStyles.flex1, AppStyles.center]}>
        <Text>No data. Please check filter.</Text>
      </View>
    );
  };

  if (loading) {
    return <Kirin />;
  }

  if (sgList.length > 0) {
    return (
      <>
        <FlatList
          data={rsgList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={top}
          ListEmptyComponent={emptyList}
          numColumns={2}
          initialNumToRender={12}
        />
        <FAB style={styles.fab} icon='filter' onPress={openSheet} />
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
                    style={[styles.charaImgContainer, bgColor]}
                    onPress={onPress}>
                    <Image source={charaImgs[i]} style={styles.charaImg} />
                  </TouchableRipple>
                );
              })}
            </View>
            <Caption>Elements</Caption>
            <View style={[AppStyles.row, AppStyles.spaceBetween]}>
              {filter.elements.map((value, i) => {
                const bgColor = {
                  backgroundColor: value ? colors.primary : undefined,
                };
                const onPress = () =>
                  setFilter({
                    ...filter,
                    elements: filter.elements.map((v, j) => (i === j ? !v : v)),
                  });
                return (
                  <TouchableRipple
                    key={`element_${i}`}
                    borderless
                    style={[
                      AppStyles.center,
                      styles.elementImgContainer,
                      bgColor,
                    ]}
                    onPress={onPress}>
                    <Image
                      source={attribute(i + 1)}
                      style={styles.elementImg}
                    />
                  </TouchableRipple>
                );
              })}
            </View>
            <Caption>Position</Caption>
            <View style={AppStyles.row}>
              {filter.position.map((value, i) => {
                const bgColor = {
                  backgroundColor: value ? colors.primary : undefined,
                };
                const onPress = () =>
                  setFilter({
                    ...filter,
                    position: filter.position.map((v, j) => (i === j ? !v : v)),
                  });
                return (
                  <View key={`p_${i}`} style={AppStyles.row}>
                    <TouchableRipple
                      borderless
                      style={[
                        AppStyles.center,
                        styles.positionImgContainer,
                        bgColor,
                      ]}
                      onPress={onPress}>
                      <Image
                        source={position(i as TRole)}
                        style={styles.positionImg}
                      />
                    </TouchableRipple>
                    <View style={styles.space} />
                  </View>
                );
              })}
            </View>
            <Caption>Attack Type</Caption>
            <View style={AppStyles.row}>
              <TouchableRipple
                borderless
                style={[
                  AppStyles.center,
                  styles.attackTypeImgContainer,
                  {
                    backgroundColor: filter.attackType[0]
                      ? colors.primary
                      : undefined,
                  },
                ]}
                onPress={() =>
                  setFilter({
                    ...filter,
                    attackType: [!filter.attackType[0], filter.attackType[1]],
                  })
                }>
                <Image source={attackType(1)} style={styles.attackTypeImg} />
              </TouchableRipple>
              <View style={styles.space} />
              <TouchableRipple
                borderless
                style={[
                  AppStyles.center,
                  styles.attackTypeImgContainer,
                  {
                    backgroundColor: filter.attackType[1]
                      ? colors.primary
                      : undefined,
                  },
                ]}
                onPress={() =>
                  setFilter({
                    ...filter,
                    attackType: [filter.attackType[0], !filter.attackType[1]],
                  })
                }>
                <Image source={attackType(2)} style={styles.attackTypeImg} />
              </TouchableRipple>
            </View>
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
                        styles.rarityImgContainer,
                        bgColor,
                      ]}
                      onPress={onPress}>
                      <Image source={rarity(i + 2)} resizeMode='contain' />
                    </TouchableRipple>
                    <View style={styles.space} />
                  </View>
                );
              })}
            </View>
            <Caption>Skills</Caption>
            <View style={AppStyles.row}></View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    );
  }

  return <ErrorView />;
};

export default StageGirls;
