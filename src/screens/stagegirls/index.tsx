import {
  BottomSheetFlatList,
  BottomSheetHandle,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import API, {links} from 'api';
import {iconAttribute, iconSkill, imgStageGirl} from 'api/images';
import {attackType, charaImgs, position, rarity} from 'assets';
import frame from 'assets/common/frame_stage_girl.png';
import EmptyList from 'components/emptylist';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import Separator from 'components/separator';
import CustomBackdrop from 'components/sheet/backdrop';
import CustomBackground from 'components/sheet/background';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, FAB, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import AppStyles, {
  borderRadius,
  padding,
  useSafeAreaPaddingTop,
} from 'theme/styles';
import {useImmer} from 'use-immer';
import {characterToIndex} from 'utils';
import type {ListRenderItem} from 'react-native';
import type {MainBottomTabScreenProps} from 'typings/navigation';

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
  charContainer: {
    paddingBottom: 20,
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
  sheetItem: {
    width: (responsiveWidth(100) - 2 * padding) / 7,
  },
});

const sgKeyExtractor = ({basicInfo}: TDressBasicInfo) =>
  `sg_${basicInfo.cardID}`;
const charaKeyExtractor = (item: boolean, i: number) => `charaImg_${i}`;
const elementKeyExtractor = (item: boolean, i: number) => `element_${i}`;
const positionKeyExtractor = (item: boolean, i: number): string => `p_${i}`;
const rarityKeyExtractor = (item: boolean, i: number) => `rarity_${i}`;
const skillKeyExtractor = (item: TFilter['skills'][0], i: number) =>
  `skill_${i}`;
const raritySeparator = () => <View className="w-3" />;

const StageGirlsScreen = ({
  navigation,
}: MainBottomTabScreenProps<'StageGirlsScreen'>) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  /** Loading state */
  const [loading, setLoading] = useState(true);
  /** FAB state */
  const [fabState, setFABState] = useState(false);
  /** List for filter */
  const [sgList, setSGList] = useState<TDressBasicInfo[]>([]);
  /** List for render */
  const [rsgList, setRSGList] = useState<TDressBasicInfo[]>([]);
  /** Filter */
  const [filter, setFilter] = useImmer<TFilter>({
    characters: charaImgs.map(() => true),
    elements: [true, true, true, true, true, true, true, true, true],
    position: [true, true, true],
    attackType: [true, true],
    rarity: [true, true, true],
    skills: [],
  });
  /** State for select/deselect all button */
  const [filterAll, setFilterAll] = useImmer({
    characters: true,
    skills: true,
  });
  /** Filter key to render filter bottom sheet */
  const [filterKey, setFilterKey] = useState<keyof typeof filter>('characters');
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  /** Top inset for iOS */
  const top = useSafeAreaPaddingTop();

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
        setFilter(draft => {
          if (sData.ok && sData.data) {
            draft.skills = Object.keys(sData.data).map(k => ({
              id: parseInt(k, 10),
              checked: true,
            }));
          }
        });
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
    if (sgList.length > 0) {
      const afterFilter = sgList.filter(item => {
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
          const findSkill = filter.skills.find(f => f.id === current);
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

  const sgRenderItem: ListRenderItem<TDressBasicInfo> = ({item}) => {
    const {basicInfo, base, stat} = item;
    const onPress = () => {
      navigation.navigate('StageGirlDetail', {id: basicInfo.cardID});
    };

    return (
      <TouchableRipple
        className="flex-1 border p-1"
        style={{borderColor: colors.outlineVariant}}
        onPress={onPress}>
        <>
          <Text className="text-center">
            {basicInfo.name.en || basicInfo.name.ja}
          </Text>
          <View className="aspect-stage-girl h-20 self-center">
            <FastImage
              className="aspect-stage-girl h-20"
              source={{uri: imgStageGirl(basicInfo.cardID)}}
            />
            <FastImage
              className="absolute aspect-stage-girl h-20"
              source={frame}
            />
            <Image
              source={{uri: iconAttribute(base.attribute)}}
              style={[AppStyles.square20, AppStyles.absolute]}
            />
            <Image
              source={position(base.roleIndex.role)}
              style={[styles.role, AppStyles.absolute]}
            />
            <Image
              resizeMode="contain"
              source={rarity(basicInfo.rarity)}
              style={[AppStyles.rarityImg, styles.rarity, AppStyles.absolute]}
            />
            <Image
              source={attackType(base.attackType)}
              style={[styles.attackType, AppStyles.absolute]}
            />
          </View>
          <Text className="text-center">
            {t('total-stat', {total: stat.total})}
          </Text>
        </>
      </TouchableRipple>
    );
  };

  //#endregion

  //#region Render character filter

  const toggleAllCharacters = () => {
    setFilter(draft => {
      draft.characters = draft.characters.map(() => !filterAll.characters);
    });
    setFilterAll(draft => {
      draft.characters = !draft.characters;
    });
  };

  const charaRenderItem: ListRenderItem<boolean> = ({item, index}) => {
    const bgColor = {
      backgroundColor: item ? colors.primary : undefined,
    };
    const onPress = () => {
      setFilter(draft => {
        draft.characters[index] = !draft.characters[index];
      });
    };

    return (
      <View style={styles.sheetItem}>
        <TouchableRipple
          borderless
          style={[AppStyles.center, AppStyles.charaImgContainer, bgColor]}
          onPress={onPress}>
          <Image source={charaImgs[index]} style={AppStyles.squareW12} />
        </TouchableRipple>
      </View>
    );
  };

  //#endregion

  //#region Render element filter

  const elementRenderItem: ListRenderItem<boolean> = ({item, index}) => {
    const bgColor = {
      backgroundColor: item ? colors.primary : undefined,
    };
    const onPress = () => {
      setFilter(draft => {
        draft.elements[index] = !draft.elements[index];
      });
    };

    return (
      <View style={styles.sheetItem}>
        <TouchableRipple
          borderless
          style={[AppStyles.center, AppStyles.elementImgContainer, bgColor]}
          onPress={onPress}>
          <Image
            source={{uri: iconAttribute(index + 1)}}
            style={AppStyles.squareW10}
          />
        </TouchableRipple>
      </View>
    );
  };

  //#endregion

  //#region Render position filter

  const positionRenderItem: ListRenderItem<boolean> = ({item, index}) => {
    const bgColor = {
      backgroundColor: item ? colors.primary : undefined,
    };
    const onPress = () => {
      setFilter(draft => {
        draft.position[index] = !draft.position[index];
      });
    };

    return (
      <View className="flex-row">
        <TouchableRipple
          borderless
          style={[AppStyles.center, styles.positionImgContainer, bgColor]}
          onPress={onPress}>
          <Image source={position(index as TRole)} style={styles.positionImg} />
        </TouchableRipple>
        <View className="w-3" />
      </View>
    );
  };

  //#endregion

  //#region Render attack type filter

  const onPressAttType0 = () =>
    setFilter(draft => {
      draft.attackType[0] = !draft.attackType[0];
    });

  const onPressAttType1 = () =>
    setFilter(draft => {
      draft.attackType[1] = !filter.attackType[1];
    });

  //#endregion

  //#region Render rarity filter

  const rarityRenderItem: ListRenderItem<boolean> = ({item, index}) => {
    const bgColor = {
      backgroundColor: item ? colors.primary : undefined,
    };
    const onPress = () => {
      setFilter(draft => {
        draft.rarity[index] = !draft.rarity[index];
      });
    };

    return (
      <TouchableRipple
        borderless
        style={[AppStyles.rarityImgContainer, AppStyles.selfStart, bgColor]}
        onPress={onPress}>
        <Image resizeMode="contain" source={rarity(index + 2)} />
      </TouchableRipple>
    );
  };

  //#endregion

  //#region Render skill filter

  const toggleAllSkills = () => {
    setFilter(draft => {
      for (let i = 0; i < draft.skills.length; i++) {
        draft.skills[i].checked = !filterAll.skills;
      }
    });
    setFilterAll(draft => {
      draft.skills = !draft.skills;
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

  if (sgList.length > 0) {
    return (
      <>
        <FlatList
          data={rsgList}
          initialNumToRender={12}
          keyExtractor={sgKeyExtractor}
          ListEmptyComponent={EmptyList}
          numColumns={2}
          renderItem={sgRenderItem}
          style={top}
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
          contentHeight={animatedContentHeight}
          handleComponent={props => (
            <BottomSheetHandle
              {...props}
              indicatorStyle={{backgroundColor: colors.onBackground}}
            />
          )}
          handleHeight={animatedHandleHeight}
          snapPoints={animatedSnapPoints}>
          <View className="flex-1 px-3" onLayout={handleContentLayout}>
            {/* Character filter */}
            {filterKey === 'characters' && (
              <>
                <View className="mb-3 flex-row items-center justify-between">
                  <Text variant="labelMedium">{t('characters')}</Text>
                  <Button
                    mode={filterAll.characters ? 'contained' : 'outlined'}
                    onPress={toggleAllCharacters}>
                    {t('all')}
                  </Button>
                </View>
                <BottomSheetFlatList
                  contentContainerStyle={styles.charContainer}
                  data={filter.characters}
                  ItemSeparatorComponent={Separator}
                  keyExtractor={charaKeyExtractor}
                  numColumns={7}
                  renderItem={charaRenderItem}
                  showsVerticalScrollIndicator={false}
                />
              </>
            )}
            {/* Element filter */}
            {filterKey === 'elements' && (
              <>
                <Text variant="labelMedium">{t('elements')}</Text>
                <BottomSheetFlatList
                  data={filter.elements}
                  ItemSeparatorComponent={Separator}
                  keyExtractor={elementKeyExtractor}
                  numColumns={7}
                  renderItem={elementRenderItem}
                />
              </>
            )}
            {/* Position filter */}
            {filterKey === 'position' && (
              <>
                <Text variant="labelMedium">{t('position')}</Text>
                <BottomSheetFlatList
                  horizontal
                  data={filter.position}
                  keyExtractor={positionKeyExtractor}
                  renderItem={positionRenderItem}
                />
              </>
            )}
            {/* Attack type filter */}
            {filterKey === 'attackType' && (
              <>
                <Text variant="labelMedium">{t('attack-type')}</Text>
                <View className="flex-row">
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
                  <View className="w-3" />
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
                <Text variant="labelMedium">{t('rarity')}</Text>
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
                  <Text variant="labelMedium">{t('skills')}</Text>
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

export default StageGirlsScreen;
