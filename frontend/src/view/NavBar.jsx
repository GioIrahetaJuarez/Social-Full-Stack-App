
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';

import {useContext} from 'react';
import {focusContext} from './Home';


/**
 * Nav Bar for your troubles
 * @returns {object} JSX node
 */
export default function NavBar() {
  const {focus, setFocus} = useContext(focusContext);
  const handleChange = (event, newValue) => {
    setFocus(newValue);
  };

  return (
    <BottomNavigation value={focus} onChange={handleChange}
      aria-label="Navigation Bar">
      <BottomNavigationAction icon={<HomeIcon />} aria-label="home" />
      <BottomNavigationAction icon={<GroupIcon />} aria-label="groups" />
    </BottomNavigation>
  );
}
