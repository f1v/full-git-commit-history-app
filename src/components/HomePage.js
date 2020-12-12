import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

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

export default HomePage;
