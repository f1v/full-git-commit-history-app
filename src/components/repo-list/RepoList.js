import { StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  Select,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { filterRepos } from '../../utils';

const Repo = ({ repo, user }) => {
  const { description, language, name, pushedAt, numStars } = repo;
  const updatedAtForDisplay = `Updated ${moment(pushedAt).fromNow()}`;
  const starsForDisplay = numStars ? (
    <Flex align="baseline">
      <StarIcon boxSize="14px" />
      <Text fontSize="18px" ml="4px">
        {numStars}
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
  const [repoFilter, setRepoFilter] = useState('lastUpdated');

  const onFilterChange = (event) => {
    const filterValue = event.target.value;
    setRepoFilter(filterValue);
  };

  const SelectFilter = () => (
    <Flex justifyContent="flex-end" mb="12px">
      <Select fontSize="15px" onChange={onFilterChange} w="160px">
        <option value="lastUpdated">Last Updated</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="numStars">Star Count</option>
      </Select>
    </Flex>
  );

  return repos.length ? (
    <Box m="40px 0" textAlign="left">
      <Heading fontSize="28px" mb="16px" textAlign="center">
        {user}'s Repositories
      </Heading>

      <SelectFilter />

      {filterRepos(repos, repoFilter).map((repo) => (
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
