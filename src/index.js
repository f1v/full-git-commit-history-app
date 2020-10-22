import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import { Link, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { request } from '@octokit/request';
const TOKEN = process.env.GITHUB_TOKEN;

// endpoints
// https://docs.github.com/en/free-pro-team@latest/rest/overview/endpoints-available-for-github-apps

const octoRequest = request.defaults({
  headers: {
    authorization: 'token ' + TOKEN,
  },
});

const getReposData = async ({ username }) => {
  return await octoRequest('GET /users/{username}/repos', {
    username,
  });
};

const getRepoCommitHistory = async ({
  owner,
  repo,
  sha = 'master',
  data = [],
  escapeCount = 0,
}) => {
  if (escapeCount > 5) return data;
  const { data: commitHistory } = await octoRequest(
    `GET /repos/{owner}/{repo}/commits?sha=${sha}`,
    {
      owner,
      repo,
    },
  );

  const { sha: earliestSHA } = commitHistory[commitHistory.length - 1];
  data = [...data, ...commitHistory];

  if (commitHistory.length > 1) {
    return await getRepoCommitHistory({
      owner,
      repo,
      sha: earliestSHA,
      data,
      escapeCount: escapeCount++,
    });
  } else {
    return data;
  }
};

const api = {
  getReposData,
  getRepoCommitHistory,
};

const DEFAULT_DATA = [
  { name: 'a', value: 1 },
  { name: 'b', value: 2 },
  { name: 'c', value: 2 },
];

function D3Chart({ data = DEFAULT_DATA }) {
  const svgRef = useRef(null);
  const width = 700;
  const height = 700;
  const margin = {
    left: 125,
    right: 20,
    top: 100,
    bottom: 125,
  };
  const color = 'white';

  useEffect(() => {}, []);

  const x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.5);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);
  const xAxis = (g) =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .tickFormat((i) => data[i].name)
        .tickSizeOuter(0),
    );
  const yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(data.y),
      );

  const svg = d3.select(svgRef.current).attr('viewBox', [0, 0, width, height]);

  svg
    .append('g')
    .attr('fill', color)
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (_d, i) => x(i))
    .attr('y', (d) => y(d.value))
    .attr('height', (d) => y(0) - y(d.value))
    .attr('width', x.bandwidth());

  svg
    .append('g')
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-45)');
  svg.append('g').call(yAxis);

  return (
    <div>
      <svg ref={svgRef} height={height} width={width}></svg>
    </div>
  );
}

function RepoPage(props) {
  const repoRef = useRef(null);
  // const [history, setHistory] = useState([]);
  const { repo } = props.match.params;

  const getData = async () => {};

  useEffect(() => {
    getData();
  }, []);

  return (
    <div ref={repoRef}>
      <h1>{repo}</h1>
    </div>
  );
}

RepoPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repo: PropTypes.string,
    }),
  }),
};

function RepositoriesPage() {
  const [repos, setRepos] = useState([]);
  const [d3Data, setD3Data] = useState({});
  const [username, setUsername] = useState('davidholyko');

  const getData = async () => {
    const tempData = {};
    const { data: repoData } = await api.getReposData({
      username,
    });

    const excluded = ['public-apis', 'EaselJS'];
    const reposToFetch = repoData.filter(
      ({ name }) => !excluded.includes(name),
    );
    await Promise.all(
      reposToFetch.map(async (repo) => {
        const commitHistoryData = await api.getRepoCommitHistory({
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
}

function HomePage() {
  return (
    <div>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <Link className="App-link" to="/d3">
        Learn React
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Switch>
          <Route exact path="/d3" component={RepositoriesPage} />
          <Route
            exact
            path="/commits/:repo"
            render={(props) => {
              return <RepoPage {...props} />;
            }}
          />
          <Route path="/" component={HomePage} />
        </Switch>
      </header>
    </div>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept(function () {
    console.log('An error occurred while accepting new version');
  });
}
