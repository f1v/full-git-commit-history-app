import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  Text,
  Select,
} from '@chakra-ui/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { orderRepoBranches } from '../../utils';

// TODO: Make this its own component file and more generic
// refactor with UserPage Select Dropdown
const SelectDropdown = ({ currentBranch, defaultValue, options, onSelect }) => {
  return (
    <Flex justifyContent="flex-end" mb="25px">
      <Select
        borderColor="#808080"
        color="#808080"
        fontSize="15px"
        onChange={onSelect}
        w="160px"
        value={currentBranch || defaultValue}
      >
        {options.map((branchName, index) => {
          return (
            <option key={index} value={branchName}>
              {branchName}
            </option>
          );
        })}
      </Select>
    </Flex>
  );
};

const Commit = ({ githubCommitObject }) => {
  const { sha, commit, html_url: url } = githubCommitObject;
  const { commiter, author, message } = commit;

  return (
    <Box mb="12px" w="550px">
      <Flex align="baseline" justify="space-between">
        <Link href={url} textDecoration="underline" isExternal>
          <Text fontSize="20px" maxW="550px" mb="10px" isTruncated>
            <ExternalLinkIcon mr="2px" w="16px" />
            {message}
          </Text>
        </Link>
      </Flex>
      <Text color="#808080" fontSize="14px">
        {sha}
      </Text>
      {author && (
        <Text color="#808080" fontSize="14px">
          Authored by {author.name}
        </Text>
      )}
      {commiter && (
        <Text color="#808080" fontSize="14px">
          Commited by {commiter.name}
        </Text>
      )}
      <Text color="#808080" fontSize="14px">
        Commited on {moment(author.date).format('MMM Do YYYY, h:mm:ss a')}
      </Text>
      <Divider mt="12px" />
    </Box>
  );
};

export const CommitList = ({
  commits,
  branches,
  user,
  repo,
  branch,
  defaultBranch,
}) => {
  const history = useHistory();
  const options = orderRepoBranches(branches, defaultBranch);

  const onSelect = (event) => {
    event.preventDefault();
    // convert to base64 to retain backslash characters
    const branch = window.btoa(event.target.value);
    history.push(`/user/${user}/repo/${repo}/branch/${branch}`);
  };

  return commits.length ? (
    <>
      <Box mt="25px" textAlign="left">
        <Flex align="baseline" justify="space-between" mb="18px" w="550px">
          <Heading fontSize="28px">Commit History</Heading>
          <SelectDropdown
            currentBranch={branch}
            options={options}
            onSelect={onSelect}
          />
        </Flex>

        <Divider mb="12px" />
        {commits.map((githubCommitObject, index) => (
          <Commit key={index} githubCommitObject={githubCommitObject} />
        ))}
      </Box>
    </>
  ) : null;
};

CommitList.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.object),
  branches: PropTypes.arrayOf(PropTypes.string),
  branch: PropTypes.string,
  user: PropTypes.string,
  repo: PropTypes.string,
  defaultBranch: PropTypes.string,
};

Commit.propTypes = {
  githubCommitObject: PropTypes.shape({
    commit: PropTypes.shape({
      author: PropTypes.object,
      commiter: PropTypes.object,
      message: PropTypes.string,
    }),
    sha: PropTypes.string,
    url: PropTypes.string,
  }),
};

SelectDropdown.propTypes = {
  currentBranch: PropTypes.string,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
};
