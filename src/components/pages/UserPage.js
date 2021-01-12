import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';

import { userRepoState } from '../../recoil/atoms/userRepoState';
import { API, parseUserData } from '../../utils';
import { RepoList } from '../repo-list/RepoList';
import { UsernameSearchField } from '../main/UsernameSearchField';
import { AppContext } from '../../contexts/AppContext';

export const UserPage = ({ match }) => {
  const { user } = match.params;
  const { setIsLoading } = useContext(AppContext);
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

  return (
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
