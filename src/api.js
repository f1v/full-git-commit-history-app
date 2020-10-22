import { request } from '@octokit/request';
const TOKEN = process.env.GITHUB_TOKEN;

// endpoints
// https://docs.github.com/en/free-pro-team@latest/rest/overview/endpoints-available-for-github-apps

const octoRequest = request.defaults({
  headers: {
    authorization: 'token ' + TOKEN,
  },
});

const getReposData = async ({ username }) => {
  return await octoRequest('GET /users/{username}/repos', {
    username,
  });
};

const getRepoCommitHistory = async ({ owner, repo, sha = 'master' }) => {
  return await octoRequest(`GET /repos/{owner}/{repo}/commits?sha=${sha}`, {
    owner,
    repo,
  });
};

export const api = {
  getReposData,
  getRepoCommitHistory,
};

export default api;
