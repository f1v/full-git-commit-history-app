import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { userCommitHistoryState } from '../../recoil/atoms/userCommitHistoryState';
import API from '../../utils/api';
import { parseRepoData } from '../../utils/github-data-parser';

export const RepoPage = ({ match }) => {
  const { user, repo } = match.params;
  const [commitHistory, setUserCommitHistory] = useRecoilState(
    userCommitHistoryState,
  );

  const getData = async () => {
    const rawRepoData = await API.getRepoCommitHistory({
      owner: user,
      repo,
    });
    const repoCommits = parseRepoData(rawRepoData);
    setUserCommitHistory({ ...commitHistory, [user]: { [repo]: repoCommits } });
  };

  useEffect(() => {
    if (!commitHistory[user] || !commitHistory[user][repo]) {
      getData();
    }
  }, []);

  return (
    <div>
      <h1>{repo}</h1>
      <h1>{user}</h1>
      {commitHistory[user] && commitHistory[user][repo]
        ? commitHistory[user][repo].map((commitData) => {
            return <div key={commitData.sha}>{commitData.commit.message}</div>;
          })
        : null}
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
