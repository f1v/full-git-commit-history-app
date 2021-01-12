import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Switch,
} from '@chakra-ui/react';
import React, { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';

import { userRepoState } from '../../recoil/atoms/userRepoState';
import { API, parseUserData } from '../../utils';
import { RepoList } from '../repo-list/RepoList';
import { AppContext } from '../../contexts/AppContext';

export const UserPage = ({ match }) => {
  const { user } = match.params;
  const [sortType, setSortType] = useState('lastUpdated');
  const { setIsLoading } = useContext(AppContext);
  const [userRepos, setUserRepos] = useRecoilState(userRepoState);
  const { [user]: currentUserRepos = [] } = userRepos;
  const [shouldShowForks, setShouldShowForks] = useState(false);

  const getData = async () => {
    setIsLoading(true);

    const { data: rawUserData } = await API.getUserRepos({ username: user });
    const userData = parseUserData(rawUserData);

    setUserRepos({ ...userRepos, [user]: userData });
    setIsLoading(false);
  };

  useEffect(() => {
    // only getData if its not already populated
    if (!currentUserRepos.length) {
      getData();
    }
  }, []);

  const onSortChange = (event) => {
    const sortValue = event.target.value;
    setSortType(sortValue);
  };

  const SelectDropdown = () => (
    <Flex>
      <Select
        borderColor="#808080"
        color="#808080"
        fontSize="15px"
        onChange={onSortChange}
        value={sortType}
        w="160px"
      >
        <option value="lastUpdated">Last Updated</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="numStars">Star Count</option>
      </Select>
    </Flex>
  );

  const onToggleSwitch = () => {
    setShouldShowForks(!shouldShowForks);
  };

  const ShowForksSwitch = () => (
    <FormControl
      display="flex"
      alignItems="baseline"
      justifyContent="flex-end"
      w="550px"
    >
      <FormLabel color="#808080" htmlFor="fork-switch" mb="0">
        Show Forks
      </FormLabel>
      <Switch
        isChecked={shouldShowForks}
        id="fork-switch"
        size="sm"
        onChange={onToggleSwitch}
      />
    </FormControl>
  );

  return (
    <>
      <Flex align="center" justify="space-between" mt="25px" w="550px">
        <Heading fontSize="28px">{user}'s Repositories</Heading>
        <SelectDropdown />
      </Flex>

      <ShowForksSwitch shouldShowForks={shouldShowForks} />

      <RepoList
        repos={currentUserRepos}
        shouldShowForks={shouldShowForks}
        sortType={sortType}
        user={user}
      />
    </>
  );
};

UserPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.string,
    }),
  }),
};
