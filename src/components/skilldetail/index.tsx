import {skillIcon} from '~/api/images';
import AppStyles from '~/theme/styles';
import {CachedImage} from '@georstat/react-native-image-cache';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Caption, Colors, Paragraph, Surface, Text} from 'react-native-paper';

type Props = {
  skill: TNormalSkill;
};

const styles = StyleSheet.create({
  animation: {
    color: Colors.red300,
  },
  tiva: {
    color: Colors.blue300,
  },
});

const SkillDetail = ({skill}: Props) => {
  const {t} = useTranslation();

  return (
    <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
      <View style={AppStyles.row}>
        <CachedImage
          source={skillIcon(skill.iconID)}
          style={[AppStyles.square40, AppStyles.marginRight]}
        />
        <View style={AppStyles.flex1}>
          <View style={AppStyles.row}>
            <View style={AppStyles.flex1}>
              <Text>{skill.name.en || skill.name.ja}</Text>
            </View>
            <Text>
              {t('ap')}
              {skill.cost}
            </Text>
          </View>
          <Caption>{skill.description.en || skill.description.ja}</Caption>
          <Paragraph>
            {t('ti-va')}
            <Paragraph style={styles.tiva}>{skill.skillInfo}</Paragraph>
          </Paragraph>
          <Paragraph>
            {t('animation')}
            <Paragraph style={styles.animation}>{skill.skillCycle}</Paragraph>
          </Paragraph>
        </View>
      </View>
    </Surface>
  );
};

SkillDetail.whyDidYouRender = true;

export default SkillDetail;
