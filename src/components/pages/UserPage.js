import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import API from '../../utils/api';
import { RepoList } from '../repo-list/RepoList';
import { userRepoState } from '../../recoil/atoms/userRepoState';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';

export const UserPage = ({ match }) => {
  const { user } = match.params;
  const [userRepos, setUserRepos] = useRecoilState(userRepoState);
  const [, setUserCommitHistory] = useRecoilState(userCommitHistoryState);
  const { [user]: currentUserRepos = [] } = userRepos;
  // TODO: rip out our search into its own component
  const [username, setUsername] = useState('');
  let [shouldRedirect, setShouldRedirect] = useState(false);

  const getData = async () => {
    // TODO: rename tempData
    const tempData = {};
    const { data: repoData } = await API.getReposData({
      username: user,
    });

    // TODO: remove these excluded repos
    const excluded = ['public-apis', 'EaselJS'];
    const reposToFetch = repoData.filter(
      ({ name }) => !excluded.includes(name),
    );

    await Promise.all(
      reposToFetch.map(async (repo) => {
        const commitHistoryData = await API.getRepoCommitHistory({
          owner: user,
          repo: repo.name,
        });
        tempData[repo.name] = commitHistoryData;
      }),
    );

    setUserRepos({ ...userRepos, [user]: repoData });

    // TODO: reword tempData variable when removing D3 Chart
    const userCommitHistory = { [user]: tempData };
    setUserCommitHistory(userCommitHistory);
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

  return (
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
