import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import './Login.css';
import LoginCard from './LoginCard';
import { AuthConsumer } from '../../providers/Auth';

class LoginPageLogic extends Component {
  onFailure = res => {
    console.log('Error:', res);
  };

  render() {
    return (
      <LoginCard>
        <GoogleLogin
          clientId="129092023456-82964pfqurangtddv4q9g4q62cbq6abm.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          className="login-button"
          onSuccess={this.props.auth.onLogin}
          onFailure={this.onFailure}
        />
      </LoginCard>
    );
  }
}

function LoginPage(props) {

  return <AuthConsumer>{auth => auth.jwt == null ? (<LoginPageLogic auth={auth} />) :
    (props.history.replace('./dashboard'))}</AuthConsumer>
}

export default LoginPage;
