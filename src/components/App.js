import { Spinner } from '@chakra-ui/react';
import React, { useContext } from 'react';

import { AppContext } from '../contexts/AppContext';
import { Footer } from './main/Footer';
import { Routes } from './routes/Routes';

function App() {
  const { isLoading } = useContext(AppContext);
  return (
    <div className="app-wrapper">
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Routes />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
