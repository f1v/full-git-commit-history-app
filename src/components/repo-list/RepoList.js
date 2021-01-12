import { StarIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, Link, Text } from '@chakra-ui/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { sortReposList } from '../../utils';
import { GithubForkIcon } from '../main/GithubForkIcon';

const Repo = ({ repo, user, shouldShowForks }) => {
  const { description, language, name, pushedAt, numStars, fork } = repo;
  const updatedAtForDisplay = `Updated ${moment(pushedAt).fromNow()}`;
  const starsForDisplay = numStars ? (
    <Flex align="baseline">
      <StarIcon boxSize="14px" />
      <Text fontSize="18px" ml="4px">
        {numStars}
      </Text>
    </Flex>
  ) : null;

  if (fork && !shouldShowForks) {
    // by default, do not render forked repos
    return null;
  }

  return (
    <Box mb="12px" w="550px">
      <Flex align="baseline" justify="space-between">
        <Link as={RouterLink} to={`${user}/repo/${name}`}>
          <Text fontSize="24px">{name}</Text>
        </Link>
        {starsForDisplay}
        {fork && <GithubForkIcon />}
      </Flex>

      <Text fontSize="14px" mb="10px" isTruncated>
        {description}
      </Text>

      <Text fontSize="14px">{language}</Text>
      <Text fontSize="14px">{updatedAtForDisplay}</Text>
      <Divider borderColor="#808080" mt="12px" />
    </Box>
  );
};

export const RepoList = ({ repos, user, shouldShowForks, sortType }) => {
  return repos.length ? (
    <Box m="40px 0" textAlign="left">
      <Divider borderColor="#808080" mb="12px" />
      {sortReposList(repos, sortType).map((repo) => (
        <Repo
          key={repo.id}
          repo={repo}
          user={user}
          shouldShowForks={shouldShowForks}
        />
      ))}
    </Box>
  ) : null;
};

Repo.propTypes = {
  repo: PropTypes.object,
  user: PropTypes.string,
  shouldShowForks: PropTypes.bool,
};

RepoList.propTypes = {
  repos: PropTypes.array,
  user: PropTypes.string,
  shouldShowForks: PropTypes.bool,
  sortType: PropTypes.string,
};
