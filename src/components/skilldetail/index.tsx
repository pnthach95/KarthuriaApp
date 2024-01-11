import SkillParam from 'components/skillparam';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Chip, Surface, Text} from 'react-native-paper';

type Props = {
  skill: TSkillNormal;
};

const SkillDetail = ({skill}: Props) => {
  const {t} = useTranslation();

  return (
    <Surface className="my-2 space-y-3 rounded-md p-3" elevation={3}>
      <View className="flex-1">
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text variant="titleMedium">{skill.name.en || skill.name.ja}</Text>
          </View>
          <Chip compact>
            {t('ap')}
            {skill.cost}
          </Chip>
        </View>
        {skill.params.map((sk, idx) => {
          return <SkillParam key={`skill_param_${idx}`} skillParam={sk} />;
        })}
      </View>
    </Surface>
  );
};

export default SkillDetail;
