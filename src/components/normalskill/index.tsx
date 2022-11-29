import {iconSkill} from 'api/images';
import Separator from 'components/separator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Paragraph, Surface, Text} from 'react-native-paper';
import AppStyles from 'theme/styles';

type Props = {
  skill: TNormalSkill;
};

const NormalSkill = ({skill}: Props) => {
  const {t} = useTranslation();

  return (
    <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
      <View style={AppStyles.row}>
        <View style={AppStyles.flex1}>
          <Text>{skill.name.en || skill.name.ja}</Text>
        </View>
        <Text>
          {t('ap')}
          {skill.cost}
        </Text>
      </View>
      <Separator />
      <View style={AppStyles.row}>
        <FastImage
          source={{
            uri: iconSkill(skill.iconID),
          }}
          style={[AppStyles.square40, AppStyles.marginRight]}
        />
        <View style={AppStyles.flex1}>
          <Paragraph>
            {skill.description?.en || skill.description?.ja}
          </Paragraph>
          <Paragraph>
            {t('ti-va')}
            {skill.skillInfo}
          </Paragraph>
          <Paragraph>
            {t('animation')}
            {skill.skillCycle}
          </Paragraph>
        </View>
      </View>
    </Surface>
  );
};

export default NormalSkill;
