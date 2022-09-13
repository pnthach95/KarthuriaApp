import {create} from 'apisauce';

export const links = {
  GITHUB_API: 'https://api.github.com/repos/',
  REPO: 'pnthach95/KarthuriaApp/releases',
  GITHUB_PROJECT: 'https://github.com/pnthach95/KarthuriaApp',
};

const GithubApiClient = create({
  baseURL: links.GITHUB_API,
  timeout: 10000,
});

/** Fetch latest version */
const fetchLatestVersion = async (): Promise<GithubRepoType> => {
  const response = await GithubApiClient.get<GithubRepoType[]>(links.REPO);
  if (response.ok && response.data) {
    return response.data[0];
  }
  throw Error('error while fetchLatestVersion (GithubService)');
};

export default {fetchLatestVersion};
