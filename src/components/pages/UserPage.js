import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { Spinner } from '@chakra-ui/react';
import { userRepoState } from '../../recoil/atoms/userRepoState';
import API from '../../utils/api';
import { parseUserData } from '../../utils/github-data-parser';
import { RepoList } from '../repo-list/RepoList';
import { UsernameSearchField } from '../main/UsernameSearchField';

export const UserPage = ({ match }) => {
  const { user } = match.params;
  const [isLoading, setIsLoading] = useState(false);
  const [userRepos, setUserRepos] = useRecoilState(userRepoState);
  const { [user]: currentUserRepos = [] } = userRepos;

  const getData = async () => {
    setIsLoading(true);

    const { data: rawUserData } = await API.getReposData({ username: user });
    const userData = parseUserData(rawUserData);

    setUserRepos({ ...userRepos, [user]: userData });
    setIsLoading(false);
  };

  useEffect(() => {
    // only getData if its not already populated
    if (!currentUserRepos.length) {
      getData();
    }
  }, []);

  return isLoading ? (
    <Spinner size="xl" />
  ) : (
    <>
      <UsernameSearchField size="small" />
      <RepoList repos={currentUserRepos} user={user} />
    </>
  );
};

UserPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.string,
    }),
  }),
};
