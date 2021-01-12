import PropTypes from 'prop-types';
import React, { useState } from 'react';

export const AppContext = React.createContext(null);

// This context provider is passed to any component requiring the context
export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node,
};
