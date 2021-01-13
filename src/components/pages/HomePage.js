import React from 'react';
import { Image } from '@chakra-ui/react';
import toriaLogo from '../../images/toria-logo.svg';

import { UsernameSearchField } from '../../components/main/UsernameSearchField';

export const HomePage = () => {
  return (
    <>
      <Image src={toriaLogo} mb="16px" w="200px" />
      <UsernameSearchField />
    </>
  );
};
