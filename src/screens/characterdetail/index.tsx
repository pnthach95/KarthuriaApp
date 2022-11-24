import API, {links} from 'api';
import {iconSchool} from 'api/images';
import {charaBase, charaPortrait} from 'api/images';
import BaseScreen from 'components/basescreen';
import Separator from 'components/separator';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Caption, Headline, Paragraph} from 'react-native-paper';
import AppStyles from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const styles = StyleSheet.create({
  portrait: {
    height: 336,
    width: 212.8,
  },
});

const CharacterDetailScreen = ({
  route,
}: RootStackScreenProps<'CharacterDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [character, setCharater] = useState<TChara | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await API.get<TChara>(
          links.CHARA + `${route.params.id}.json`,
        );
        if (data.ok && data.data) {
          setCharater(data.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const birthday = character
    ? dayjs()
        .date(character.basicInfo.birth_day)
        .month(character.basicInfo.birth_month)
        .format('M/D')
    : '';

  return (
    <BaseScreen hasData={!!character} loading={loading}>
      {character && (
        <>
          <Headline style={AppStyles.centerText}>
            {character.info.name.en || character.info.name.ja}
          </Headline>
          <View style={AppStyles.center}>
            <FastImage
              source={{uri: charaBase(character.basicInfo.charaID)}}
              style={styles.portrait}
            />
            <FastImage
              source={{uri: charaPortrait(character.basicInfo.charaID)}}
              style={[styles.portrait, AppStyles.absolute]}
            />
          </View>
          <View style={AppStyles.padding}>
            <Caption>{t('birthday')}</Caption>
            <Paragraph>{birthday}</Paragraph>
            <Separator height={10} />
            <Caption>{t('voice-actor')}</Caption>
            <Paragraph>
              {character.info.cv.en || character.info.cv.ja}
            </Paragraph>
            <Separator height={10} />
            <View style={AppStyles.rowSpaceBetween}>
              <View>
                <Caption>{t('school')}</Caption>
                <Paragraph>
                  {character.info.department_1.en ||
                    character.info.department_1.ja}
                </Paragraph>
              </View>
              <FastImage
                source={{uri: iconSchool(character.basicInfo.school_id)}}
                style={AppStyles.square40}
              />
            </View>
            <Separator height={10} />
            <Caption>{t('department')}</Caption>
            <Paragraph>
              {character.info.department_2.en || character.info.department_2.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>{t('liked-food')}</Caption>
            <Paragraph>
              {character.info.like_foods.en || character.info.like_foods.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>{t('disliked-food')}</Caption>
            <Paragraph>
              {character.info.dislike_foods.en ||
                character.info.dislike_foods.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>{t('likes')}</Caption>
            <Paragraph>
              {character.info.likes.en || character.info.likes.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>{t('dislikes')}</Caption>
            <Paragraph>
              {character.info.dislikes.en || character.info.dislikes.ja}
            </Paragraph>
            <Separator height={10} />
            <Caption>{t('introduction')}</Caption>
            <Paragraph>
              {character.info.introduction.en || character.info.introduction.ja}
            </Paragraph>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

CharacterDetailScreen.whyDidYouRender = true;

export default CharacterDetailScreen;
