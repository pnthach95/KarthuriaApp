import {FlashList} from '@shopify/flash-list';
import API, {links} from 'api';
import {iconAttribute, imgStageGirl} from 'api/images';
import {attackType, charaImgs, position, rarity} from 'assets';
import frame from 'assets/common/frame_stage_girl.png';
import EmptyList from 'components/emptylist';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import AttackTypesBottomSheet from 'components/sheet/attacktypes';
import CharactersBottomSheet from 'components/sheet/characters';
import ElementsBottomSheet from 'components/sheet/elements';
import PositionsBottomSheet from 'components/sheet/positions';
import RaritiesBottomSheet from 'components/sheet/rarities';
import SkillsBottomSheet from 'components/sheet/skills';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FAB, Text, TouchableRipple} from 'react-native-paper';
import {useSafeAreaPaddingTop} from 'theme/styles';
import {useImmer} from 'use-immer';
import {characterToIndex} from 'utils';
import type {ContentStyle, ListRenderItem} from '@shopify/flash-list';
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

const sgKeyExtractor = ({basicInfo}: TDressBasicInfo) =>
  `sg_${basicInfo.cardID}`;

const StageGirlsScreen = ({
  navigation,
}: MainBottomTabScreenProps<'StageGirlsScreen'>) => {
  const {t} = useTranslation();
  const charactersRef = useRef<CharactersBottomSheet>(null);
  const elementsRef = useRef<ElementsBottomSheet>(null);
  const positionsRef = useRef<PositionsBottomSheet>(null);
  const attackTypesRef = useRef<AttackTypesBottomSheet>(null);
  const raritiesRef = useRef<RaritiesBottomSheet>(null);
  const skillsRef = useRef<SkillsBottomSheet>(null);
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

  /** On press FAB */
  const openFABGroup = () => setFABState(!fabState);

  /** FAB children */
  const fabActions = [
    {
      icon: 'account',
      label: 'Characters',
      onPress: () => {
        charactersRef.current?.openSheet();
      },
    },
    {
      icon: 'cloud',
      label: 'Elements',
      onPress: () => {
        elementsRef.current?.openSheet();
      },
    },
    {
      icon: 'chevron-triple-right',
      label: 'Position',
      onPress: () => {
        positionsRef.current?.openSheet();
      },
    },
    {
      icon: 'fencing',
      label: 'Attack type',
      onPress: () => {
        attackTypesRef.current?.openSheet();
      },
    },
    {
      icon: 'star',
      label: 'Rarity',
      onPress: () => {
        raritiesRef.current?.openSheet();
      },
    },
    {
      icon: 'chemical-weapon',
      label: 'Skills',
      onPress: () => {
        skillsRef.current?.openSheet();
      },
    },
  ];

  //#endregion

  //#region Render stage girls

  const sgRenderItem: ListRenderItem<TDressBasicInfo> = useCallback(
    ({item}) => {
      const {basicInfo, base, stat} = item;
      const onPress = () => {
        navigation.navigate('StageGirlDetail', {id: basicInfo.cardID});
      };

      return (
        <TouchableRipple className="flex-1 p-1" onPress={onPress}>
          <>
            <View className="mb-1 flex-1 justify-center">
              <Text className="text-center">
                {basicInfo.name.en || basicInfo.name.ja}
              </Text>
            </View>
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
                className="absolute aspect-square w-5"
                source={{uri: iconAttribute(base.attribute)}}
              />
              <Image
                className="absolute top-5 h-3 w-5"
                source={position(base.roleIndex.role)}
              />
              <Image
                className="absolute bottom-0 h-[14px] w-[70px] self-center"
                resizeMode="contain"
                source={rarity(basicInfo.rarity)}
              />
              <Image
                className="absolute right-0 h-4 w-5"
                source={attackType(base.attackType)}
              />
            </View>
            <Text className="text-center">
              {t('total-stat', {total: stat.total})}
            </Text>
          </>
        </TouchableRipple>
      );
    },
    [],
  );

  //#endregion

  const toggleAllCharacters = () => {
    setFilter(draft => {
      draft.characters = draft.characters.map(() => !filterAll.characters);
    });
    setFilterAll(draft => {
      draft.characters = !draft.characters;
    });
  };

  const onPressAttType0 = () =>
    setFilter(draft => {
      draft.attackType[0] = !draft.attackType[0];
    });

  const onPressAttType1 = () =>
    setFilter(draft => {
      draft.attackType[1] = !filter.attackType[1];
    });

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

  const onPressCharacter = (i: number): void => {
    setFilter(draft => {
      draft.characters[i] = !draft.characters[i];
    });
  };

  const onPressElement = (i: number): void => {
    setFilter(draft => {
      draft.elements[i] = !draft.elements[i];
    });
  };

  const onPressPosition = (i: number): void => {
    setFilter(draft => {
      draft.position[i] = !draft.position[i];
    });
  };

  const onPressRarity = (i: number): void => {
    setFilter(draft => {
      draft.rarity[i] = !draft.rarity[i];
    });
  };

  const onPressSkill = (i: number): void => {
    setFilter(draft => {
      draft.skills[i].checked = !draft.skills[i].checked;
    });
  };

  if (loading) {
    return <Kirin />;
  }

  return (
    <>
      <FlashList
        contentContainerStyle={top as ContentStyle}
        data={rsgList}
        estimatedItemSize={200}
        keyExtractor={sgKeyExtractor}
        ListEmptyComponent={sgList.length > 0 ? EmptyList : ErrorView}
        numColumns={2}
        renderItem={sgRenderItem}
      />
      <FAB.Group
        actions={fabActions}
        icon={fabState ? 'filter-outline' : 'filter'}
        open={fabState}
        visible={true}
        onPress={openFABGroup}
        onStateChange={openFABGroup}
      />
      <CharactersBottomSheet
        ref={charactersRef}
        characters={filter.characters}
        filterAll={filterAll.characters}
        toggleAll={toggleAllCharacters}
        onPress={onPressCharacter}
      />
      <ElementsBottomSheet
        ref={elementsRef}
        elements={filter.elements}
        onPress={onPressElement}
      />
      <PositionsBottomSheet
        ref={positionsRef}
        positions={filter.position}
        onPress={onPressPosition}
      />
      <AttackTypesBottomSheet
        ref={attackTypesRef}
        attackTypes={filter.attackType}
        onPress0={onPressAttType0}
        onPress1={onPressAttType1}
      />
      <RaritiesBottomSheet
        ref={raritiesRef}
        rarities={filter.rarity}
        onPress={onPressRarity}
      />
      <SkillsBottomSheet
        ref={skillsRef}
        filterAll={filterAll.skills}
        skills={filter.skills}
        toggleAll={toggleAllSkills}
        onPress={onPressSkill}
      />
    </>
  );
};

export default StageGirlsScreen;
