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
  const { user, repo } = match.params;
  const [branches, setBranches] = useState([]);
  const { setIsLoading } = useContext(AppContext);
  const [commitHistory, setUserCommitHistory] = useRecoilState(
    userCommitHistoryState,
  );

  const getRepoData = async () => {
    setIsLoading(true);
    const rawRepoData = await API.getRepoCommitHistory({
      owner: user,
      repo,
    });
    const repoCommits = parseRepoData(rawRepoData);
    setUserCommitHistory({ ...commitHistory, [user]: { [repo]: repoCommits } });
    setIsLoading(false);
  };

  const getBranchesData = async () => {
    const rawData = await API.getRepoBranches({ owner: user, repo });
    const newBranches = rawData.map(({ name }) => name);
    setBranches(newBranches);
  };

  useEffect(() => {
    if (!commitHistory[user] || !commitHistory[user][repo]) {
      getRepoData();
    }

    if (!branches.length) {
      getBranchesData();
    }
  }, []);

  const commits = (commitHistory[user] && commitHistory[user][repo]) || [];
  const baseURL = 'https://github.com';
  const userURL = `${baseURL}/${user}`;
  const repoURL = `${userURL}/${repo}`;

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
      <CommitList commits={commits} branches={branches} />
    </div>
  );
};

RepoPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repo: PropTypes.string,
      user: PropTypes.string,
    }),
  }),
};
