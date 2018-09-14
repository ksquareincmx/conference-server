import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import "./Login.css";

class LoginPage extends Component {
  onFailure = res => {
    console.log("Error:", res);
  };

  render() {
    return (
      <div className="login-page">
        {this.props.auth.jwt == null ? (
          <GoogleLogin
            clientId="129092023456-82964pfqurangtddv4q9g4q62cbq6abm.apps.googleusercontent.com"
            buttonText="Login With Google"
            className="login-button"
            onSuccess={this.props.auth.onLogin}
            onFailure={this.onFailure}
          />
        ) : (
          <GoogleLogout
            buttonText="Logout"
            className="login-button"
            onLogoutSuccess={this.props.auth.onLogout}
          />
        )}
      </div>
    );
  }
}

export default LoginPage;
