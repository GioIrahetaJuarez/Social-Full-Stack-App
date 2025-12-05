import {test, expect, beforeAll, beforeEach, afterEach, afterAll} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Routes, Route, MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PropTypes from 'prop-types';

import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';

import {userContext} from '../App';
import App from '../App';
import Login from '../view/Login';
import Home from '../view/Home';

import {useState} from 'react';

// Mock Provider-----------------------------------------------------
const MockProvider = ({children, initialEntries = ['/']}) => {
  const [user, setUser] = useState();
  return (
    <userContext.Provider value={{user, setUser}}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          {children}
        </Routes>
      </MemoryRouter>
    </userContext.Provider>
  );
};

MockProvider.propTypes = {
  children: PropTypes.node,
  initialEntries: PropTypes.array,
};

// Mock API ----------------------------------------------------------
const server = setupServer(
    http.post('http://localhost:3010/api/v0/login', async ({request}) => {
      const credentials = await request.json();
      if (credentials.username == 'johnpork67' &&
        credentials.password == 'BaconBits') {
        return HttpResponse.json({
          accessToken: 'atotallyrealjwt',
        });
      } else {
        return HttpResponse.json(null, {status: 401});
      }
    }),
    http.get('http://localhost:3010/api/v0/post', async () => {
      return HttpResponse.json([
        {img: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Big_Guy.jpg', created: '2025-11-27T21:42:30.000Z'},
        {img: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Big_Guy.jpg', created: '2025-11-27T21:42:30.000Z'},
        {img: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Big_Guy.jpg', created: '2025-11-27T21:42:30.000Z'},
      ], {status: 200});
    }),
    http.get('http://localhost:3010/api/v0/post/:postId', async () => {
      return HttpResponse.json(null, {status: 404});
    }),
);

beforeAll(() => server.listen());
beforeEach(() => localStorage.clear());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// App Test  ---------------------------------------------------------
test('APP Renders', async () => {
  render(<App/>);
});

// Login Test---------------------------------------------------------
test('LOGIN Renders', async () => {
  render(<MockProvider>
    <Route path='/' element={<Login/>}/>
  </MockProvider>);
});

test('LOGIN contains username field', async () => {
  render(<MockProvider>
    <Route path='/' element={<Login/>}/>
  </MockProvider>);
  expect(screen.getByLabelText('Enter username')).toBeInTheDocument();
});

test('LOGIN contains password field', async () => {
  render(<MockProvider>
    <Route path='/' element={<Login/>}/>
  </MockProvider>);
  expect(screen.getByLabelText('Enter password')).toBeInTheDocument();
});

test('LOGIN username limit char20 count', async () => {
  const user = userEvent.setup();
  render(<MockProvider>
    <Route path='/' element={<Login/>}/>
  </MockProvider>);
  const entryField = screen.getByLabelText('Username');
  await user.type(entryField, 'This is longer than 20 chars so fail bro');
  expect(entryField.value).toHaveLength(20);
});

test('LOGIN password limit char20 count', async () => {
  const user = userEvent.setup();
  render(<MockProvider>
    <Route path='/' element={<Login/>}/>
  </MockProvider>);
  const entryField = screen.getByLabelText('Password');
  await user.type(entryField, 'This is longer than 20 chars so fail bro');
  expect(entryField.value).toHaveLength(20);
});

test('LOGIN button exists', async () => {
  render(<MockProvider>
    <Route path='/' element={<Login/>}/>
  </MockProvider>);
  const button = screen.queryByText('Log in');
  expect(button).not.toBeNull();
});

test('LOGIN No user', async () => {
  const user = userEvent.setup();
  render(
      <MockProvider>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </MockProvider>,
  );
  const userField = screen.getByLabelText('Username');
  const pswrdField = screen.getByLabelText('Password');
  await user.type(userField, 'dilbert');
  await user.type(pswrdField, 'Werk');
  const button = screen.queryByText('Log in');
  await user.click(button);
  const successMessage = await screen.findByText('Log in');
  expect(successMessage).toBeInTheDocument();
});

test('LOGIN success', async () => {
  const user = userEvent.setup();
  render(
      <MockProvider>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </MockProvider>,
  );
  const userField = screen.getByLabelText('Username');
  const pswrdField = screen.getByLabelText('Password');
  await user.type(userField, 'johnpork67');
  await user.type(pswrdField, 'BaconBits');
  const button = screen.queryByText('Log in');
  await user.click(button);
  const successMessage = await screen.findByText('Logout');
  expect(successMessage).toBeInTheDocument();
});

test('Token stored as a string', async () => {
  const user = userEvent.setup();
  render(
      <MockProvider>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </MockProvider>,
  );
  const userField = screen.getByLabelText('Username');
  const pswrdField = screen.getByLabelText('Password');
  await user.type(userField, 'johnpork67');
  await user.type(pswrdField, 'BaconBits');
  const button = screen.queryByText('Log in');
  await user.click(button);
  expect(localStorage.getItem('authToken')).toBe('atotallyrealjwt');
});
