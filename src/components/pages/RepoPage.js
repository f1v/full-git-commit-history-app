import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { Spinner } from '@chakra-ui/react';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';
import API from '../../utils/api';
import { parseRepoData } from '../../utils/github-data-parser';
import { CommitList } from '../commit-list/CommitList';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Divider, Flex, Heading, Link, Text } from '@chakra-ui/react';

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

  const commits = (commitHistory[user] && commitHistory[user][repo]) || [];
  const baseURL = 'https://github.com';
  const userURL = `${baseURL}/${user}`;
  const repoURL = `${userURL}/${repo}`;

  return isLoading ? (
    <Spinner size="xl" />
  ) : (
    <div>
      <Heading as="h5" my="30" size="md">
        <Link as={RouterLink} to={`/user/${user}`}>
          go back to {user}'s repositories
        </Link>
      </Heading>
      <Heading fontSize="32px" mb="14px" textAlign="center">
        <Link href={repoURL} isExternal>
          {repo}
        </Link>
        <Text style={{ display: 'inline' }}> by </Text>
        <Link href={userURL} isExternal>
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
