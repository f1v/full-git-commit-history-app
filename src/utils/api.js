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
 *
 * @param {Object} param
 * @param {String} param.username
 * https://docs.github.com/en/free-pro-team@latest/rest/reference/repos
 */
const getReposData = async ({ username }) => {
  return await octoRequest('GET /users/{username}/repos', {
    username,
  });
};

/**
 *
 * @param {Object} param
 * @param {String} param.owner github username; e.g. facebook
 * @param {String} param.repo github repo for that username; e.g react
 * @param {String} param.sha commit SHA
 * @param {Array} param.data list of github api Objects
 * @param {Number} param.escapeCount fallback counter to prevent gathering too many commits
 * https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#list-commits
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

export const API = {
  getReposData,
  getRepoCommitHistory,
};
