import { Box, Button, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const SwitchUserButton = () => (
  <Box position="absolute" top="12px" right="15px">
    <Link as={RouterLink} to="/">
      <Button colorScheme="green">Switch User</Button>
    </Link>
  </Box>
);
