import SkillParam from 'components/skillparam';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import AppStyles from 'theme/styles';

type Props = {
  skill: TSkillNormal;
};

const SkillDetail = ({skill}: Props) => {
  const {t} = useTranslation();

  return (
    <Surface style={[AppStyles.shadow, AppStyles.contentBlock]}>
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
        {skill.params.map((sk, idx) => {
          return <SkillParam key={`skill_param_${idx}`} skillParam={sk} />;
        })}
      </View>
    </Surface>
  );
};

SkillDetail.whyDidYouRender = true;

export default SkillDetail;
