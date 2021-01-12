import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { Spinner } from '@chakra-ui/react';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';
import API from '../../utils/api';
import { parseRepoData } from '../../utils/github-data-parser';
import { CommitList } from '../commit-list/CommitList';

export const RepoPage = ({ match }) => {
  const { user, repo } = match.params;
  const [isLoading, setIsLoading] = useState(false);
  const [commitHistory, setUserCommitHistory] = useRecoilState(
    userCommitHistoryState,
  );

  const getData = async () => {
    setIsLoading(true);
    const rawRepoData = await API.getRepoCommitHistory({
      owner: user,
      repo,
    });
    const repoCommits = parseRepoData(rawRepoData);
    setUserCommitHistory({ ...commitHistory, [user]: { [repo]: repoCommits } });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!commitHistory[user] || !commitHistory[user][repo]) {
      getData();
    }
  }, []);

  return isLoading ? (
    <Spinner size="xl" />
  ) : (
    <div>
      <h1>{repo}</h1>
      <h1>{user}</h1>
      {commitHistory[user] && commitHistory[user][repo] ? (
        <CommitList commits={commitHistory[user][repo]} repo={repo} />
      ) : null}
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
