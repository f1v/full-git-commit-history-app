import moment from 'moment';

export const filterRepos = (repos, filterType) => {
  if (filterType === 'alphabetical') {
    return repos; // repos is alphabetical by default
  }
  if (filterType === 'lastUpdated') {
    return repos
      .slice() // repos is read-only so make a copy first
      .sort((a, b) => moment(b.pushedAt).diff(moment(a.pushedAt)));
  }
  if (filterType === 'numStars') {
    return repos.slice().sort((a, b) => b.numStars - a.numStars);
  }
};
