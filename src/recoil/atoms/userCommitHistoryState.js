import { atom } from 'recoil';

/**
 * userCommitHistoryState is an object with keys being github user and values
 * being an object with the keys of a user's github repo name and the value
 * of that repo's commit history
 */
export const userCommitHistoryState = atom({
  key: 'userCommitHistoryState',
  default: {},
});
