/**
 * takes an object from github data from
 * GET /users/{username}/repos
 * and rips out only relevant keys
 * @param {Array} userRepoData
 *
 */
export const parseUserData = (userData) => {
  return userData.map(
    ({ name, description, language, pushed_at, stargazers_count }) => {
      return { name, description, language, pushed_at, stargazers_count };
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
  return repoData.map(({ sha, commit: { author, message, avatar_url } }) => {
    return { sha, commit: { author, message, avatar_url } };
  });
};
