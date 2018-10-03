import React from 'react'
import { AuthProvider, AuthConsumer } from '../providers/Auth'
import LoginPage from '../pages/Login'

function Login(props) {

  return (
    <div>
      <AuthConsumer>{auth => <LoginPage auth={auth} />}</AuthConsumer>
    </div>
  );
}

export default Login;