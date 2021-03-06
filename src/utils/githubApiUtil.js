import { request } from '@octokit/request';

const TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

/* 
  github API endpoints:
  https://docs.github.com/en/free-pro-team@latest/rest/overview/endpoints-available-for-github-apps
*/

const octoRequest = request.defaults({
  headers: {
    authorization: 'token ' + TOKEN,
  },
});

/**
 * returns all repositories relating to that user
 * @param {Object} param
 * @param {String} param.username
 * @example endpoint: https://api.github.com/users/f1v/repos
 * @example description: https://docs.github.com/en/free-pro-team@latest/rest/reference/repos
 */
const getUserRepos = async ({ username }) => {
  return await octoRequest('GET /users/{username}/repos', {
    username,
  });
};

/**
 * @param {Object} param
 * @param {String} param.owner
 * @param {String} param.repo
 * @example endpoint: https://api.github.com/repos/f1v/full-git-commit-history-app
 * @example description: https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#get-a-repository
 */
const getRepo = async ({ owner, repo }) => {
  return await octoRequest('GET /repos/{owner}/{repo}', {
    owner,
    repo,
  });
};

/**
 * returns entire commit history from looking up SHAs
 * @param {Object} param
 * @param {String} param.owner github username; e.g. facebook
 * @param {String} param.repo github repo for that username; e.g react
 * @param {String} param.sha commit SHA
 * @param {Array} param.data list of github api Objects
 * @param {Number} param.escapeCount fallback counter to prevent gathering too many commits
 * @example endpoint: https://api.github.com/repos/f1v/full-git-commit-history-app/commits?sha=461682ac873cfe9cbdb6d42a078cd8080f4cf17b
 * @example description: https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#list-commits
 */
const getRepoCommitHistory = async ({
  owner,
  repo,
  sha = '',
  data = [],
  escapeCount = 0,
}) => {
  if (escapeCount > 5) return data;
  const { data: commitHistory } = await octoRequest(
    `GET /repos/{owner}/{repo}/commits?sha=${sha}`,
    {
      owner,
      repo,
    },
  );

  const { sha: earliestSHA } = commitHistory[commitHistory.length - 1];
  data.pop(); // fixes bug where last commit is duplicated
  data = [...data, ...commitHistory];

  if (commitHistory.length > 1) {
    return await getRepoCommitHistory({
      owner,
      repo,
      sha: earliestSHA,
      data,
      escapeCount: escapeCount++,
    });
  } else {
    return data;
  }
};

/**
 *
 * @param {Object} param
 * @param {String} param.owner
 * @param {String} param.repo
 * @example endpoint: https://api.github.com/repos/f1v/full-git-commit-history-app/branches
 * @example description: https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#list-branches
 */
const getRepoBranches = async ({ owner, repo }) => {
  const { data: repoBranches } = await octoRequest(
    `GET /repos/{owner}/{repo}/branches`,
    {
      owner,
      repo,
    },
  );

  return repoBranches;
};

/**
 * returns commitHistory for a specific branch
 * @param {Object} param
 * @param {String} owner
 * @param {String} repo
 * @param {String} branch
 * @example endpoint: https://api.github.com/repos/f1v/full-git-commit-history-app/branches
 * @example description: https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#get-a-branch
 */
const getBranchCommitHistory = async ({ owner, repo, branch = 'master' }) => {
  const {
    data: {
      commit: { sha },
    },
  } = await octoRequest(`GET /repos/{owner}/{repo}/branches/{branch}`, {
    owner,
    repo,
    branch,
  });

  return await getRepoCommitHistory({ owner, repo, sha });
};

export const API = {
  getBranchCommitHistory,
  getUserRepos,
  getRepoCommitHistory,
  getRepoBranches,
  getRepo,
};

window.api = API;
