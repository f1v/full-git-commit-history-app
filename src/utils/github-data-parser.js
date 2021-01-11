/**
 * takes an object from github data from
 * GET /users/{username}/repos
 * and rips out only relevant keys
 * @param {Array} userRepoData
 *
 */
export const parseUserData = (userData) => {
  return userData.map(
    ({ id, name, description, language, pushed_at, stargazers_count }) => {
      return { id, name, description, language, pushed_at, stargazers_count };
    },
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
