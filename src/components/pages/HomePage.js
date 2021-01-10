import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Flex, Input, Text } from '@chakra-ui/react';

export const HomePage = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');

  const onChange = (event) => {
    setUsername(event.target.value);
  };

  const onSubmit = () => {
    username && history.push(`/user/${username}`);
  };

  return (
    <Box as="form" onSubmit={onSubmit}>
      <Flex direction="column">
        <Text as="label" fontSize="34px" htmlFor="username" mb="12px">
          Enter GitHub Username:
        </Text>
        <Input
          fontSize="24px"
          h="60px"
          id="username"
          onChange={onChange}
          textAlign="center"
          w="350px"
        />
      </Flex>
    </Box>
  );
};
