import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './components/App';
import './css/index.scss';
import { RecoilRoot } from 'recoil';
import recoilPersist from 'recoil-persist';

const { RecoilPersist, updateState } = recoilPersist(
  ['userRepoState', 'userCommitHistoryState'], // configurate that atoms will be stored (if empty then all atoms will be stored),
  {
    key: 'recoil-persist', // this key is using to store data in local storage
    storage: localStorage, // configurate which stroage will be used to store the data
  },
);

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <ChakraProvider>
        <RecoilRoot initializeState={updateState}>
          <App />
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
