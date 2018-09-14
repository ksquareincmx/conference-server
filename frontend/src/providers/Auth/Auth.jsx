import React from "react";

const AuthContext = React.createContext({
  user: null,
  jwt: null,
  onLogin: () => {},
  onLogout: () => {}
});

export const AuthConsumer = AuthContext.Consumer;

export class AuthProvider extends React.Component {
  state = {
    user: null,
    jwt: null
  };

  onLogin = googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;

    fetch("http://localhost:8888/api/v1/auth/googlelogin", {
      method: "POST",
      body: JSON.stringify({
        idToken
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({
          jwt: { token: res.token, expires: res.expires, refreshToken: res.refresh_token },
          user: res.user // { id: number, email: string, name: string, role: string, picture: string }
        });
      })
      .catch(err => console.error(err));
  };

  onLogout = () => {
    this.setState({
      user: null,
      jwt: null
    });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{ ...this.state, onLogin: this.onLogin, onLogout: this.onLogout }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
