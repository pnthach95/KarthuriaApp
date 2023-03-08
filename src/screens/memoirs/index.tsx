import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {FlashList} from '@shopify/flash-list';
import API, {links} from 'api';
import {iconSkill, imgMemoir} from 'api/images';
import {charaImgs, rarity} from 'assets';
import cutin from 'assets/common/cutin.png';
import frame from 'assets/common/frame_equip.png';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import CustomBackdrop from 'components/sheet/backdrop';
import CustomBackground from 'components/sheet/background';
import CustomHandle from 'components/sheet/handle';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
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
import {useImmer} from 'use-immer';
import {characterToIndex} from 'utils';
import type {ListRenderItem as FlashListRenderItem} from '@shopify/flash-list';
import type {ListRenderItem} from 'react-native';
import type {MainBottomTabScreenProps} from 'typings/navigation';

type TFilter = Record<'characters' | 'rarity', boolean[]> & {
  skills: {
    id: number;
    checked: boolean;
  }[];
};

const styles = StyleSheet.create({
  cutIn: {
    height: 22,
    marginLeft: 10,
    width: 26,
  },
  skillIcon: {
    height: 25,
    width: 25,
  },
});

const mKeyExtractor = (item: TEquipBasicInfo) =>
  'memoir_' + item.basicInfo.cardID;
const charaKeyExtractor = (item: boolean, i: number) => `charaImg_${i}`;
const skillKeyExtractor = (item: TFilter['skills'][0], i: number) =>
  `skill_${i}`;
const rarityKeyExtractor = (item: boolean, i: number) => `rarity_${i}`;
const raritySeparator = () => <View style={AppStyles.spaceHorizontal} />;

const MemoirsScreen = ({
  navigation,
}: MainBottomTabScreenProps<'MemoirsScreen'>) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  /** FAB state */
  const [fabState, setFABState] = useState(false);
  const [loading, setLoading] = useState(true);
  /** List for filter */
  const [mList, setMList] = useState<TEquipBasicInfo[]>([]);
  /** List for render */
  const [rmList, setRMList] = useState<TEquipBasicInfo[]>([]);
  /** Filter */
  const [filter, setFilter] = useImmer<TFilter>({
    characters: charaImgs.map(() => true),
    rarity: [true, true, true, true],
    skills: [],
  });
  /** Filter key to render filter bottom sheet */
  const [filterKey, setFilterKey] = useState<keyof typeof filter>('characters');
  /** State for select/deselect all button */
  const [filterAll, setFilterAll] = useState({
    characters: true,
    skills: true,
  });
  /** Top inset for iOS */
  const top = {
    paddingTop: insets.top,
  };

  /** Load data here */
  useEffect(() => {
    const loadData = async () => {
      try {
        const gotData = await API.get<TEquipList>(links.LIST.EQUIP);
        const sData = await API.get<TSkillsOnFilter>(links.LIST.EQUIP_SKILLS);
        if (gotData.ok && gotData.data) {
          setMList(
            Object.values(gotData.data).sort((a, b) =>
              a.basicInfo.released.ja < b.basicInfo.released.ja ? 1 : -1,
            ),
          );
        }
        if (sData.ok && sData.data) {
          const skills = Object.keys(sData.data).map(k => ({
            id: parseInt(k, 10),
            checked: true,
          }));
          setFilter(draft => {
            draft.skills = skills;
          });
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
    if (mList.length > 0) {
      const afterFilter = mList.filter(item => {
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

  //#region Sheet

  const openSheet = () => bottomSheetModalRef.current?.present();

  /** On press FAB */
  const openFABGroup = () => setFABState(!fabState);

  /** FAB children */
  const fabActions = [
    {
      icon: 'account',
      label: 'Characters',
      onPress: () => {
        setFilterKey('characters');
        openSheet();
      },
    },
    {
      icon: 'star',
      label: 'Rarity',
      onPress: () => {
        setFilterKey('rarity');
        openSheet();
      },
    },
    {
      icon: 'chemical-weapon',
      label: 'Skills',
      onPress: () => {
        setFilterKey('skills');
        openSheet();
      },
    },
  ];

  //#endregion

  //#region Memoir list

  const mRenderItem: FlashListRenderItem<TEquipBasicInfo> = ({item}) => {
    const onPress = () =>
      navigation.navigate('MemoirDetail', {id: item.basicInfo.cardID});

    return (
      <TouchableRipple
        className="flex-1 border p-1"
        style={{borderColor: colors.outlineVariant}}
        onPress={onPress}>
        <>
          <View style={[AppStyles.selfCenter, AppStyles.smallImg]}>
            <FastImage
              source={{uri: imgMemoir(item.basicInfo.cardID)}}
              style={[AppStyles.selfCenter, AppStyles.smallImg]}
            />
            <Image
              source={frame}
              style={[
                AppStyles.selfCenter,
                AppStyles.smallImg,
                AppStyles.absolute,
              ]}
            />
          </View>
          <Image
            resizeMode="contain"
            source={rarity(item.basicInfo.rarity)}
            style={AppStyles.rarityImg}
          />
          <View className="flex-row flex-wrap items-center justify-center">
            {[
              ...new Set([
                ...new Set(item.skill),
                ...new Set(item.activeSkill || []),
              ]),
            ].map(s => {
              return (
                <FastImage
                  key={`skill_icon_${s}`}
                  source={{uri: iconSkill(s)}}
                  style={styles.skillIcon}
                />
              );
            })}
            {item.activeSkill && <Image source={cutin} style={styles.cutIn} />}
          </View>
          <Text style={AppStyles.centerText}>
            {item.basicInfo.name.en || item.basicInfo.name.ja}
          </Text>
        </>
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

  //#region Render character filter

  const toggleAllCharacters = () => {
    setFilter(draft => {
      draft.characters = draft.characters.map(() => !filterAll.characters);
    });
    setFilterAll({
      ...filterAll,
      characters: !filterAll.characters,
    });
  };

  const charaRenderItem: ListRenderItem<boolean> = ({item, index}) => {
    const bgColor = {
      backgroundColor: item ? colors.primary : undefined,
    };
    const onPress = () =>
      setFilter(draft => {
        draft.characters[index] = !draft.characters[index];
      });
    return (
      <TouchableRipple
        borderless
        style={[AppStyles.charaImgContainer, bgColor]}
        onPress={onPress}>
        <Image source={charaImgs[index]} style={AppStyles.squareW12} />
      </TouchableRipple>
    );
  };

  //#endregion

  //#region Render rarity filter

  const rarityRenderItem: ListRenderItem<boolean> = ({item, index}) => {
    const bgColor = {
      backgroundColor: item ? colors.primary : undefined,
    };
    const onPress = () =>
      setFilter(draft => {
        draft.rarity[index] = !draft.rarity[index];
      });
    return (
      <TouchableRipple
        borderless
        style={[AppStyles.rarityImgContainer, AppStyles.selfStart, bgColor]}
        onPress={onPress}>
        <Image resizeMode="contain" source={rarity(index + 1)} />
      </TouchableRipple>
    );
  };

  //#endregion

  //#region Render skill filter

  const toggleAllSkills = () => {
    setFilter(draft => {
      draft.skills = draft.skills.map(item => ({
        ...item,
        checked: !filterAll.skills,
      }));
    });
    setFilterAll({
      ...filterAll,
      skills: !filterAll.skills,
    });
  };

  const skillRenderItem: ListRenderItem<TFilter['skills'][0]> = ({
    item,
    index,
  }) => {
    const bgColor = {
      backgroundColor: item.checked ? colors.primary : undefined,
    };
    const onPress = () =>
      setFilter(draft => {
        draft.skills[index].checked = !draft.skills[index].checked;
      });
    const source = {uri: iconSkill(item.id)};
    return (
      <TouchableRipple
        borderless
        style={[
          AppStyles.center,
          AppStyles.marginBottom,
          AppStyles.elementImgContainer,
          bgColor,
        ]}
        onPress={onPress}>
        <Image source={source} style={AppStyles.squareW10} />
      </TouchableRipple>
    );
  };

  //#endregion

  if (loading) {
    return <Kirin />;
  }

  if (mList.length > 0) {
    return (
      <>
        <FlashList
          contentContainerStyle={top}
          data={rmList}
          estimatedItemSize={96}
          keyExtractor={mKeyExtractor}
          ListEmptyComponent={emptyList}
          numColumns={2}
          renderItem={mRenderItem}
        />
        <FAB.Group
          actions={fabActions}
          icon={fabState ? 'filter-outline' : 'filter'}
          open={fabState}
          visible={true}
          onPress={openFABGroup}
          onStateChange={openFABGroup}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backdropComponent={CustomBackdrop}
          backgroundComponent={CustomBackground}
          handleComponent={CustomHandle}
          snapPoints={snapPoints}>
          <View style={[AppStyles.paddingHorizontal, AppStyles.flex1]}>
            {/* Character filter */}
            {filterKey === 'characters' && (
              <>
                <View
                  style={[AppStyles.rowSpaceBetween, AppStyles.marginBottom]}>
                  <Caption>{t('characters')}</Caption>
                  <Button
                    mode={filterAll.characters ? 'contained' : 'outlined'}
                    onPress={toggleAllCharacters}>
                    {t('all')}
                  </Button>
                </View>
                <BottomSheetFlatList
                  columnWrapperStyle={AppStyles.spaceBetween}
                  data={filter.characters}
                  keyExtractor={charaKeyExtractor}
                  numColumns={7}
                  renderItem={charaRenderItem}
                />
              </>
            )}
            {/* Rarity filter */}
            {filterKey === 'rarity' && (
              <>
                <Caption>{t('rarity')}</Caption>
                <BottomSheetFlatList
                  horizontal
                  data={filter.rarity}
                  ItemSeparatorComponent={raritySeparator}
                  keyExtractor={rarityKeyExtractor}
                  renderItem={rarityRenderItem}
                />
              </>
            )}
            {/* Skill filter */}
            {filterKey === 'skills' && (
              <>
                <View
                  style={[AppStyles.rowSpaceBetween, AppStyles.marginBottom]}>
                  <Caption>{t('skills')}</Caption>
                  <Button
                    mode={filterAll.skills ? 'contained' : 'outlined'}
                    onPress={toggleAllSkills}>
                    {t('all')}
                  </Button>
                </View>
                <BottomSheetFlatList
                  columnWrapperStyle={AppStyles.spaceBetween}
                  data={filter.skills}
                  keyExtractor={skillKeyExtractor}
                  numColumns={7}
                  renderItem={skillRenderItem}
                />
              </>
            )}
          </View>
        </BottomSheetModal>
      </>
    );
  }

  return <ErrorView />;
};

MemoirsScreen.whyDidYouRender = true;

export default MemoirsScreen;
