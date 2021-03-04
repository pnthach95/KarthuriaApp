import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';

//#region Components

type LVObject<T> = { label: string; value: T };

type Combined = RarityType | AttributeType | MainUnitNames;
type CombinedWithBOE = BooleanOrEmpty | YearType;

type FCSelectionProps<T = Combined> = {
  title: string;
  data: ReadonlyArray<T>;
  value: T;
  setValue: (value: T) => void;
};

type FCItemProps<T> = {
  item: T;
  onPress: () => void;
};

//#endregion

//#region Context

type AppOptions = {
  isDark: boolean;
};

type AppState = {
  mainRoute: 'SPLASH' | 'MAIN';
  options: AppOptions;
};

type ActionType =
  | { type: 'SWITCH_MAIN_ROUTE'; route: AppState['mainRoute'] }
  | { type: 'SAVE_CACHED_DATA'; data: CachedDataObject }
  | { type: 'SAVE_OPTIONS'; data: AppOptions };

//#endregion

//#region Navigation

type BottomTabList = {
  MainScreen: undefined;
  CharactersScreen: undefined;
  StageGirlsScreen: undefined;
  MoreScreen: undefined;
};

type MainScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, 'MainScreen'>,
    StackNavigationProp<RootStackParamList>
  >;
};
type CharactersScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, 'CharactersScreen'>,
    StackNavigationProp<RootStackParamList>
  >;
};
type StageGirlsScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, 'StageGirlsScreen'>,
    StackNavigationProp<RootStackParamList>
  >;
};
type MoreScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, 'MoreScreen'>,
    StackNavigationProp<RootStackParamList>
  >;
};

type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  CharacterDetail: { id: number };
  StageGirlDetail: { id: string };
};

type CharacterDetailProps = StackScreenProps<
  RootStackParamList,
  'CharacterDetail'
>;

type StageGirlDetailProps = StackScreenProps<
  RootStackParamList,
  'StageGirlDetail'
>;

//#endregion

//#region API: Karhuria

type TRole = 'front' | 'middle' | 'back';

type TLanguage = 'ja' | 'en' | 'ko' | 'zh_hant';

type TCharaList = Record<string, TCharaBasicInfo>;

type TCharaBasicInfoCommon = {
  charaID: number;
  birth_day: number;
  birth_month: number;
  school_id: number;
};

type TCharaBasicInfo = {
  basicInfo: TCharaBasicInfoCommon & {
    name_ruby: {
      [L in TLanguage]: string;
    };
  };
};

type TChara = {
  basicInfo: TCharaBasicInfoCommon;
  info: {
    cv: {
      [L in TLanguage]: string;
    };
    cv_first: {
      [L in TLanguage]: string;
    };
    cv_last: {
      [L in TLanguage]: string;
    };
    department_1: {
      [L in TLanguage]: string;
    };
    department_2: {
      [L in TLanguage]: string;
    };
    dislike_foods: {
      [L in TLanguage]: string;
    };
    dislikes: {
      [L in TLanguage]: string;
    };
    first_name: {
      [L in TLanguage]: string;
    };
    introduction: {
      [L in TLanguage]: string;
    };
    last_name: {
      [L in TLanguage]: string;
    };
    like_foods: {
      [L in TLanguage]: string;
    };
    likes: {
      [L in TLanguage]: string;
    };
    name: {
      [L in TLanguage]: string;
    };
    name_ruby: {
      [L in TLanguage]: string;
    };
  };
};

type TDressList = Record<string, TDressBasicInfo>;

type TDressBasicInfoCommon = {
  cardID: string;
  rarity: number;
  character: number;
  name: {
    [L in TLanguage]: string;
  };
  released: {
    ww: number;
    ja: number;
  };
};

type TDressBasicInfo = {
  basicInfo: TDressBasicInfoCommon;
  base: TDressBaseCommon & {
    skills: number[];
  };
  stat: TDressStat;
};

type TDressBaseCommon = {
  attribute: number;
  attackType: number;
  roleIndex: {
    role: TRole;
    index: number;
  };
};

type TDressStat = {
  total: number;
  agi: number;
  atk: number;
  hp: number;
  mdef: number;
  pdef: number;
};

type TDress = {
  basicInfo: TDressBasicInfoCommon & {
    profile: {
      [L in TLanguage]: string;
    };
    message: {
      [L in TLanguage]: string;
    };
    description: {
      [L in TLanguage]: string;
    };
  };
  base: TDressBaseCommon & {
    cost: number;
    accessories?: string[];
  };
  other: {
    storyID: number[];
    dex: number;
    cri: number;
    eva: number;
  };
  stat: TDressStat;
  act: {
    act1: TAct;
    act2: TAct;
    act3: TAct;
  };
  skills: {
    autoSkill1: TAutoSkill;
    autoSkill2: TAutoSkill;
    autoSkill3: TAutoSkill;
  };
  groupSkills: {
    unitSkill: {
      iconID: number;
      info: {
        [L in TLanguage]: string;
      };
    };
    climaxACT: {
      iconID: number;
      cost: number;
      name: {
        [L in TLanguage]: string;
      };
      description: {
        [L in TLanguage]: string;
      };
      attribute: number;
      skillInfo: string;
      skillCycle: string;
    };
    finishACT: {
      iconID: number;
      name: {
        [L in TLanguage]: string;
      };
      info: {
        [L in TLanguage]: string;
      };
    };
  };
};

type TAct = {
  normalSkill: {
    iconID: number;
    cost: number;
    name: {
      [L in TLanguage]: string;
    };
    description: {
      [L in TLanguage]: string;
    };
    attribute: number;
    skillInfo: string;
    skillCycle: string;
  };
  changeSkill: number;
};

type TAutoSkill = {
  iconID: number;
  info: {
    [L in TLanguage]: string;
  };
  type: 'passive' | 'start';
};

type TEquipList = Record<string, TEquipBasicInfo>;

type TEquipBasicInfo = {
  basicInfo: {
    cardID: string;
    rarity: number;
    charas: string;
    name: {
      [L in TLanguage]: string;
    };
    profile: {
      [L in TLanguage]: string;
    };
    published: {
      ww: number;
      ja: number;
    };
  };
  skill: {
    iconID: number;
    info: {
      [L in TLanguage]: string;
    };
    type: string;
  };
};

type TAccessoryList = Record<string, TAccessoryBasicInfo>;

type TAccessoryBasicInfo = {
  basicInfo: {
    accID: number;
    iconID: number;
    cardID: number;
    name: string;
  };
  skillSlot: number;
};

type TEnemyList = Record<string, TEnemyBasicInfo>;

type TEnemyBasicInfo = {
  basicInfo: {
    enemyID: string;
    icon: number;
    rarity: number;
    name: {
      [L in TLanguage]: string;
    };
    attribute: number;
    isDress: number;
  };
};

type TCurrentEvent = {
  titan: {
    id: number;
    endAt: number;
    enemy: Record<string, TTitanEnemy>;
    reward: number[];
  };
  event: Record<string, TExtendedEvent>;
  rogue: Record<string, TEvent>;
};

type TEvent = {
  id: number;
  beginAt: number;
  endAt: number;
};

type TExtendedEvent = TEvent & { referenceIndex: 'Beat' | 'Shop' };

type TTitanEnemy = {
  id: number;
  hpLeft: number;
  hpLeftPercent: string;
};

//#endregion

//#region API: Github

type GithubRepoType = {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: {
    url: string;
    id: number;
    node_id: string;
    name: string;
    label: string | null;
    uploader: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    };
    content_type: string;
    state: string;
    size: number;
    download_count: number;
    created_at: string;
    updated_at: string;
    browser_download_url: string;
  }[];
  tarball_url: string;
  zipball_url: string;
  body: string;
};

//#endregion
