import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function RepoPage(props) {
  const repoRef = useRef(null);
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

export default RepoPage;
