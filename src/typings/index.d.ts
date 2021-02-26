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
  loading: boolean;
  options: AppOptions;
};

//#endregion

//#region Reducer

type ActionType =
  | { type: 'LOADING'; loading: boolean }
  | { type: 'SAVE_CACHED_DATA'; data: CachedDataObject }
  | { type: 'SAVE_OPTIONS'; data: AppOptions };

//#endregion

//#region Navigation

type BottomTabList = {
  MainScreen: undefined;
  MoreScreen: undefined;
};

type MainScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabList, 'MainScreen'>,
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
  Main: undefined;
  Splash: undefined;
};

//#endregion

//#region API: Karhuria

type TLanguage = 'ja' | 'en' | 'ko' | 'zh_hant';

type TCharaList = Record<string, TCharaBasicInfo>;

type TCharaBasicInfo = {
  basicInfo: {
    charaID: number;
    birth_day: number;
    birth_month: number;
    school_id: number;
    name_ruby: {
      [L in TLanguage]: string;
    };
  };
};

type TDressList = Record<string, TDressBasicInfo>;

type TDressBasicInfo = {
  basicInfo: {
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
  base: {
    attribute: number;
    attackType: number;
    roleIndex: {
      role: string;
      index: number;
    };
    skills: number[];
  };
  stat: {
    total: number;
    agi: number;
    atk: number;
    hp: number;
    mdef: number;
    pdef: number;
  };
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
