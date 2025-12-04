import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import {useNavigate} from 'react-router-dom';
import {useContext, createContext, useState} from 'react';
import {userContext} from '../App';

import PostList from './PostList';
import NavBar from './NavBar';
import GroupPage from './GroupPage';

export const focusContext = createContext();
/**
 * Main Page
 * @returns {object} JSX
 */
function Home() {
  const navigate = useNavigate();
  const {setUser} = useContext(userContext);
  const [focus, setFocus] = useState(0);
  const handleClick = () => {
    localStorage.removeItem('authToken');
    navigate('/');
    setUser();
  };
  return (
    <focusContext.Provider value={{focus, setFocus}}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <NavBar/>
        </Grid>
        <Grid size={4}>
          <Button variant="contained" arialabel='Log out' onClick={handleClick}>
        Logout
          </Button>
        </Grid>
        <Grid size={12} sx={{display: 'flex', justifyContent: 'center'}}>
          {focus == 0 && <PostList/>}
          {focus == 1 && <GroupPage/>}
        </Grid>
      </Grid>
    </focusContext.Provider>
  );
}

export default Home;
