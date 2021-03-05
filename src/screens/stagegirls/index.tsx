import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import {
  Caption,
  FAB,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import API, { links } from '~/api';
import { stageGirlImg } from '~/api/images';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import CustomBackdrop from '~/components/sheet/backdrop';
import CustomBackground from '~/components/sheet/background';
import CustomHandle from '~/components/sheet/handle';
import AppStyles from '~/theme/styles';
import {
  attackType,
  attribute,
  charaImgs,
  elementImgs,
  position,
  positionImgs,
  rarity,
} from '~/assets';
import frame from '~/assets/common/frame_stage_girl.png';

import type {
  TDressBasicInfo,
  TDressList,
  StageGirlsScreenProps,
} from '~/typings';

const styles = StyleSheet.create({
  attackType: {
    height: 17,
    right: 0,
    width: 20,
  },
  attribute: {
    height: 20,
    width: 20,
  },
  charaImg: {
    height: 52,
    width: 52,
  },
  elementImg: {
    height: 48,
    width: 48,
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
    height: 30,
    width: 45,
  },
  rarity: {
    alignSelf: 'center',
    bottom: 0,
    height: 14,
    width: 70,
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
  const snapPoints = useMemo(() => ['35%'], []);
  const [loading, setLoading] = useState(true);
  const [sgList, setSGList] = useState<TDressBasicInfo[]>([]);
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
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

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
              <FastImage
                source={frame}
                style={[styles.frame, AppStyles.absolute]}
              />
              <FastImage
                source={attribute(base.attribute)}
                style={[styles.attribute, AppStyles.absolute]}
              />
              <FastImage
                source={position(base.roleIndex.role)}
                style={[styles.role, AppStyles.absolute]}
              />
              <FastImage
                source={rarity(basicInfo.rarity)}
                resizeMode='contain'
                style={[styles.rarity, AppStyles.absolute]}
              />
              <FastImage
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

  if (loading) {
    return <Kirin />;
  }

  if (sgList.length > 0) {
    return (
      <>
        <FlatList
          data={sgList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={top}
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
              {charaImgs.map((img, i) => {
                return (
                  <TouchableRipple
                    key={`charaImg_${i}`}
                    onPress={() => console.log(i)}>
                    <FastImage
                      source={img}
                      resizeMode='center'
                      style={styles.charaImg}
                    />
                  </TouchableRipple>
                );
              })}
            </View>
            <Caption>Elements</Caption>
            <View style={[AppStyles.row, AppStyles.spaceBetween]}>
              {elementImgs.map((img, i) => {
                return (
                  <TouchableRipple
                    key={`element_${i}`}
                    onPress={() => console.log(i)}>
                    <FastImage source={img} style={styles.elementImg} />
                  </TouchableRipple>
                );
              })}
            </View>
            <Caption>Position</Caption>
            <View style={AppStyles.row}>
              {positionImgs.map((img, i) => {
                return (
                  <View key={`p_${i}`} style={AppStyles.row}>
                    <TouchableRipple borderless onPress={() => console.log(i)}>
                      <FastImage source={img} style={styles.positionImg} />
                    </TouchableRipple>
                    <View style={styles.space} />
                  </View>
                );
              })}
            </View>
            <Caption>Attack Type</Caption>
            <View style={AppStyles.row}></View>
            <Caption>Rarity</Caption>
            <View style={AppStyles.row}></View>
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
