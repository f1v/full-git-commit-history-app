import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { Spinner } from '@chakra-ui/react';
import API from '../../utils/api';
import { RepoList } from '../repo-list/RepoList';
import { userRepoState } from '../../recoil/atoms/userRepoState';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';
import { parseRepoData, parseUserData } from '../../utils/github-data-parser';

export const UserPage = ({ match }) => {
  const { user } = match.params;
  const [isLoading, setIsLoading] = useState(false);
  const [userRepos, setUserRepos] = useRecoilState(userRepoState);
  const [commitHistory, setUserCommitHistory] = useRecoilState(
    userCommitHistoryState,
  );
  const { [user]: currentUserRepos = [] } = userRepos;
  // TODO: rip out our search into its own component
  const [username, setUsername] = useState('');
  let [shouldRedirect, setShouldRedirect] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    const repoCommits = {};
    const { data: rawUserData } = await API.getReposData({ username: user });
    const userData = parseUserData(rawUserData);

    // Loop over all repositories and pick up their commitHistory data
    await Promise.all(
      userData.map(async ({ name }) => {
        const rawRepoData = await API.getRepoCommitHistory({
          owner: user,
          repo: name,
        });
        const repoData = parseRepoData(rawRepoData);
        repoCommits[name] = repoData;
      }),
    );

    setUserRepos({ ...userRepos, [user]: userData });
    setUserCommitHistory({ ...commitHistory, [user]: repoCommits });
    setIsLoading(false);
  };

  useEffect(() => {
    // only getData if its not already populated
    if (!currentUserRepos.length) {
      getData();
    }
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setShouldRedirect(true);
  };

  const onChange = (event) => {
    event.persist();
    setUsername(event.target.value);
  };

  if (shouldRedirect) {
    return <Redirect to={username} />;
  }

  return isLoading ? (
    <Spinner size="xl" />
  ) : (
    <div>
      <h1>All your repositories</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="enter github username here"
          onChange={onChange}
        ></input>
      </form>
      <RepoList repos={currentUserRepos} user={user} />
    </div>
  );
};

UserPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.string,
    }),
  }),
};
