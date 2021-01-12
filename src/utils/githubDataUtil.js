import moment from 'moment';

/**
 * takes an array of github data objects and applies a sort
 * @param {Array} repos
 * @param {String} sortType
 */
export const sortReposList = (repos, sortType) => {
  switch (sortType) {
    case 'alphabetical':
      return repos; // repos are alphabetical by default
    case 'lastUpdated':
      return repos
        .slice() // repos is read-only so make a copy first
        .sort((a, b) => moment(b.pushedAt).diff(moment(a.pushedAt)));
    case 'numStars':
      return repos.slice().sort((a, b) => b.numStars - a.numStars);
    default:
      return repos;
  }
};

/**
 * takes an object from github data from
 * GET /users/{username}/repos
 * and rips out only relevant keys
 * @param {Array} userRepoData
 *
 */
export const parseUserData = (userData) => {
  return userData.map(
    ({
      id,
      name,
      description,
      language,
      pushed_at: pushedAt,
      stargazers_count: numStars,
    }) => ({ id, name, description, language, pushedAt, numStars }),
  );
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
