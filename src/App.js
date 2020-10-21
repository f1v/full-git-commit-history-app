import React, { useEffect, useState, useRef } from 'react';
import './App.scss';
import { api } from './api';
import logo from './logo.svg';
import { Link, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

function D3Chart() {
  const svgRef = useRef(null);
  const width = 500;
  const height = 500;
  const margin = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20,
  };
  const color = 'white';
  const data = [
    { name: 'a', value: 1 },
    { name: 'b', value: 2 },
    { name: 'c', value: 2 },
  ];
  const x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);
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

  svg.append('g').call(xAxis);
  svg.append('g').call(yAxis);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
}

function RepoPage(props) {
  const repoRef = useRef(null);
  const [history, setHistory] = useState([]);
  const { repo } = props.match.params;

  const getData = async () => {
    const { data: historyData } = await api.getRepoCommitHistory({
      owner: 'davidholyko',
      repo,
    });
    setHistory(historyData);
  };

  useEffect(() => {
    getData();
  }, []);

  console.log('!!! history', history);

  return (
    <div ref={repoRef}>
      <h1>{repo}</h1>
      <D3Chart />
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

  const getData = async () => {
    const { data: repoData } = await api.getRepos({ username: 'davidholyko' });
    setRepos(repoData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      d7
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

export default App;
