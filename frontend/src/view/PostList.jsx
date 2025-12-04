import Post from './Post';
import Box from '@mui/material/Box';
import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {userContext} from '../App';

/**
 * Post List
 * @returns {object} JSX for post
 */
function PostList() {
  const navigate = useNavigate();
  const {setUser} = useContext(userContext);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
          `http://localhost:3010/api/v0/post`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
      );

      if (res.status === 401) {
        localStorage.removeItem('authToken');
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
  }, [navigate, setPosts, setUser]);
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

export default PostList;
