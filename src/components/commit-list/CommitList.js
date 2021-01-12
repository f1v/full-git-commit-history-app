import { Box, Divider, Flex, Link, Text, Select } from '@chakra-ui/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

const Commit = ({ githubCommitObject }) => {
  const { sha, commit, html_url: url } = githubCommitObject;
  const { commiter, author, message } = commit;

  return (
    <Box mb="12px" w="550px">
      <Flex align="baseline" justify="space-between">
        <Link href={url} isExternal>
          <Text fontSize="24px" maxW="550px" mb="10px" isTruncated>
            {message}
          </Text>
        </Link>
      </Flex>
      <Text fontSize="14px">{sha}</Text>
      {author && <Text fontSize="14px">Authored by {author.name}</Text>}
      {commiter && <Text fontSize="14px">Commited by {commiter.name}</Text>}
      <Text fontSize="14px">
        Commited on {moment(author.date).format('MMM Do YYYY, h:mm:ss a')}
      </Text>
      <Divider mt="12px" />
    </Box>
  );
};

export const CommitList = ({ commits, branches, user, repo }) => {
  const history = useHistory();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [branch, setBranch] = useState('');

  const onSelect = (event) => {
    event.preventDefault();
    // convert to base64 to retain backslash characters
    const selectedBranch = window.btoa(event.target.value);
    setShouldRedirect(true);
    setBranch(selectedBranch);
  };

  const SelectDropdown = () => {
    // TODO: add functionality for the edge case where a repo starts with main branch instead of master
    return (
      <Flex justifyContent="flex-end" mb="12px">
        <Select fontSize="15px" onChange={onSelect} w="160px">
          <option value="master">master</option>
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
  };

  if (shouldRedirect) {
    return <Redirect to={`/user/${user}/repo/${repo}/branch/${branch}`} />;
  }

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
  user: PropTypes.string,
  repo: PropTypes.string,
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
