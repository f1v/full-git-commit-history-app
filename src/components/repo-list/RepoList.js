import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Divider, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const Repo = ({ repo, user }) => {
  const {
    description,
    language,
    name,
    pushed_at: pushedAt,
    stargazers_count: stars,
  } = repo;
  const updatedAtForDisplay = `Updated ${moment(pushedAt).fromNow()}`;
  const starsForDisplay = stars ? (
    <Flex align="baseline">
      <StarIcon boxSize="14px" />
      <Text fontSize="18px" ml="4px">
        {stars}
      </Text>
    </Flex>
  ) : null;

  return (
    <Box mb="12px">
      <Flex align="baseline" justify="space-between">
        <Link as={RouterLink} to={`${user}/repo/${name}`}>
          <Text fontSize="24px">{name}</Text>
        </Link>
        {starsForDisplay}
      </Flex>

      <Text fontSize="14px" mb="10px">
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
    <Box mt="40px" textAlign="left">
      <Heading fontSize="32px" mb="14px" textAlign="center">
        Repositories
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
