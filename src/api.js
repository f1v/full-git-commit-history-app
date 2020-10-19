import { request } from '@octokit/request';
const TOKEN = process.env.GITHUB_TOKEN;

console.log('!!! token', TOKEN);

// endpoints
// https://docs.github.com/en/free-pro-team@latest/rest/overview/endpoints-available-for-github-apps

const octoRequest = request.defaults({
  headers: {
    authorization: 'token ' + TOKEN,
  },
});

const getRepos = async ({ username }) => {
  return await octoRequest('GET /users/{username}/repos', {
    username,
  });
};

const getRepoCommitHistory = async ({ owner, repo }) => {
  return await octoRequest('GET /repos/{owner}/{repo}/commits', {
    owner,
    repo,
  });
};

export const api = {
  getRepos,
  getRepoCommitHistory,
};

export default api;
