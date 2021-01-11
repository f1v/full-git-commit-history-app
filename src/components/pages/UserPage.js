import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import D3Chart from '../chart/D3Chart';
import API from '../../utils/api';
import PropTypes from 'prop-types';

import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

const usersState = atom({
  key: 'usersState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

window.usersState = usersState;

// we want to lookup a user, save their repo data, and look up another user
// the first users repo data should be saved so if we go back,
// their repo data is already in our usersState

/*
{
  [user]: [repos],
  a: [{},{}]
}

*/

export const UserPage = ({ match }) => {
  const { user } = match.params;
  // const [{ [user]: repos = [] }, setRepos] = useRecoilState(usersState);
  const [repos, setRepos] = useRecoilState(usersState);
  const [d3Data, setD3Data] = useState({});
  // TODO: rip out our search into its own component
  const [username, setUsername] = useState('');
  let [shouldRedirect, setShouldRedirect] = useState(false);

  console.log(repos);
  window.repos = repos;

  const getData = async () => {
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

    // TODO: de-couple creating chart from getting data
    const tempD3Data = Object.entries(tempData).map(([key, value]) => {
      return { name: key, value: value.length };
    });
    setD3Data(tempD3Data);
    // setRepos({ [user]: repoData });
    setRepos(repoData);
  };

  useEffect(() => {
    // only getData if its not already populated
    if (!repos.length) {
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
      {d3Data.length && <D3Chart data={d3Data} key={JSON.stringify(d3Data)} />}
      {repos.map((repo, index) => (
        <Link to={`${user}/repo/${repo.name}`} className="link" key={index}>
          <p>{repo.name}</p>
        </Link>
      ))}
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
