import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';
import API from '../../utils/api';
import { parseRepoData } from '../../utils/github-data-parser';
import { CommitList } from '../commit-list/CommitList';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Divider, Flex, Heading, Link, Text } from '@chakra-ui/react';

export const RepoPage = ({ match }) => {
  const { user, repo } = match.params;
  const [commitHistory, setUserCommitHistory] = useRecoilState(
    userCommitHistoryState,
  );

  const getData = async () => {
    const rawRepoData = await API.getRepoCommitHistory({
      owner: user,
      repo,
    });
    const repoCommits = parseRepoData(rawRepoData);
    setUserCommitHistory({ ...commitHistory, [user]: { [repo]: repoCommits } });
  };

  useEffect(() => {
    if (!commitHistory[user] || !commitHistory[user][repo]) {
      getData();
    }
  }, []);

  const commits = (commitHistory[user] && commitHistory[user][repo]) || [];

  return (
    <div>
      <Heading fontSize="32px" mb="14px" textAlign="center">
        {repo} by{' '}
        <Link as={RouterLink} to={`/user/${user}`}>
          {user}
        </Link>
      </Heading>
      <CommitList commits={commits} repo={repo} />
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
