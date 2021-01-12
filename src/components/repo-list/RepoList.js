import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Divider, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const Repo = ({ repo, user }) => {
  const { description, language, name, pushedAt, stargazersCount } = repo;
  const updatedAtForDisplay = `Updated ${moment(pushedAt).fromNow()}`;
  const starsForDisplay = stargazersCount ? (
    <Flex align="baseline">
      <StarIcon boxSize="14px" />
      <Text fontSize="18px" ml="4px">
        {stargazersCount}
      </Text>
    </Flex>
  ) : null;

  return (
    <Box mb="12px" w="550px">
      <Flex align="baseline" justify="space-between">
        <Link as={RouterLink} to={`${user}/repo/${name}`}>
          <Text fontSize="24px">{name}</Text>
        </Link>
        {starsForDisplay}
      </Flex>

      <Text fontSize="14px" mb="10px" isTruncated>
        {description}
      </Text>

      <Text fontSize="14px">{language}</Text>
      <Text fontSize="14px">{updatedAtForDisplay}</Text>
      <Divider mt="12px" />
    </Box>
  );
};

export const RepoList = ({ repos, user }) => {
  return repos.length ? (
    <Box m="40px 0" textAlign="left">
      <Heading fontSize="28px" mb="24px" textAlign="center">
        {user}'s Repositories
      </Heading>
      {repos.map((repo) => (
        <Repo key={repo.id} repo={repo} user={user} />
      ))}
    </Box>
  ) : null;
};

Repo.propTypes = {
  repo: PropTypes.object,
  user: PropTypes.string,
};

RepoList.propTypes = {
  repos: PropTypes.array,
  user: PropTypes.string,
};
