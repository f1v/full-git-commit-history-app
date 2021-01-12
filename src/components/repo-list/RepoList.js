import { StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Link,
  Text,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { sortReposList } from '../../utils';

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

export const RepoList = ({ repos, user, sortType }) => {
  const [shouldShowForks, setShouldShowForks] = useState(false);

  const onToggleSwitch = () => {
    setShouldShowForks(!shouldShowForks);
  };

  return repos.length ? (
    <Box m="40px 0" textAlign="left">
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="fork-switch" mb="0">
          Show Forks
        </FormLabel>
        <Switch
          id="fork-switch"
          size="lg"
          onChange={onToggleSwitch}
          value={shouldShowForks}
        />
      </FormControl>
      <Divider borderColor="#808080" mb="24px" />
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
  sortType: PropTypes.string,
};
