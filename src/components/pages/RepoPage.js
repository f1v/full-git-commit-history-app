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
  // convert from base64 to retain backslash characters
  const branch = branchName && window.atob(branchName);
  const baseURL = 'https://github.com';
  const userURL = `${baseURL}/${user}`;
  const repoURL = `${userURL}/${repo}`;

  const [defaultBranch, setDefaultBranch] = useState('');
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
   * picks up defaultBranch name for repository
   * saves in component state
   */
  const getDefaultBranch = async () => {
    const {
      data: { default_branch: defaultBranch },
    } = await API.getRepo({
      owner: user,
      repo,
    });
    setDefaultBranch(defaultBranch);
  };

  /**
   * picks up the full commit history for a repo's main branch
   * saves main branch commits to local storage
   */
  const getCommitHistory = async () => {
    setIsLoading(true);
    const rawRepoCommits = await API.getRepoCommitHistory({
      owner: user,
      repo,
    });
    const repoCommits = parseRepoData(rawRepoCommits);
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
    getDefaultBranch();

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
        <Link href={repoURL} textDecoration="underline" isExternal>
          {repo}
        </Link>
        <Text color="#808080" style={{ display: 'inline' }}>
          {' '}
          by{' '}
        </Text>
        <Link href={userURL} textDecoration="underline" isExternal>
          {user}
        </Link>
      </Heading>
      <CommitList
        commits={commits}
        branches={branches}
        user={user}
        repo={repo}
        branch={branch}
        defaultBranch={defaultBranch}
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
