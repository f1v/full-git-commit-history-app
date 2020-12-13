import { request } from '@octokit/request';
const TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

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

export default {
  getReposData,
  getRepoCommitHistory,
};
