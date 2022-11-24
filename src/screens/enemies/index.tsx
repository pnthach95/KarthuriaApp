import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import API, {links} from 'api';
import {iconAttribute, imgEnemy} from 'api/images';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import CustomBackdrop from 'components/sheet/backdrop';
import CustomBackground from 'components/sheet/background';
import CustomHandle from 'components/sheet/handle';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Button,
  Caption,
  FAB,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStyles from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const styles = StyleSheet.create({
  frame: {
    height: 89.6,
    width: 89.6,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const keyExtractor = ({basicInfo}: TEnemyBasicInfo) =>
  `en_${basicInfo.enemyID}`;

const Enemies = ({navigation}: RootStackScreenProps<'Enemies'>) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
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
    setFilter({
      ...filter,
      elements: filter.elements.map(item => !item),
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

  const renderItem = ({item}: {item: TEnemyBasicInfo}) => {
    const {basicInfo} = item;
    const onPress = () => {
      navigation.navigate('EnemyDetail', {id: basicInfo.enemyID});
    };
    const a = iconAttribute(basicInfo.attribute);

    return (
      <TouchableRipple style={AppStyles.flex1} onPress={onPress}>
        <View
          style={[
            AppStyles.listItem,
            styles.item,
            {borderColor: colors.border},
          ]}>
          <View style={AppStyles.center}>
            <View style={styles.frame}>
              <FastImage
                source={{uri: imgEnemy(basicInfo.icon)}}
                style={styles.frame}
              />
              <Image
                source={{uri: a}}
                style={[AppStyles.square20, AppStyles.absolute]}
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
        <Text>{t('no-data')}</Text>
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
          initialNumToRender={16}
          keyExtractor={keyExtractor}
          ListEmptyComponent={emptyList}
          numColumns={2}
          renderItem={renderItem}
          style={bottom}
        />
        <FAB icon={'filter'} style={AppStyles.fab} onPress={openSheet} />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backdropComponent={CustomBackdrop}
          backgroundComponent={CustomBackground}
          handleComponent={CustomHandle}
          snapPoints={snapPoints}>
          <BottomSheetScrollView
            contentContainerStyle={AppStyles.paddingHorizontal}>
            <View style={[AppStyles.rowSpaceBetween, AppStyles.marginBottom]}>
              <Caption>{t('skills')}</Caption>
              <Button
                mode={filterAll.elements ? 'contained' : 'outlined'}
                onPress={toggleAllElements}>
                {t('all')}
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
                      source={{uri: iconAttribute(index + 1)}}
                      style={AppStyles.squareW10}
                    />
                  </TouchableRipple>
                );
              })}
            </View>
            <View style={AppStyles.marginBottom}>
              <Caption>{t('enemy-type')}</Caption>
            </View>
            <View style={AppStyles.row}>
              <Button
                mode={filter.type[1] ? 'contained' : 'outlined'}
                uppercase={false}
                onPress={setStageGirlType}>
                {t('stage-girls')}
              </Button>
              <View style={AppStyles.spaceHorizontal} />
              <Button
                mode={filter.type[0] ? 'contained' : 'outlined'}
                uppercase={false}
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

Enemies.whyDidYouRender = true;

export default Enemies;
