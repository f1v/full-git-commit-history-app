import moment from 'moment';

/**
 * takes an object from github data from
 * GET /users/{username}/repos
 * and rips out only relevant keys
 * @param {Array} userRepoData
 *
 */
export const parseUserData = (userData) => {
  return userData
    .map(
      ({
        id,
        name,
        description,
        language,
        pushed_at: pushedAt,
        stargazers_count: stargazersCount,
      }) => ({ id, name, description, language, pushedAt, stargazersCount }),
    )
    .sort((a, b) => moment(b.pushedAt).diff(moment(a.pushedAt)));
};

/**
 * takes an object from github data from
 * GET /repos/{owner}/{repo}/commits?sha=${sha}
 * and rips out only relevant keys
 * @param {Array} repoData
 *
 */
export const parseRepoData = (repoData) => {
  return repoData.map(
    ({ commit: { author, commiter, message, url }, html_url, sha }) => {
      return { commit: { author, commiter, message, url }, html_url, sha };
    },
  );
};
