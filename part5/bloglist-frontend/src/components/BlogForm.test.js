import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('Form calls the event handler received as props with the right details when a new blog is created', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const inputs = screen.getAllByRole('textbox');
  const createButton = screen.getByText('create');

  await user.type(inputs[0], 'blog-title');
  await user.type(inputs[1], 'blog-author');
  await user.type(inputs[2], 'blog-url');
  await user.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'blog-title',
    author: 'blog-author',
    url: 'blog-url',
  });
});
