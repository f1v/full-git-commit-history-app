import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './components/App';
import { AppProvider } from './contexts/AppContext';
import './css/index.scss';
import { RecoilRoot } from 'recoil';
import recoilPersist from 'recoil-persist';

const { RecoilPersist, updateState } = recoilPersist([
  'userRepoState',
  'userCommitHistoryState',
]);

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <ChakraProvider>
        <RecoilRoot initializeState={updateState}>
          <AppProvider>
            <App />
          </AppProvider>
          <RecoilPersist />
        </RecoilRoot>
      </ChakraProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept(() => {
    console.log('An error occurred while accepting new version');
  });
}
