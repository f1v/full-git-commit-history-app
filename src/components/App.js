import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RepositoriesPage from './repos/RepositoriesPage';
import RepoPage from './repos/RepoPage';
import HomePage from './HomePage';

function App() {
  return (
    <div className="app-wrapper">
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
    </div>
  );
}

export default App;
