import { Box, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const UsernameSearchField = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');

  const onChange = (event) => {
    setUsername(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    username && history.push(`/user/${username}`);
  };

  return (
    <Box as="form" onSubmit={onSubmit}>
      <Flex align="center" direction="column">
        <Input
          fontSize="24px"
          h="60px"
          id="username"
          onChange={onChange}
          placeholder="Enter GitHub username"
          textAlign="center"
          w="350px"
        />
      </Flex>
    </Box>
  );
};
