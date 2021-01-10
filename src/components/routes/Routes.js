import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserPage, RepoPage, HomePage } from '../pages';

export const Routes = () => {
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
          return <RepoPage {...props} />;
        }}
      />
      <Route exact path="/" component={HomePage} />
    </Switch>
  );
};
