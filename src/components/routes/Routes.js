import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserPage, RepoPage, HomePage } from '../pages';

export const Routes = () => {
  return (
    <Switch>
      <Route
        exact
        path="/profile/:user"
        render={(props) => {
          return <UserPage {...props} />;
        }}
      />
      <Route
        exact
        path="/profile/:user/:repo"
        render={(props) => {
          return <RepoPage {...props} />;
        }}
      />
      <Route path="/" component={HomePage} />
    </Switch>
  );
};
