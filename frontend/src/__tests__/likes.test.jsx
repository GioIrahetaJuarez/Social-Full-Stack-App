import {test, beforeAll, beforeEach, afterEach, afterAll, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import Post from '../view/Post';

beforeAll(() => server.listen());
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('accessToken', 'atotallyrealjwt');
},
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock API ----------------------------------------------------------
const server = setupServer(
    http.get('http://localhost:3010/api/v0/post/:postId', async () => {
      return HttpResponse.json({likes: []});
    }),
    http.post('http://localhost:3010/api/v0/post/:postId/like', async () => {
      return HttpResponse.json(['oneLikeEntry']);
    }),
);

const postData = {
  id: 'a1000000-0000-0000-0000-00000000000a',
  img: '',
  created: '2025-11-28T15:30:00.000Z',
  text: 'Welp',
};
// Like Implementation Test ---------------------------------------------------
test('Post renders intial likes', async () => {
  render(
      <Post data={postData}/>,
  );
  const likeCount = await screen.findByLabelText('likecount');
  expect(likeCount).toBeInTheDocument();
  expect(likeCount).toHaveTextContent('0');
});

test('Post renders updated likes', async () => {
  render(
      <Post data={[postData]}/>,
  );
  const likeButton = await screen.findByLabelText('Like');
  await userEvent.click(likeButton);
  const likeCount = await screen.findByLabelText('likecount');
  expect(likeCount).toHaveTextContent('1');
});
