import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserPage, RepoPage, HomePage } from '../pages';

export const Routes = () => {
  // TODO: we can consolidate the render callback

  return (
    <Switch>
      <Route
        exact
        path="/user/:user"
        render={(props) => {
          return <UserPage key={Math.random()} {...props} />;
        }}
      />
      <Route
        exact
        path="/user/:user/repo/:repo"
        render={(props) => {
          return <RepoPage key={Math.random()} {...props} />;
        }}
      />
      <Route
        exact
        path="/user/:user/repo/:repo/branch/:branch"
        render={(props) => {
          return <RepoPage key={Math.random()} {...props} />;
        }}
      />
      <Route exact path="/" component={HomePage} />
    </Switch>
  );
};
