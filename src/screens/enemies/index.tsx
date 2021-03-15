import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FlatList, View, StyleSheet, Image } from 'react-native';
import {
  Button,
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
import { enemyImg } from '~/api/images';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import CustomBackdrop from '~/components/sheet/backdrop';
import CustomBackground from '~/components/sheet/background';
import CustomHandle from '~/components/sheet/handle';
import AppStyles from '~/theme/styles';
import { attribute } from '~/assets';

import type { EnemiesProps, TEnemyBasicInfo, TEnemyList } from '~/typings';

const styles = StyleSheet.create({
  attribute: {
    height: 20,
    width: 20,
  },
  frame: {
    height: 112 * 0.8,
    width: 112 * 0.8,
  },
  item: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    padding: 5,
  },
});

const Enemies = ({ navigation }: EnemiesProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  /** Loading state */
  const [loading, setLoading] = useState(true);
  /** List for filter */
  const [eList, setEList] = useState<TEnemyBasicInfo[]>([]);
  /** List for render */
  const [reList, setREList] = useState<TEnemyBasicInfo[]>([]);
  /** Filter */
  const [filter, setFilter] = useState({
    elements: [true, true, true, true, true, true, true],
    type: [true, true],
  });
  /** State for select/deselect all button */
  const [filterAll, setFilterAll] = useState({
    elements: true,
  });
  /** Bottom inset for iOS */
  const bottom = {
    paddingBottom: insets.bottom,
  };

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
    void loadData();
  }, []);

  /** Handle filter */
  useEffect(() => {
    if (eList.length > 0) {
      const afterFilter = eList.filter((item) => {
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
    setFilter({
      ...filter,
      elements: filter.elements.map((item) => !item),
    });
    setFilterAll({
      elements: !filterAll.elements,
    });
  };

  const setStageGirlType = () =>
    setFilter({
      ...filter,
      type: [filter.type[0], !filter.type[1]],
    });

  const setElseType = () =>
    setFilter({
      ...filter,
      type: [!filter.type[0], filter.type[1]],
    });

  //#endregion

  //#region Render enemies

  const keyExtractor = ({ basicInfo }: TEnemyBasicInfo) =>
    `sg_${basicInfo.enemyID}`;

  const renderItem = ({ item }: { item: TEnemyBasicInfo }) => {
    const { basicInfo } = item;
    const onPress = () => {
      navigation.navigate('EnemyDetail', { id: basicInfo.enemyID });
    };
    const source = {
      uri: enemyImg(basicInfo.icon),
    };
    const a = attribute(basicInfo.attribute);

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View style={[styles.item, { borderColor: colors.border }]}>
          <View style={AppStyles.center}>
            <View style={styles.frame}>
              <FastImage source={source} style={styles.frame} />
              <Image
                source={a}
                style={[styles.attribute, AppStyles.absolute]}
              />
            </View>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  const emptyList = () => {
    return (
      <View style={[AppStyles.flex1, AppStyles.center, AppStyles.marginTop]}>
        <Text>No data. Please check filter.</Text>
      </View>
    );
  };

  //#endregion

  if (loading) {
    return <Kirin />;
  }

  if (eList.length > 0) {
    return (
      <>
        <FlatList
          data={reList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={bottom}
          numColumns={2}
          ListEmptyComponent={emptyList}
          initialNumToRender={16}
        />
        <FAB icon={'filter'} onPress={openSheet} style={AppStyles.fab} />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          backdropComponent={CustomBackdrop}
          backgroundComponent={CustomBackground}
          handleComponent={CustomHandle}>
          <BottomSheetScrollView
            contentContainerStyle={AppStyles.paddingHorizontal}>
            <View style={[AppStyles.rowSpaceBetween, AppStyles.marginBottom]}>
              <Caption>Skills</Caption>
              <Button
                mode={filterAll.elements ? 'contained' : 'outlined'}
                onPress={toggleAllElements}>
                All
              </Button>
            </View>
            <View style={[AppStyles.row, AppStyles.spaceBetween]}>
              {filter.elements.map((item, index) => {
                const bgColor = {
                  backgroundColor: item ? colors.primary : undefined,
                };
                const onPress = () =>
                  setFilter({
                    ...filter,
                    elements: filter.elements.map((v, j) =>
                      index === j ? !v : v,
                    ),
                  });
                return (
                  <TouchableRipple
                    key={`element_${index}`}
                    borderless
                    style={[
                      AppStyles.center,
                      AppStyles.elementImgContainer,
                      bgColor,
                    ]}
                    onPress={onPress}>
                    <Image
                      source={attribute(index + 1)}
                      style={AppStyles.elementImg}
                    />
                  </TouchableRipple>
                );
              })}
            </View>
            <View style={AppStyles.marginBottom}>
              <Caption>Enemy type</Caption>
            </View>
            <View style={AppStyles.row}>
              <Button
                mode={filter.type[1] ? 'contained' : 'outlined'}
                onPress={setStageGirlType}
                uppercase={false}>
                Stage girls
              </Button>
              <View style={AppStyles.spaceHorizontal} />
              <Button
                mode={filter.type[0] ? 'contained' : 'outlined'}
                onPress={setElseType}
                uppercase={false}>
                Else
              </Button>
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    );
  }

  return <ErrorView />;
};

export default Enemies;
