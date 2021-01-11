import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import D3Chart from '../chart/D3Chart';
import API from '../../utils/api';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { userRepoState } from '../../recoil/atoms/userRepoState';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';

export const UserPage = ({ match }) => {
  const { user } = match.params;
  const [userRepos, setUserRepos] = useRecoilState(userRepoState);
  const [, setUserCommitHistory] = useRecoilState(userCommitHistoryState);
  const { [user]: repos = [] } = userRepos;
  const [d3Data, setD3Data] = useState({});
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

    // TODO: de-couple creating chart from getting data
    const tempD3Data = Object.entries(tempData).map(([key, value]) => {
      return { name: key, value: value.length };
    });
    setD3Data(tempD3Data);

    // clone previous userRepos and append new key value pair
    const newUserRepos = Object.assign({}, userRepos);
    Object.assign(newUserRepos, { [user]: repoData });
    setUserRepos(newUserRepos);

    // TODO: reword tempData when removing D3 Chart
    const userCommitHistory = { [user]: tempData };
    setUserCommitHistory(userCommitHistory);
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
