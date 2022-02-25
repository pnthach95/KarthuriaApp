import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import FastImage from 'react-native-fast-image';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import API, { links } from '~/api';
import { skillIcon, stageGirlImg } from '~/api/images';
import ErrorView from '~/components/errorview';
import Kirin from '~/components/kirin';
import CustomBackdrop from '~/components/sheet/backdrop';
import CustomBackground from '~/components/sheet/background';
import CustomHandle from '~/components/sheet/handle';
import AppStyles, { borderRadius } from '~/theme/styles';
import { attackType, attribute, charaImgs, position, rarity } from '~/assets';
import { characterToIndex } from '~/util';
import frame from '~/assets/common/frame_stage_girl.png';

import type {
  MainBottomTabScreenProps,
  TDressBasicInfo,
  TDressList,
  TRole,
  TSkillsOnFilter,
} from '~/typings';

type TFilter = Record<
  'characters' | 'elements' | 'position' | 'attackType' | 'rarity',
  boolean[]
> & {
  skills: {
    id: number;
    checked: boolean;
  }[];
};

const styles = StyleSheet.create({
  attackType: {
    height: 17,
    right: 0,
    width: 20,
  },
  positionImg: {
    height: (responsiveWidth(10) * 2) / 3,
    width: responsiveWidth(10),
  },
  positionImgContainer: {
    borderRadius,
    height: (responsiveWidth(12) * 2) / 3,
    width: responsiveWidth(12),
  },
  rarity: {
    bottom: 0,
  },
  role: {
    height: 40 / 3,
    top: 20,
    width: 20,
  },
});

const StageGirlsScreen = ({
  navigation,
}: MainBottomTabScreenProps<'StageGirlsScreen'>) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  /** Loading state */
  const [loading, setLoading] = useState(true);
  /** FAB state */
  const [fabState, setFABState] = useState(false);
  /** List for filter */
  const [sgList, setSGList] = useState<TDressBasicInfo[]>([]);
  /** List for render */
  const [rsgList, setRSGList] = useState<TDressBasicInfo[]>([]);
  /** Filter */
  const [filter, setFilter] = useState<TFilter>({
    characters: charaImgs.map(() => true),
    elements: [true, true, true, true, true, true, true],
    position: [true, true, true],
    attackType: [true, true],
    rarity: [true, true, true],
    skills: [],
  });
  /** State for select/deselect all button */
  const [filterAll, setFilterAll] = useState({
    characters: true,
    skills: true,
  });
  /** Filter key to render filter bottom sheet */
  const [filterKey, setFilterKey] = useState<keyof typeof filter>('characters');
  /** Top inset for iOS */
  const top = {
    paddingTop: insets.top,
  };

  /** Load data here */
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await API.get<TDressList>(links.LIST.DRESS);
        const sData = await API.get<TSkillsOnFilter>(links.LIST.DRESS_SKILLS);
        if (data.ok && data.data) {
          const sg = Object.values(data.data).sort((a, b) =>
            a.basicInfo.released.ja < b.basicInfo.released.ja ? 1 : -1,
          );
          setSGList(sg);
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
        const checkRarity = filter.rarity[item.basicInfo.rarity - 2];
        const checkAtkType = filter.attackType[item.base.attackType - 1];
        const checkPosition = filter.position[p()];
        const checkElement = filter.elements[item.base.attribute - 1];
        const checkCharacter =
          filter.characters[characterToIndex(item.basicInfo.character)];
        const checkSkill = item.base.skills.reduce((res, current) => {
          const findSkill = filter.skills.find((f) => f.id === current);
          if (findSkill) {
            return res && findSkill.checked;
          }
          return res;
        }, true);
        return (
          checkSkill &&
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

  //#region Sheet

  /** Open sheet */
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
      icon: 'cloud',
      label: 'Elements',
      onPress: () => {
        setFilterKey('elements');
        openSheet();
      },
    },
    {
      icon: 'chevron-triple-right',
      label: 'Position',
      onPress: () => {
        setFilterKey('position');
        openSheet();
      },
    },
    {
      icon: 'fencing',
      label: 'Attack type',
      onPress: () => {
        setFilterKey('attackType');
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

  //#region Render stage girls

  const sgKeyExtractor = ({ basicInfo }: TDressBasicInfo) =>
    `sg_${basicInfo.cardID}`;

  const sgRenderItem = ({ item }: { item: TDressBasicInfo }) => {
    const { basicInfo, base, stat } = item;
    const onPress = () => {
      navigation.navigate('StageGirlDetail', { id: basicInfo.cardID });
    };

    return (
      <TouchableRipple onPress={onPress} style={AppStyles.flex1}>
        <View
          style={[
            AppStyles.listItem,
            AppStyles.spaceBetween,
            { borderColor: colors.border },
          ]}>
          <Text style={AppStyles.centerText}>
            {basicInfo.name.en || basicInfo.name.ja}
          </Text>
          <View style={AppStyles.center}>
            <View style={AppStyles.smallImg}>
              <FastImage
                source={{ uri: stageGirlImg(basicInfo.cardID) }}
                style={AppStyles.smallImg}
              />
              <Image
                source={frame}
                style={[AppStyles.smallImg, AppStyles.absolute]}
              />
              <Image
                source={attribute(base.attribute)}
                style={[AppStyles.square20, AppStyles.absolute]}
              />
              <Image
                source={position(base.roleIndex.role)}
                style={[styles.role, AppStyles.absolute]}
              />
              <Image
                source={rarity(basicInfo.rarity)}
                resizeMode='contain'
                style={[AppStyles.rarityImg, styles.rarity, AppStyles.absolute]}
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

  //#region Render element filter

  const elementKeyExtractor = (item: boolean, i: number) => `element_${i}`;

  const elementRenderItem = ({
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
        elements: filter.elements.map((v, j) => (index === j ? !v : v)),
      });
    return (
      <TouchableRipple
        borderless
        style={[AppStyles.center, AppStyles.elementImgContainer, bgColor]}
        onPress={onPress}>
        <Image source={attribute(index + 1)} style={AppStyles.squareW10} />
      </TouchableRipple>
    );
  };

  //#endregion

  //#region Render position filter

  const positionKeyExtractor = (item: boolean, i: number): string => `p_${i}`;

  const positionRenderItem = ({
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
        position: filter.position.map((v, j) => (index === j ? !v : v)),
      });
    return (
      <View style={AppStyles.row}>
        <TouchableRipple
          borderless
          style={[AppStyles.center, styles.positionImgContainer, bgColor]}
          onPress={onPress}>
          <Image source={position(index as TRole)} style={styles.positionImg} />
        </TouchableRipple>
        <View style={AppStyles.spaceHorizontal} />
      </View>
    );
  };

  //#endregion

  //#region Render attack type filter

  const onPressAttType0 = () =>
    setFilter({
      ...filter,
      attackType: [!filter.attackType[0], filter.attackType[1]],
    });

  const onPressAttType1 = () =>
    setFilter({
      ...filter,
      attackType: [filter.attackType[0], !filter.attackType[1]],
    });

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
        <Image source={rarity(index + 2)} resizeMode='contain' />
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

  if (sgList.length > 0) {
    return (
      <>
        <FlatList
          data={rsgList}
          keyExtractor={sgKeyExtractor}
          renderItem={sgRenderItem}
          style={top}
          ListEmptyComponent={emptyList}
          numColumns={2}
          initialNumToRender={12}
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
            {/* Element filter */}
            {filterKey === 'elements' && (
              <>
                <Caption>Elements</Caption>
                <BottomSheetFlatList
                  data={filter.elements}
                  keyExtractor={elementKeyExtractor}
                  numColumns={7}
                  columnWrapperStyle={AppStyles.spaceBetween}
                  renderItem={elementRenderItem}
                />
              </>
            )}
            {/* Position filter */}
            {filterKey === 'position' && (
              <>
                <Caption>Position</Caption>
                <BottomSheetFlatList
                  data={filter.position}
                  horizontal
                  keyExtractor={positionKeyExtractor}
                  renderItem={positionRenderItem}
                />
              </>
            )}
            {/* Attack type filter */}
            {filterKey === 'attackType' && (
              <>
                <Caption>Attack Type</Caption>
                <View style={AppStyles.row}>
                  <TouchableRipple
                    borderless
                    style={[
                      AppStyles.squareW12,
                      AppStyles.center,
                      AppStyles.borderRadius,
                      {
                        backgroundColor: filter.attackType[0]
                          ? colors.primary
                          : undefined,
                      },
                    ]}
                    onPress={onPressAttType0}>
                    <Image source={attackType(1)} style={AppStyles.squareW10} />
                  </TouchableRipple>
                  <View style={AppStyles.spaceHorizontal} />
                  <TouchableRipple
                    borderless
                    style={[
                      AppStyles.squareW12,
                      AppStyles.center,
                      AppStyles.borderRadius,
                      {
                        backgroundColor: filter.attackType[1]
                          ? colors.primary
                          : undefined,
                      },
                    ]}
                    onPress={onPressAttType1}>
                    <Image source={attackType(2)} style={AppStyles.squareW10} />
                  </TouchableRipple>
                </View>
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

StageGirlsScreen.whyDidYouRender = true;

export default StageGirlsScreen;
