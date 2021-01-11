import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Box, Flex, Input, Text } from '@chakra-ui/react';

export const UsernameSearchField = ({ size }) => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const isFullSize = size === 'full';
  const labelText = isFullSize
    ? 'Enter GitHub Username'
    : 'Search another user';

  const onChange = (event) => {
    setUsername(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    username && history.push(`/user/${username}`);
  };

  return (
    <Box as="form" mt={isFullSize ? '0' : '18px'} onSubmit={onSubmit}>
      <Flex direction="column">
        <Text
          as="label"
          fontSize={isFullSize ? '34px' : '18px'}
          htmlFor="username"
          mb={isFullSize ? '12px' : '4px'}
        >
          {labelText}
        </Text>
        <Input
          fontSize={isFullSize ? '24px' : '18px'}
          h={isFullSize ? '60px' : '40px'}
          id="username"
          onChange={onChange}
          textAlign="center"
          w={isFullSize ? '350px' : '200px'}
        />
      </Flex>
    </Box>
  );
};

// Full size is used on HomePage. Small size is used on UserPage.
UsernameSearchField.propTypes = {
  size: PropTypes.oneOf(['full', 'small']),
};
