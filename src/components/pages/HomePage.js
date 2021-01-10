import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.svg';

export const HomePage = () => {
  // TODO: rework this home page completely. Search field to lookup profile should go here
  return (
    <div>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <Link className="App-link" to="/profile/:davidholyko">
        Learn React
      </Link>
    </div>
  );
};
