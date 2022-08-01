import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Interactions with blogs', () => {
  const blog = {
    user: 'x',
    likes: 5,
    author: 'The creator',
    title: 'Testing this component',
    url: 'https://www.test.com',
  };

  test('Displays blog title and author by default, but not url or likes', () => {
    render(<Blog blog={blog} />);
    const title = screen.getByText('Testing this component', { exact: false });
    const author = screen.getByText('The creator', { exact: false });
    const url = screen.getByText('https://www.test.com', { exact: false });
    const likes = screen.getByText('likes', { exact: false });

    expect(title).toBeDefined();
    expect(author).toBeDefined();
    expect(url).toBeDefined();
    expect(likes).toBeDefined();
    expect(title).toBeVisible();
    expect(author).toBeVisible();
    expect(url).not.toBeVisible();
    expect(likes).not.toBeVisible();
  });

  test('Blog url and likes are shown when clicking the "view" button', async () => {
    render(<Blog blog={blog} />);
    const urlStart = screen.getByText('https://www.test.com', { exact: false });
    const likesStart = screen.getByText('likes', { exact: false });

    expect(urlStart).toBeDefined();
    expect(likesStart).toBeDefined();
    expect(urlStart).not.toBeVisible();
    expect(likesStart).not.toBeVisible();

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const urlEnd = screen.getByText('https://www.test.com', { exact: false });
    const likesEnd = screen.getByText('likes', { exact: false });

    expect(urlEnd).toBeDefined();
    expect(likesEnd).toBeDefined();
    expect(urlEnd).toBeVisible();
    expect(likesEnd).toBeVisible();
  });

  test('If the like button is clicked twice, the event handled is called twice', async () => {
    const mockHandler = jest.fn();

    render(<Blog blog={blog} handleLikes={mockHandler} />);

    const user = userEvent.setup();
    const button = screen.getByText('like');
    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
