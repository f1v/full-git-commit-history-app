import React, { useEffect, useState } from 'react';
import './App.scss';
import { api } from './api';

function App() {
  const [repos, setRepos] = useState([]);
  const [history, setHistory] = useState([]);

  const getData = async () => {
    const { data: repoData } = await api.getRepos({ username: 'davidholyko' });
    console.log('!!! data', repoData);
    setRepos(repoData);

    const { data: historyData } = await api.getRepoCommitHistory({
      owner: 'davidholyko',
      repo: 'challenge-problems',
    });
    setHistory(historyData);
  };

  useEffect(() => {
    console.log('!!! useEffect');

    getData();
  }, []);

  console.log('!!! repos', repos);
  console.log('!!! history', history);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
