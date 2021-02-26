import { create } from 'apisauce';

import type { GithubRepoType } from '~/typings';

const Config = {
  GITHUB_API: 'https://api.github.com/repos/',
  REPO: 'pnthach95/LLSIFTomodachiApp/releases',
  GITHUB_PROJECT: 'https://github.com/pnthach95/LLSIFTomodachiApp',
};

const GithubApiClient = create({ baseURL: Config.GITHUB_API, timeout: 10000 });

/** Fetch latest version */
const fetchLatestVersion = async (): Promise<GithubRepoType> => {
  const response = await GithubApiClient.get<GithubRepoType[]>(Config.REPO);
  if (response.ok && response.data) {
    return response.data[0];
  }
  throw Error('error while fetchLatestVersion (GithubService)');
};

export default { fetchLatestVersion };
