import { Link, Text } from '@chakra-ui/react';
import React from 'react';

export const Footer = () => {
  const projectLink = 'https://github.com/f1v/full-git-commit-history-app';
  const f1vLink = 'https://f1v.com/';

  return (
    <footer style={{ padding: '20px' }}>
      <Text color="#808080" fontSize="12px">
        This{' '}
        <Link href={projectLink} textDecoration="underline" isExternal>
          project
        </Link>{' '}
        was made by{' '}
        <Link href={f1vLink} textDecoration="underline" isExternal>
          F1V
        </Link>{' '}
        for our hackathon 2021
      </Text>
    </footer>
  );
};
