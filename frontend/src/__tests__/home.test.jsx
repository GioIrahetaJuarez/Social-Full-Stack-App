import {test, expect, beforeAll, beforeEach, afterEach, afterAll} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {Routes, Route, MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PropTypes from 'prop-types';

import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';

import {userContext} from '../App';
import App from '../App';
import Login from '../view/Login';
import Home from '../view/Home';
import PostList from '../view/PostList';
import ProtectedRoute from '../view/ProtectedRoute';

import {useState} from 'react';

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const today = new Date();
today.setHours(12, 0, 0, 0);

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

// Create a custom provider with an initial user
const AuthenticatedMockProvider = ({children, initialEntries = ['/']}) => {
  const [user, setUser] = useState({token: 'fake-token'});
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

AuthenticatedMockProvider.propTypes = {
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
    http.get('http://localhost:3010/api/v0/post', async ({request}) => {
      const url = new URL(request.url);
      const groupId = url.searchParams.get('groupId');
      if (groupId === '10000000-0000-0000-0000-000000000001') {
        return HttpResponse.json([
          {
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Garden_of_earthly_delights.jpg/1200px-The_Garden_of_earthly_delights.jpg',
            created: '2003-11-28T15:30:00.000Z',
            text: '1 Post in group A',
          },
          {
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Garden_of_earthly_delights.jpg/1200px-The_Garden_of_earthly_delights.jpg',
            created: '2025-11-28T15:30:00.000Z',
            text: '2 Post in group A',
          },
        ], {status: 200});
      } else if (groupId === '20000000-0000-0000-0000-000000000002') {
        return HttpResponse.json([
          {
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Stylised_atom_with_three_Bohr_model_orbits_and_stylised_nucleus.svg/250px-Stylised_atom_with_three_Bohr_model_orbits_and_stylised_nucleus.svg.png',
            created: '2025-11-29T10:15:00.000Z',
            text: 'Post in group B',
          },
        ], {status: 200});
      } else {
        return HttpResponse.json([
          {
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIB6ys-cWBryrjVnEfYf186eNMAximvWgtxQ&s',
            created: '2003-11-30T21:42:30.526Z',
            text: 'grah',
          },
          {
            img: 'https://www.rap-up.com/article/media_1fbb4297d00311931c2f90bc5fe65e80883ea13db.png?width=800&format=png&optimize=high',
            created: yesterday.toISOString(),
            text: 'hey freakbob here',
          },
          {
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSurlBct6TRfGQDnkt3SHufWvVfdN6MEmOc2A',
            created: today.toISOString(),
            text: 'wait im healing',
          },
        ], {status: 200});
      }
    }),
    http.get('http://localhost:3010/api/v0/post/:postId', async () => {
      return HttpResponse.json(null, {status: 404});
    }),
    http.get('http://localhost:3010/api/v0/group', async () => {
      return HttpResponse.json([
        {
          id: '10000000-0000-0000-0000-000000000001',
          owner: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          name: 'A',
        },
        {
          id: '20000000-0000-0000-0000-000000000002',
          owner: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          name: 'B',
        },
      ], {status: 200});
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

// Setup Function-----------------------------------------------------
/**
 *
 */
async function logIn() {
  const user = userEvent.setup();
  const userField = screen.getByLabelText('Username');
  const pswrdField = screen.getByLabelText('Password');
  await user.type(userField, 'johnpork67');
  await user.type(pswrdField, 'BaconBits');
  const button = screen.getByText('Log in');
  await user.click(button);
}
// Home Testing -----------------------------------------------------
test('HOME full logout success', async () => {
  render(
      <MockProvider initialEntries={['/']}>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
      </MockProvider>,
  );
  await logIn();
  const logoutButton = await screen.findByText('Logout');
  await userEvent.click(logoutButton);
  const login = await screen.findByText('Log in');
  expect(login).toBeInTheDocument();
});

test('HOME is protected route', async () => {
  render(
      <MockProvider initialEntries={['/home']}>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
      </MockProvider>,
  );
  const login = await screen.findByText('Log in');
  expect(login).toBeInTheDocument();
});


test('HOME bypass login with token', async () => {
  const {unmount} = render(
      <MockProvider initialEntries={['/']}>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
      </MockProvider>,
  );
  await logIn();
  unmount(); // Refresh
  render(
      <MockProvider initialEntries={['/']}>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
      </MockProvider>,
  );
  expect(screen.findByText('Logout'));
});

// HOME subcomponent tests ------------------------------------------
test('NAVBAR changes state', async () => {
  // Not wrapped in order to bypass login
  render(
      <MockProvider initialEntries={['/home']}>
        <Route path='/home' element={<Home/>}/>
      </MockProvider>,
  );
  const groupIcon = await screen.findByLabelText('groups');
  userEvent.click(groupIcon);
  const groupList = await screen.findByLabelText('Group List');
  expect(groupList).not.toBeNull;
});


test('POSTLIST show images', async () => {
  render(
      <MockProvider initialEntries={['/home']}>
        <Route path='/home' element={<PostList/>}/>
      </MockProvider>,
  );
  const images = await screen.findAllByRole('img');
  expect(images.length).toBeGreaterThan(1);
});

test('POSTLIST returns to login when timed out', async () => {
  // Simulate timeout
  server.use(
      http.get('http://localhost:3010/api/v0/post', async () => {
        return new HttpResponse(null, {status: 401});
      }),
  );
  render(
      <AuthenticatedMockProvider initialEntries={['/home']}>
        <Route path='/home' element={<PostList/>}/>
        <Route path='/' element={<Login/>}/>
      </AuthenticatedMockProvider>,
  );
  await waitFor(() => {
    expect(screen.getByText('Log in')).toBeInTheDocument();
  }, {timeout: 3000});
});
