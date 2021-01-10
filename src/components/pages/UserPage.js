import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import D3Chart from '../chart/D3Chart';
import API from '../../utils/api';

export const UserPage = () => {
  const [repos, setRepos] = useState([]);
  const [d3Data, setD3Data] = useState({});
  const [username, setUsername] = useState('davidholyko');
  // TODO set username to props.match.params;

  const getData = async () => {
    const tempData = {};
    const { data: repoData } = await API.getReposData({
      username,
    });

    const excluded = ['public-apis', 'EaselJS'];
    const reposToFetch = repoData.filter(
      ({ name }) => !excluded.includes(name),
    );
    await Promise.all(
      reposToFetch.map(async (repo) => {
        const commitHistoryData = await API.getRepoCommitHistory({
          owner: username,
          repo: repo.name,
        });
        tempData[repo.name] = commitHistoryData;
      }),
    );

    const tempD3Data = Object.entries(tempData).map(([key, value]) => {
      return { name: key, value: value.length };
    });
    setD3Data(tempD3Data);
    setRepos(repoData);
  };

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  const onSubmit = async () => {
    event.preventDefault();
    await getData();
  };

  const onChange = (event) => {
    event.persist();
    setUsername(event.target.value);
  };

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
        <Link to={`commits/${repo.name}`} className="link" key={index}>
          <p>{repo.name}</p>
        </Link>
      ))}
    </div>
  );
};
