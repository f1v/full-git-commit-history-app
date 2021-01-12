import { Box, Divider, Flex, Link, Text, Select } from '@chakra-ui/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

const Commit = ({ githubCommitObject }) => {
  const { sha, commit, html_url: url } = githubCommitObject;
  const { commiter, author, message } = commit;

  return (
    <Box mb="12px" w="550px">
      <Flex align="baseline" justify="space-between">
        <Link href={url} textDecoration="underline" isExternal>
          <Text fontSize="20px" maxW="550px" mb="10px" isTruncated>
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

export const CommitList = ({ commits, branches }) => {
  const onSelect = (event) => {
    // TODO: selecting a branch should reload the page to that branch
    event.preventDefault();
  };

  const SelectDropdown = () => (
    <Flex justifyContent="flex-end" mb="25px">
      <Select
        borderColor="#808080"
        color="#808080"
        fontSize="15px"
        onChange={onSelect}
        w="160px"
      >
        {branches.map((branchName, index) => {
          return (
            <option key={index} value={branchName}>
              {branchName}
            </option>
          );
        })}
      </Select>
    </Flex>
  );

  return commits.length ? (
    <>
      <Box mt="25px" textAlign="left">
        <SelectDropdown />
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
