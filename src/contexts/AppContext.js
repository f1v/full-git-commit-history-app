import PropTypes from 'prop-types';
import React, { useState } from 'react';

export const AppContext = React.createContext(null);

// This context provider is passed to any component requiring the context
export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  // TODO: implement lightMode
  const [isLightMode, setIsLightMode] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isLightMode,
        isLoading,
        setIsLightMode,
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
