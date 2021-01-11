import { atom } from 'recoil';

/**
 * userRepoState is an object with keys being github user and values
 * being an array of objects for repoData
 */
export const userRepoState = atom({
  key: 'userRepoState',
  default: {},
  persistence_UNSTABLE: {
    type: 'userRepoState',
  },
});
