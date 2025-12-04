import {test, beforeAll, beforeEach, afterEach, afterAll, expect} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {useState} from 'react';
import userEvent from '@testing-library/user-event';
import PropTypes from 'prop-types';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {Routes, Route, MemoryRouter} from 'react-router-dom';

import {userContext} from '../App';
import GroupPage from '../view/GroupPage';
import Login from '../view/Login';
import {groupContext, GroupList, Feed} from '../view/GroupPage';

// Mock Providers -----------------------------------------------------
const HomeMockProvider = ({children, initialEntries = ['/']}) => {
  const [user, setUser] = useState('atotallyrealjwt');
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

HomeMockProvider.propTypes = {
  children: PropTypes.node,
  initialEntries: PropTypes.array,
};

const GroupMockProvider = ({children, initialEntries = ['/']}) => {
  const initialgroup = '10000000-0000-0000-0000-000000000001';
  const [user, setUser] = useState('atotallyrealjwt');
  const [selectedGroup, setSelectedGroup] = useState(initialgroup);
  return (
    <userContext.Provider value={{user, setUser}}>
      <groupContext.Provider value={{selectedGroup, setSelectedGroup}}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            {children}
          </Routes>
        </MemoryRouter>
      </groupContext.Provider>
    </userContext.Provider>
  );
};

GroupMockProvider.propTypes = {
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
            created: '2025-11-28T15:30:00.000Z',
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
            created: '2025-11-30T21:42:30.526Z',
            text: 'grah',
          },
          {
            img: 'https://www.rap-up.com/article/media_1fbb4297d00311931c2f90bc5fe65e80883ea13db.png?width=800&format=png&optimize=high',
            created: '2025-11-27T21:42:30.000Z',
            text: 'hey freakbob here',
          },
          {
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSurlBct6TRfGQDnkt3SHufWvVfdN6MEmOc2A',
            created: '2025-01-08T21:42:30.000Z',
            text: 'wait im healing',
          },
        ], {status: 200});
      }
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
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('accessToken', 'atotallyrealjwt');
},
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// GroupPage Tests ----------------------------------------------
test('GROUPPAGE Renders', async () => {
  render(
      <HomeMockProvider initialEntries={['/home']}>
        <Route path='/home' element={<GroupPage/>}/>
      </HomeMockProvider>,
  );
});

// Group List ---------------------------------------------------
test('GROUPLIST Renders', async () => {
  render(
      <GroupMockProvider initialEntries={['/home']}>
        <Route path='/home' element={<GroupList/>}/>
      </GroupMockProvider>,
  );
});

test('GROUPLIST returns to login when timed out', async () => {
  // Simulate timeout
  server.use(
      http.get('http://localhost:3010/api/v0/group', async () => {
        return new HttpResponse(null, {status: 401});
      }),
  );
  render(
      <GroupMockProvider initialEntries={['/home']}>
        <Route path='/home' element={<GroupList/>}/>
        <Route path='/' element={<Login/>}/>
      </GroupMockProvider>,
  );
  const login = await screen.findByText('Log in');
  expect(login).not.toBeNull;
});

test('GROUPLIST contains group B', async () => {
  render(
      <GroupMockProvider initialEntries={['/home']}>
        <Route path='/home' element={<GroupList/>}/>
      </GroupMockProvider>,
  );
  const groupButton = await screen.findByText('B');
  expect(groupButton).not.toBeNull;
});

// Feed Tests----------------------------------------------------
test('GROUPFEED Renders', async () => {
  render(
      <GroupMockProvider initialEntries={['/home']}>
        <Route path='/home' element={<Feed/>}/>
      </GroupMockProvider>,
  );
});

test('GROUPLIST afects GROUPFEED', async () => {
  render(
      <GroupMockProvider initialEntries={['/home']}>
        <Route path='/home' element={
          <>
            <GroupList/>
            <Feed/>
          </>
        }/>
      </GroupMockProvider>,
  );
  const groupButton = await screen.findByText('B');
  userEvent.click(groupButton);
  const groupList = await screen.findByText('Post in group B');
  expect(groupList).not.toBeNull;
});

test('GROUPFEED returns to login when timed out', async () => {
  // Simulate timeout
  server.use(
      http.get('http://localhost:3010/api/v0/post', async () => {
        return new HttpResponse(null, {status: 401});
      }),
  );
  render(
      <GroupMockProvider initialEntries={['/home']}>
        <Route path='/home' element={<Feed/>}/>
        <Route path='/' element={<Login/>}/>
      </GroupMockProvider>,
  );
  await waitFor(() => {
    const login = screen.getByText('Log in');
    expect(login).toBeInTheDocument();
  }, {timeout: 3000});
});
