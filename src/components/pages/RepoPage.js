import { Heading, Link, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { AppContext } from '../../contexts/AppContext';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';
import { API, parseRepoData } from '../../utils';
import { CommitList } from '../commit-list/CommitList';
import { SwitchUserButton } from '../main/SwitchUserButton';

export const RepoPage = ({ match }) => {
  const { user, repo, branch: branchName } = match.params;
  const branch = branchName && window.atob(branchName);
  const baseURL = 'https://github.com';
  const userURL = `${baseURL}/${user}`;
  const repoURL = `${userURL}/${repo}`;

  const [branchCommitHistory, setBranchCommitHistory] = useState([]);
  const [branches, setBranches] = useState([]);
  const { setIsLoading } = useContext(AppContext);
  const [commitHistory, setUserCommitHistory] = useRecoilState(
    userCommitHistoryState,
  );

  let commits = [];

  if (branch) {
    commits = branchCommitHistory;
  } else {
    commits = (commitHistory[user] && commitHistory[user][repo]) || [];
  }

  /**
   * picks up the full commit history for a repo's main branch
   * saves main branch commits to local storage
   */
  const getCommitHistory = async () => {
    setIsLoading(true);
    const rawRepoData = await API.getRepoCommitHistory({
      owner: user,
      repo,
    });
    const repoCommits = parseRepoData(rawRepoData);
    setUserCommitHistory({ ...commitHistory, [user]: { [repo]: repoCommits } });
    setIsLoading(false);
  };

  /**
   * picks up all branches in a repo, saves in component state
   */
  const getBranchesData = async () => {
    const rawData = await API.getRepoBranches({ owner: user, repo });
    const newBranches = rawData.map(({ name }) => name);
    setBranches(newBranches);
  };

  /**
   * returns the full commit history for selected repo branch
   * and saves in component state
   * does not save branch commit history to local storage
   */
  const getBranchCommitHistory = async () => {
    // TODO: there is a memory leak bug when adding setIsLoading to this function
    const rawRepoData = await API.getBranchCommitHistory({
      owner: user,
      repo,
      branch,
    });
    const repoCommits = parseRepoData(rawRepoData);
    setBranchCommitHistory(repoCommits);
  };

  useEffect(() => {
    if (branch) {
      getBranchCommitHistory();
    }

    if (!commitHistory[user] || !commitHistory[user][repo]) {
      getCommitHistory();
    }

    if (!branches.length) {
      getBranchesData();
    }
  }, []);

  return (
    <div>
      <SwitchUserButton />
      <Heading fontSize="28px" mt="25px" textAlign="left">
        <Link href={repoURL} isExternal>
          {repo}
        </Link>
        <Text style={{ display: 'inline' }}> by </Text>
        <Link href={userURL} isExternal>
          {user}
        </Link>
      </Heading>
      <CommitList
        commits={commits}
        branches={branches}
        user={user}
        repo={repo}
        branch={branch}
      />
    </div>
  );
};

RepoPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repo: PropTypes.string,
      user: PropTypes.string,
      branch: PropTypes.string,
    }),
  }),
};
