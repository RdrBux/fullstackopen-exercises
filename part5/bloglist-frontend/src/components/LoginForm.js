import React from 'react';

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button>login</button>
    </form>
  );
};

export default LoginForm;
