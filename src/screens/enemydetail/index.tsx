import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import {
  Headline,
  Subheading,
  Surface,
  Caption,
  Paragraph,
} from 'react-native-paper';
import { CachedImage } from '@georstat/react-native-image-cache';
import API, { links } from '~/api';
import { enemyImg } from '~/api/images';
import BaseScreen from '~/components/basescreen';
import SkillDetail from '~/components/skilldetail';
import { attribute } from '~/assets';
import AppStyles from '~/theme/styles';

import type { RootStackScreenProps, TEnemy } from '~/typings';

const EnemyDetail = ({ route }: RootStackScreenProps<'EnemyDetail'>) => {
  const [loading, setLoading] = useState(true);
  const [enemy, setEnemy] = useState<TEnemy | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = route.params;
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
    void loadData();
  }, []);

  return (
    <BaseScreen loading={loading} hasData={!!enemy}>
      {enemy && (
        <>
          <Headline style={AppStyles.centerText}>
            {enemy.basicInfo.name.en || enemy.basicInfo.name.ja}
          </Headline>
          <View style={AppStyles.paddingVertical}>
            <View style={[AppStyles.square112, AppStyles.selfCenter]}>
              <CachedImage
                source={enemyImg(enemy.basicInfo.icon)}
                style={[AppStyles.square112, AppStyles.selfCenter]}
              />
              <Image
                source={attribute(enemy.basicInfo.attribute)}
                style={[AppStyles.square28, AppStyles.absolute]}
              />
            </View>
          </View>

          <View style={AppStyles.paddingHorizontal}>
            <View style={AppStyles.paddingVertical}>
              <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
                <Caption>Profile</Caption>
                <Paragraph>
                  {enemy.basicInfo.personality.en ||
                    enemy.basicInfo.personality.ja}
                </Paragraph>
              </Surface>
            </View>
            <View style={AppStyles.paddingVertical}>
              <Subheading style={AppStyles.centerText}>Skill</Subheading>
              {Object.keys(enemy.skills).map(k => {
                const skill = enemy.skills[k];
                return <SkillDetail key={k} skill={skill.normalSkill} />;
              })}
            </View>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

EnemyDetail.whyDidYouRender = true;

export default EnemyDetail;
