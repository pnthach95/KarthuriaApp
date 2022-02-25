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

type AppOptions = {
  isDark: boolean;
};

//#region Navigation

type BottomTabList = {
  MainScreen: undefined;
  StageGirlsScreen: undefined;
  MemoirsScreen: undefined;
  MoreScreen: undefined;
};

type MainScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, 'MainScreen'>,
    StackNavigationProp<RootStackParamList>
  >;
};
type StageGirlsScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, 'StageGirlsScreen'>,
    StackNavigationProp<RootStackParamList>
  >;
};
type MemoirsScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, 'MemoirsScreen'>,
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
  Characters: undefined;
  CharacterDetail: { id: number };
  StageGirlDetail: { id: string | number };
  MemoirDetail: { id: string };
  Accessories: undefined;
  AccessoryDetail: { id: number };
  Enemies: undefined;
  EnemyDetail: { id: string };
};
type CharactersScreenProps = StackScreenProps<RootStackParamList, 'Characters'>;
type CharacterDetailProps = StackScreenProps<
  RootStackParamList,
  'CharacterDetail'
>;
type StageGirlDetailProps = StackScreenProps<
  RootStackParamList,
  'StageGirlDetail'
>;
type MemoirDetailProps = StackScreenProps<RootStackParamList, 'MemoirDetail'>;
type AccessoriesProps = StackScreenProps<RootStackParamList, 'Accessories'>;
type AccessoryDetailProps = StackScreenProps<
  RootStackParamList,
  'AccessoryDetail'
>;
type EnemiesProps = StackScreenProps<RootStackParamList, 'Enemies'>;
type EnemyDetailProps = StackScreenProps<RootStackParamList, 'EnemyDetail'>;

//#endregion

//#region API: Karthuria

type TRole = 'front' | 'middle' | 'back' | 0 | 1 | 2;

type TSkillType = 'passive' | 'start';

type TLanguage = 'ja' | 'en' | 'ko' | 'zh_hant';

type TLanguageObject = {
  [L in TLanguage]: string;
};

type TReleased = {
  ww: number | null;
  ja: number;
};

type TCharaList = Record<string, TCharaBasicInfo>;

type TCharaBasicInfoCommon = Record<
  'charaID' | 'birth_day' | 'birth_month' | 'school_id',
  number
>;

type TCharaBasicInfo = {
  basicInfo: TCharaBasicInfoCommon & {
    name_ruby: TLanguageObject;
  };
};

type TChara = {
  basicInfo: TCharaBasicInfoCommon;
  info: Record<
    | 'cv'
    | 'cv_first'
    | 'cv_last'
    | 'department_1'
    | 'department_2'
    | 'dislike_foods'
    | 'dislikes'
    | 'first_name'
    | 'introduction'
    | 'last_name'
    | 'like_foods'
    | 'likes'
    | 'name'
    | 'name_ruby',
    TLanguageObject
  >;
};

type TDressList = Record<string, TDressBasicInfo>;

type TDressBasicInfoCommon = {
  cardID: string;
  rarity: number;
  character: number;
  name: TLanguageObject;
  released: TReleased;
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

type TDressStat = TBasicStat & {
  /** Power Score (Total) */
  total: number;
  /** Agility */
  agi: number;
};

type TDress = {
  basicInfo: TDressBasicInfoCommon &
    Record<'profile' | 'message' | 'description', TLanguageObject>;
  base: TDressBaseCommon & {
    cost: number;
    accessories: string[] | null;
  };
  other: {
    storyID: number[];
    dex: number;
    cri: number;
    eva: number;
  };
  stat: TDressStat;
  act: Record<string, TAct>;
  skills: Record<string, TSkillObject>;
  groupSkills: {
    unitSkill: {
      iconID: number;
      info: TLanguageObject;
    };
    climaxACT: TNormalSkill;
    finishACT: {
      iconID: number;
      name: TLanguageObject;
      info: TLanguageObject;
    };
  };
};

/** dressskills, equipskills */
type TSkillsOnFilter = Record<string, boolean>;

type TSkillNames = Record<string, { [L in TLanguage]: string[] }>;

type TAct = {
  normalSkill: TNormalSkill;
  changeSkill: number;
};

type TSkillObject = {
  iconID: number;
  info: TLanguageObject;
  type: TSkillType;
};

type TEquipList = Record<string, TEquipBasicInfo>;

type TEquipBasicInfo = {
  basicInfo: {
    cardID: string;
    rarity: number;
    charas: string | number[];
    name: TLanguageObject;
    profile: TLanguageObject;
    released: TReleased;
  };
  skill: TSkillObject;
  activeSkill: 0 | 1;
};

type TEquip = {
  basicInfo: {
    cardID: string;
    rarity: number;
    charas: number[] | string;
    name: TLanguageObject;
    profile: TLanguageObject;
    released: TReleased;
  };
  stat: TBasicStat & {
    /** Power Score (Total) */
    total: number;
  };
  skill: TSkillObject;
  activeSkill:
    | {
        iconID: number;
        cost: number[];
        attribute: number;
        info: TLanguageObject;
        execution: {
          executeLimitCounts: number[];
          firstExecutableTurns: number[];
          recastTurns: number[];
        };
      }
    | 0;
};

type TAccessoryList = Record<string, TAccessoryBasicInfo>;

type TAccessoryBasicInfo = {
  basicInfo: {
    accID: number;
    iconID: number;
    cards: number[];
    name: string;
  };
  skillSlot: number;
};

type TAccessory = {
  basicInfo: {
    accID: number;
    iconID: number;
    cards: number[];
    name: TLanguageObject;
    sellPrice: number;
  };
  skillInfo: {
    skill: {
      normalSkill: TNormalSkill | null;
      changeSkill: number;
    };
    skillSlot: number;
  };
  stat: TBasicStat & {
    /** Agility */
    agi: number;
    /** Critical */
    cri: number;
    /** Dexterity */
    dex: number;
  };
};

type TEnemyList = Record<string, TEnemyBasicInfo>;

type TEnemyBasicInfo = {
  basicInfo: {
    enemyID: string;
    icon: number;
    rarity: number;
    name: TLanguageObject;
    attribute: number;
    /** Enemy type:
     * - 1: stage girl
     * - 0: else */
    isDress: 0 | 1;
  };
};

type TEnemy = {
  basicInfo: TEnemyBasicInfo['basicInfo'] & {
    personality: TLanguageObject;
  };
  skills: Record<string, TAct>;
};

type TCurrentEvent = {
  titan: {
    id: number;
    endAt: number;
    enemy: Record<string, TTitanEnemy>;
    reward: number[];
  };
  event: Record<string, TEvent>;
  rogue?: Record<string, TRogueEvent>;
};

type TRogueEvent = {
  id: number;
  beginAt: number;
  endAt: number;
};

type TEvent = {
  id: number;
  info: number;
  beginAt: number[];
  endAt: number[];
};

type TTitanEnemy = {
  id: number;
  hpLeft: number;
  hpLeftPercent: string;
};

type TBasicStat = {
  /** Act Power */
  atk: number;
  /** Special Defense */
  mdef: number;
  /** Normal Defense */
  pdef: number;
  /** HP */
  hp: number;
};

type TNormalSkill = {
  iconID: number;
  cost: number;
  name: TLanguageObject;
  description: TLanguageObject;
  attribute: number;
  skillInfo: string;
  skillCycle: string;
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
