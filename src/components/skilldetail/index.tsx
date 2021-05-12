import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption, Text, Surface, Paragraph, Colors } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { skillIcon } from '~/api/images';
import AppStyles from '~/theme/styles';

import type { TNormalSkill } from '~/typings';

type Props = {
  skill: TNormalSkill;
};

type InfoProps = { info: string };

const styles = StyleSheet.create({
  animation: {
    color: Colors.red300,
  },
  tiva: {
    color: Colors.blue300,
  },
});

const TiVa = ({ info }: InfoProps): JSX.Element => (
  <Paragraph>
    Ti/Va: <Paragraph style={styles.tiva}>{info}</Paragraph>
  </Paragraph>
);

const Animation = ({ info }: InfoProps): JSX.Element => (
  <Paragraph>
    Animation: <Paragraph style={styles.animation}>{info}</Paragraph>
  </Paragraph>
);

const SkillDetail = ({ skill }: Props): JSX.Element => {
  const icon = { uri: skillIcon(skill.iconID) };

  return (
    <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
      <View style={AppStyles.row}>
        <FastImage
          source={icon}
          style={[AppStyles.square40, AppStyles.marginRight]}
        />
        <View style={AppStyles.flex1}>
          <View style={AppStyles.row}>
            <View style={AppStyles.flex1}>
              <Text>{skill.name.en || skill.name.ja}</Text>
            </View>
            <Text>AP: {skill.cost}</Text>
          </View>
          <Caption>{skill.description.en || skill.description.ja}</Caption>
          <TiVa info={skill.skillInfo} />
          <Animation info={skill.skillCycle} />
        </View>
      </View>
    </Surface>
  );
};

SkillDetail.whyDidYouRender = true;

export default SkillDetail;
