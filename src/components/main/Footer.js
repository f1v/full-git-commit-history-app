import React from 'react';
import { Link, Text } from '@chakra-ui/react';

export const Footer = () => {
  const projectLink = 'https://github.com/f1v/full-git-commit-history-app';
  const f1vLink = 'https://f1v.com/';

  return (
    <footer style={{ padding: '20px' }}>
      <Text fontSize="12px">
        This{' '}
        <Link href={projectLink} isExternal>
          project
        </Link>{' '}
        was made by{' '}
        <Link href={f1vLink} isExternal>
          F1V
        </Link>{' '}
        for our hackathon 2021
      </Text>
    </footer>
  );
};
