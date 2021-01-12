import moment from 'moment';

export const filterRepos = (repos, filterType) => {
  switch (filterType) {
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
