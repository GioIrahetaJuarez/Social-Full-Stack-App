import Grid from '@mui/material/Grid';
import Post from './Post';
// ---------------------------------------------------------
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
// ---------------------------------------------------------
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';

import {useState, useEffect, createContext, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {userContext} from '../App';

export const groupContext = createContext();

/**
 * Group Page
 * @returns {object} JSX
 */
export default function GroupPage() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  return (
    <groupContext.Provider value={{selectedGroup, setSelectedGroup}}>
      <Grid container spacing={2} size={12}>
        <Grid size={4}>
          <GroupList/>
        </Grid>
        <Grid size={8}>
          <Feed/>
        </Grid>
      </Grid>
    </groupContext.Provider>
  );
}

/**
 * GroupLists
 * @returns {object} JSX
 */
export function GroupList() {
  const navigate = useNavigate();
  const {setUser} = useContext(userContext);
  const {selectedGroup, setSelectedGroup} = useContext(groupContext);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const fetchGroups = async () => {
      const res = await fetch(
          `http://localhost:3010/api/v0/group`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
      );

      if (res.status == 401) {
        // Expired token
        setUser(null);
        navigate('/');
        return;
      }

      const json = await res.json();
      setGroups(json);
      // If there are any posts
      if (json.length > 0) {
        setSelectedGroup(json[0].id);
      }
    };
    fetchGroups();
  }, [navigate, setGroups, setUser]);
  return (
    <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
      aria-label='Group List'>
      {groups.map((group) => (
        <ListItem key={group.id} disablePadding>
          <ListItemButton
            selected={selectedGroup === group.id}
            onClick={() => setSelectedGroup(group.id)}
            aria-label={`Go to group: ${group.name}`}
          >
            <ListItemAvatar>
              <Avatar>
                <ImageIcon/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={group.name}/>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}


/**
 * Feed
 * @returns {object} JSX for post
 */
export function Feed() {
  const navigate = useNavigate();
  const {setUser} = useContext(userContext);
  const [posts, setPosts] = useState([]);
  const {selectedGroup} = useContext(groupContext);
  useEffect(() => {
    if (selectedGroup) {
      const fetchPosts = async () => {
        const url = `http://localhost:3010/api/v0/post?groupId=${selectedGroup}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
        );

        if (res.status === 401) {
          setUser(null);
          navigate('/');
          return;
        }
        const json = await res.json();
        const sortedPosts = json.sort((a, b) =>
          new Date(b.created) - new Date(a.created),
        );
        setPosts(sortedPosts);
      };
      fetchPosts();
    }
  }, [selectedGroup, setPosts, setUser, navigate]);
  return (
    <Box sx={{
      display: 'grid',
      gap: 2,
    }}>
      {posts.map((data, index) => {
        return (
          <Post data={data} key={index}/>
        );
      })}
    </Box>
  );
}
