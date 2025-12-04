import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {useContext, useState, useEffect} from 'react';
import {userContext} from '../App';
import {useNavigate} from 'react-router-dom';
/**
 * Login Component used for authentication
 * @returns {object} JSX
 */
function Login() {
  const navigate = useNavigate();
  const {setUser} = useContext(userContext);
  const [credentials, setCredentials] = useState({username: '', password: ''});
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/home');
      setUser(token);
    }
  }, [navigate, setUser]);
  const handleInput = (event) => {
    const {name, value} = event.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };
  const verifyCred = async () => {
    await fetch(`http://localhost:3010/api/v0/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {'Content-Type': 'application/json'}},
    ).then((res) => {
      if (!res.ok) {
        console.log(credentials);
        // This should set something no?
        throw res;
      }
      return res.json();
    }).then((json) => {
      localStorage.setItem('authToken', json.accessToken);
      setUser(json.accessToken);
      navigate('/home');
    }).catch((err) => {
      alert('Error logging in, please try again');
    });
  };
  return (
    <Box
      component="form"
      sx={{'& > :not(style)': {m: 1, width: '25ch'}}}
      noValidate
      autoComplete="off"
    >
      <TextField label="Username" variant="outlined"
        aria-label='Enter username' slotProps={{htmlInput: {maxLength: 20}}}
        onChange={handleInput} name='username'/>
      <TextField label="Password" variant="outlined"
        aria-label='Enter password' slotProps={{htmlInput: {maxLength: 20}}}
        onChange={handleInput} type='password' name='password'/>
      <Button variant="contained" arialabel='Log in' onClick={verifyCred}>
        Log in
      </Button>
    </Box>
  );
}

export default Login;
