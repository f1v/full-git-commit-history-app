import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';

export const RepoPage = ({ match }) => {
  const userCommitHistory = useRecoilValue(userCommitHistoryState);
  const { user, repo } = match.params;

  const getData = async () => {
    // TODO: get Data for that specific user/repo and place in userCommitHistoryState
  };

  useEffect(() => {
    if (!userCommitHistory[user]) {
      // TODO: if user doesnt exist we have to create the user key
    }

    if (!userCommitHistory[user][repo]) {
      // TODO: if repo data doesn't exist, we need to look it up
    }

    getData();
  }, []);

  return (
    <div>
      <h1>{repo}</h1>
      <h1>{user}</h1>
      {userCommitHistory[user][repo].map((commitData) => {
        return <div key={commitData.sha}>{commitData.commit.message}</div>;
      })}
    </div>
  );
};

RepoPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repo: PropTypes.string,
      user: PropTypes.string,
    }),
  }),
};
