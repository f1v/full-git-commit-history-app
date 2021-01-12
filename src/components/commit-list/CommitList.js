import { Box, Divider, Flex, Link, Text, Select } from '@chakra-ui/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const Commit = ({ sha, commit, commiter, author, url }) => {
  return (
    <Box mb="12px" w="550px">
      <Flex align="baseline" justify="space-between">
        <Link href={url} isExternal>
          <Text fontSize="24px" maxW="550px" mb="10px" isTruncated>
            {commit.message}
          </Text>
        </Link>
      </Flex>
      <Text fontSize="14px">{sha}</Text>
      {author && <Text fontSize="14px">Authored by {commit.author.name}</Text>}
      {commiter && (
        <Text fontSize="14px">Commited by {commit.commiter.name}</Text>
      )}
      <Text fontSize="14px">
        Commited on{' '}
        {moment(commit.author.date).format('MMM Do YYYY, h:mm:ss a')}
      </Text>
      <Divider mt="12px" />
    </Box>
  );
};

export const CommitList = ({ commits, branches }) => {
  const onSelect = (event) => {
    // TODO
    event.preventDefault();
  };

  const SelectDropdown = () => (
    <Flex justifyContent="flex-end" mb="12px">
      <Select fontSize="15px" onChange={onSelect} w="160px">
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
      <Box mt="40px" textAlign="left">
        <SelectDropdown />
        {commits.map(({ author, commit, commiter, html_url, sha }) => (
          <Commit
            key={sha}
            sha={sha}
            commit={commit}
            url={html_url}
            commiter={commiter}
            author={author}
          />
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
  author: PropTypes.object,
  commit: PropTypes.object,
  commiter: PropTypes.object,
  sha: PropTypes.string,
  url: PropTypes.string,
};
