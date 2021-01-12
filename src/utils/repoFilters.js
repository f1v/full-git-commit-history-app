import moment from 'moment';

export const filterRepos = (type) => (repos) => {
  if (type === 'alphabetical') {
    return repos; // repos is alphabetical by default
  }
  if (type === 'lastUpdated') {
    return repos
      .slice() // repos is read-only so make a copy first
      .sort((a, b) => moment(b.pushedAt).diff(moment(a.pushedAt)));
  }
  if (type === 'numStars') {
    return repos.slice().sort((a, b) => b.numStars - a.numStars);
  }
};
