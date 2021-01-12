import React, { useContext } from 'react';
import { Routes } from './routes/Routes';
import { Footer } from './main/Footer';
import { AppContext } from '../contexts/AppContext';
import { Spinner } from '@chakra-ui/react';

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
