import React from 'react';
import './LoginRegister.css';

const LoginRegister = () => {
  return (
    <div className="login">
      <h1>Login/Register</h1>
      <form>
        <div className="form-group">
          <label className="label">Username:</label>
          <input className="textInput" name="username" />
        </div>
        <div className="form-group">
          <label className="label">Password:</label>
          <input className="passwordInput" name="password" />
        </div>
        <button className="signInButton" type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default LoginRegister;
