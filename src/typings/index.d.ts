//#region Components

type LVObject<T> = {label: string; value: T};

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

//#region API: Karthuria

type TRole = 'front' | 'middle' | 'back' | 0 | 1 | 2;

type TSkillType = 'normal' | 'fieldEffect';

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
    remake: boolean;
  };
  other: {
    storyID: number[];
    dex: number;
    cri: number;
    eva: number;
  };
  stat: TDressStat;
  statRemake: TDressStat;
  act: Record<`act${1 | 2 | 3}`, {skillNormal: TSkillNormal}>;
  skills: Record<string, TSkillObject>;
  entrySkill: null;
  remake: boolean;
  groupSkills: {
    unitSkill: {
      id: number;
      icon: number;
      description: TLanguageObject;
    };
    climaxACT: {
      skillNormal: TSkillNormal;
      skillChange: null;
    };
    finishACT: {
      id: number;
      icon: number;
      name: TLanguageObject;
      description: TLanguageObject;
    };
  };
};

/** dressskills, equipskills */
type TSkillsOnFilter = Record<string, boolean>;

type TSkillNames = Record<string, {[L in TLanguage]: string[]}>;

type TAct = {
  skillNormal: TNormalSkill;
  skillChange: number | null;
};

type TNormalSkill = {
  attribute: number;
  cost: number;
  icon: number;
  id: number;
  multiple: boolean;
  name: TLanguageObject;
  params: TSkillParam[];
};

type TSkillObject = {
  id: number;
  icon: number;
  type: TLanguageObject;
  params: TSkillParam[];
};

type TEquipList = Record<string, TEquipBasicInfo>;

type TEquipBasicInfo = {
  activeSkill: number[] | null;
  basicInfo: {
    cardID: string;
    charas: number[];
    name: TLanguageObject;
    profile: TLanguageObject;
    rarity: number;
    released: TReleased;
  };
  skill: number[];
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
        icon: number;
        cost: number[];
        attribute: number;
        execution: {
          executeTiming: {
            description: TLanguageObject;
            id: number;
          };
          executeLimitCounts: number[];
          firstExecutableTurns: number[];
          recastTurns: number[];
        };
        params: TSkillParam[];
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
      skillNormal: TNormalSkill | null;
      skillChange: number;
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
    attribute: number;
    enemyID: string;
    icon: number;
    /** Enemy type:
     * - 1: stage girl
     * - 0: else */
    isDress: 0 | 1;
    name: TLanguageObject;
    rarity: number;
  };
};

type TEnemy = {
  basicInfo: TEnemyBasicInfo['basicInfo'] & {
    personality: TLanguageObject;
  };
  skills: TAct[];
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

type TSkillParam = {
  accuracy?: number | null;
  description: TLanguageObject | null;
  descriptionExtra: TLanguageObject | null;
  duration: TLanguageObject | null;
  hits: number | null;
  icon: number;
  target: TLanguageObject;
  type: TSkillType;
};

type TSkillNormal = {
  id: number;
  name: TLanguageObject;
  attribute: number;
  cost: number;
  multiple: boolean;
  icon: number;
  params: TSkillParam[];
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
