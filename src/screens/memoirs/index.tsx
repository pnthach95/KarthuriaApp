import {FasterImageView} from '@candlefinance/faster-image';
import {FlashList} from '@shopify/flash-list';
import API, {links} from 'api';
import {iconSkill, imgMemoir} from 'api/images';
import {charaImgs, rarity} from 'assets';
import cutin from 'assets/common/cutin.png';
import frame from 'assets/common/frame_equip.png';
import EmptyList from 'components/emptylist';
import ErrorView from 'components/errorview';
import Kirin from 'components/kirin';
import CharactersBottomSheet from 'components/sheet/characters';
import RaritiesBottomSheet from 'components/sheet/rarities';
import SkillsBottomSheet from 'components/sheet/skills';
import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {FAB, Text, TouchableRipple} from 'react-native-paper';
import {useSafeAreaPaddingTop} from 'theme/styles';
import {useImmer} from 'use-immer';
import {characterToIndex} from 'utils';
import type {
  ContentStyle,
  ListRenderItem as FlashListRenderItem,
} from '@shopify/flash-list';
import type {MainBottomTabScreenProps} from 'typings/navigation';

type TFilter = Record<'characters' | 'rarity', boolean[]> & {
  skills: {
    id: number;
    checked: boolean;
  }[];
};

const mKeyExtractor = (item: TEquipBasicInfo) =>
  'memoir_' + item.basicInfo.cardID;

const styles = StyleSheet.create({
  card: {alignSelf: 'center', height: 80, width: 72},
  icon: {aspectRatio: 1, width: 24},
});

const MemoirsScreen = ({
  navigation,
}: MainBottomTabScreenProps<'MemoirsScreen'>) => {
  const charactersRef = useRef<CharactersBottomSheet>(null);
  const raritiesRef = useRef<RaritiesBottomSheet>(null);
  const skillsRef = useRef<SkillsBottomSheet>(null);
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
  /** State for select/deselect all button */
  const [filterAll, setFilterAll] = useState({
    characters: true,
    skills: true,
  });
  /** Top inset for iOS */
  const top = useSafeAreaPaddingTop();

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
        const checkCharacter = item.basicInfo.charas
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

  const mRenderItem: FlashListRenderItem<TEquipBasicInfo> = ({item}) => {
    const onPress = () =>
      navigation.navigate('MemoirDetail', {id: item.basicInfo.cardID});

    return (
      <TouchableRipple className="flex-1 p-1" onPress={onPress}>
        <>
          <View className="h-20 w-[72px] self-center">
            <FasterImageView
              source={{url: imgMemoir(item.basicInfo.cardID)}}
              style={styles.card}
            />
            <Image
              className="absolute h-20 w-[72px] self-center"
              source={frame}
            />
          </View>
          <Image
            className="mt-1 h-[14px] w-[70px] self-center"
            resizeMode="contain"
            source={rarity(item.basicInfo.rarity)}
          />
          <View className="my-1 flex-row flex-wrap items-center justify-center">
            {[
              ...new Set([
                ...new Set(item.skill),
                ...new Set(item.activeSkill || []),
              ]),
            ].map(s => {
              return (
                <FasterImageView
                  key={`skill_icon_${s}`}
                  source={{url: iconSkill(s)}}
                  style={styles.icon}
                />
              );
            })}
            {item.activeSkill && (
              <Image className="ml-3 h-5 w-6" source={cutin} />
            )}
          </View>
          <Text className="text-center">
            {item.basicInfo.name.en || item.basicInfo.name.ja}
          </Text>
        </>
      </TouchableRipple>
    );
  };

  const toggleAllCharacters = () => {
    setFilter(draft => {
      draft.characters = draft.characters.map(() => !filterAll.characters);
    });
    setFilterAll({
      ...filterAll,
      characters: !filterAll.characters,
    });
  };

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

  const onPressCharacter = (i: number) => {
    setFilter(draft => {
      draft.characters[i] = !draft.characters[i];
    });
  };

  const onPressRarity = (i: number) => {
    setFilter(draft => {
      draft.rarity[i] = !draft.rarity[i];
    });
  };

  const onPressSkill = (i: number) => {
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
        data={rmList}
        estimatedItemSize={150}
        keyExtractor={mKeyExtractor}
        ListEmptyComponent={mList.length > 0 ? EmptyList : ErrorView}
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
      <CharactersBottomSheet
        ref={charactersRef}
        characters={filter.characters}
        filterAll={filterAll.characters}
        toggleAll={toggleAllCharacters}
        onPress={onPressCharacter}
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

export default MemoirsScreen;
