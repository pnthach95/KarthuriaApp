import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import {
  Button,
  Caption,
  FAB,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
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
  TSkillsOnFilter,
} from '~/typings';

type TFilter = Record<'characters' | 'rarity', boolean[]> & {
  skills: {
    id: number;
    checked: boolean;
  }[];
};

const styles = StyleSheet.create({
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
  /** FAB state */
  const [fabState, setFABState] = useState(false);
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
              a.basicInfo.published.ja < b.basicInfo.published.ja ? 1 : -1,
            ),
          );
        }
        if (sData.ok && sData.data) {
          const skills = Object.keys(sData.data).map((k) => ({
            id: parseInt(k),
            checked: true,
          }));
          setFilter({ ...filter, skills });
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
        const checkSkill = filter.skills.find((s) => s.id === item.skill.iconID)
          ?.checked;
        return checkRarity && checkCharacter && checkSkill;
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

  const mKeyExtractor = (item: TEquipBasicInfo) =>
    'memoir_' + item.basicInfo.cardID;

  const mRenderItem = ({ item }: { item: TEquipBasicInfo }) => {
    const onPress = () =>
      navigation.navigate('MemoirDetail', { id: item.basicInfo.cardID });

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View style={[AppStyles.listItem, { borderColor: colors.border }]}>
          <View style={[AppStyles.selfCenter, AppStyles.smallImg]}>
            <FastImage
              source={{ uri: memoirImg(item.basicInfo.cardID) }}
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
          <View style={[AppStyles.center, AppStyles.row]}>
            <Image
              source={rarity(item.basicInfo.rarity)}
              resizeMode='contain'
              style={AppStyles.rarityImg}
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

  const emptyList = () => {
    return (
      <View style={[AppStyles.flex1, AppStyles.center, AppStyles.marginTop]}>
        <Text>No data. Please check filter.</Text>
      </View>
    );
  };

  //#endregion

  //#region Render character filter

  const toggleAllCharacters = () => {
    setFilter({
      ...filter,
      characters: filter.characters.map(() => !filterAll.characters),
    });
    setFilterAll({
      ...filterAll,
      characters: !filterAll.characters,
    });
  };

  const charaKeyExtractor = (item: boolean, i: number) => `charaImg_${i}`;

  const charaRenderItem = ({
    item,
    index,
  }: {
    item: boolean;
    index: number;
  }) => {
    const bgColor = {
      backgroundColor: item ? colors.primary : undefined,
    };
    const onPress = () =>
      setFilter({
        ...filter,
        characters: filter.characters.map((v, j) => (index === j ? !v : v)),
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

  const rarityKeyExtractor = (item: boolean, i: number) => `rarity_${i}`;

  const raritySeparator = () => <View style={AppStyles.spaceHorizontal} />;

  const rarityRenderItem = ({
    item,
    index,
  }: {
    item: boolean;
    index: number;
  }) => {
    const bgColor = {
      backgroundColor: item ? colors.primary : undefined,
    };
    const onPress = () =>
      setFilter({
        ...filter,
        rarity: filter.rarity.map((v, j) => (index === j ? !v : v)),
      });
    return (
      <TouchableRipple
        borderless
        style={[AppStyles.rarityImgContainer, AppStyles.selfStart, bgColor]}
        onPress={onPress}>
        <Image source={rarity(index + 1)} resizeMode='contain' />
      </TouchableRipple>
    );
  };

  //#endregion

  //#region Render skill filter

  const toggleAllSkills = () => {
    setFilter({
      ...filter,
      skills: filter.skills.map((item) => ({
        ...item,
        checked: !filterAll.skills,
      })),
    });
    setFilterAll({
      ...filterAll,
      skills: !filterAll.skills,
    });
  };

  const skillKeyExtractor = (item: TFilter['skills'][0], i: number) =>
    `skill_${i}`;

  const skillRenderItem = ({
    item,
    index,
  }: {
    item: TFilter['skills'][0];
    index: number;
  }) => {
    const bgColor = {
      backgroundColor: item.checked ? colors.primary : undefined,
    };
    const onPress = () =>
      setFilter({
        ...filter,
        skills: filter.skills.map((v, j) =>
          index === j ? { ...v, checked: !v.checked } : v,
        ),
      });
    const source = { uri: skillIcon(item.id) };
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
        <FlatList
          data={rmList}
          numColumns={2}
          keyExtractor={mKeyExtractor}
          renderItem={mRenderItem}
          style={top}
          initialNumToRender={12}
          ListEmptyComponent={emptyList}
        />
        <FAB.Group
          open={fabState}
          visible={true}
          icon={fabState ? 'filter-outline' : 'filter'}
          onStateChange={openFABGroup}
          actions={fabActions}
          onPress={openFABGroup}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          backdropComponent={CustomBackdrop}
          backgroundComponent={CustomBackground}
          handleComponent={CustomHandle}>
          <View style={[AppStyles.paddingHorizontal, AppStyles.flex1]}>
            {/* Character filter */}
            {filterKey === 'characters' && (
              <>
                <View
                  style={[AppStyles.rowSpaceBetween, AppStyles.marginBottom]}>
                  <Caption>Characters</Caption>
                  <Button
                    mode={filterAll.characters ? 'contained' : 'outlined'}
                    onPress={toggleAllCharacters}>
                    All
                  </Button>
                </View>
                <BottomSheetFlatList
                  data={filter.characters}
                  keyExtractor={charaKeyExtractor}
                  numColumns={7}
                  columnWrapperStyle={AppStyles.spaceBetween}
                  renderItem={charaRenderItem}
                />
              </>
            )}
            {/* Rarity filter */}
            {filterKey === 'rarity' && (
              <>
                <Caption>Rarity</Caption>
                <BottomSheetFlatList
                  data={filter.rarity}
                  keyExtractor={rarityKeyExtractor}
                  horizontal
                  ItemSeparatorComponent={raritySeparator}
                  renderItem={rarityRenderItem}
                />
              </>
            )}
            {/* Skill filter */}
            {filterKey === 'skills' && (
              <>
                <View
                  style={[AppStyles.rowSpaceBetween, AppStyles.marginBottom]}>
                  <Caption>Skills</Caption>
                  <Button
                    mode={filterAll.skills ? 'contained' : 'outlined'}
                    onPress={toggleAllSkills}>
                    All
                  </Button>
                </View>
                <BottomSheetFlatList
                  data={filter.skills}
                  numColumns={7}
                  keyExtractor={skillKeyExtractor}
                  columnWrapperStyle={AppStyles.spaceBetween}
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

export default Memoirs;
