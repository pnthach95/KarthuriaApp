import API, {links} from 'api';
import {iconAttribute, imgEnemy} from 'api/images';
import BaseScreen from 'components/basescreen';
import SkillDetail from 'components/skilldetail';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Surface,
} from 'react-native-paper';
import AppStyles from 'theme/styles';
import type {RootStackScreenProps} from 'typings/navigation';

const EnemyDetailScreen = ({route}: RootStackScreenProps<'EnemyDetail'>) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [enemy, setEnemy] = useState<TEnemy | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {id} = route.params;
        const gotData = await API.get<TEnemy>(links.ENEMY + `${id}.json`);
        if (gotData.ok && gotData.data) {
          setEnemy(gotData.data);
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <BaseScreen hasData={!!enemy} loading={loading}>
      {enemy && (
        <>
          <Headline style={AppStyles.centerText}>
            {enemy.basicInfo.name.en || enemy.basicInfo.name.ja}
          </Headline>
          <View style={AppStyles.paddingVertical}>
            <View style={[AppStyles.square112, AppStyles.selfCenter]}>
              <FastImage
                source={{uri: imgEnemy(enemy.basicInfo.icon)}}
                style={[AppStyles.square112, AppStyles.selfCenter]}
              />
              <Image
                source={{uri: iconAttribute(enemy.basicInfo.attribute)}}
                style={[AppStyles.square28, AppStyles.absolute]}
              />
            </View>
          </View>

          <View style={AppStyles.paddingHorizontal}>
            <View style={AppStyles.paddingVertical}>
              <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
                <Caption>{t('profile')}</Caption>
                <Paragraph>
                  {enemy.basicInfo.personality.en ||
                    enemy.basicInfo.personality.ja}
                </Paragraph>
              </Surface>
            </View>
            <View style={AppStyles.paddingVertical}>
              <Subheading style={AppStyles.centerText}>{t('skill')}</Subheading>
              {Object.keys(enemy.skills).map(k => {
                const skill = enemy.skills[k];
                return <SkillDetail key={k} skill={skill.skillNormal} />;
              })}
            </View>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

EnemyDetailScreen.whyDidYouRender = true;

export default EnemyDetailScreen;
