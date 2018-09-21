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

  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.getItem("cb_jwt") && localStorage.getItem("cb_user")) {
        const user = localStorage.getItem("cb_user");
        const jwt = localStorage.getItem("cb_jwt");
        this.setState({ user, jwt });
      }
    }
  }

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
          jwt: {
            token: res.token,
            expires: res.expires,
            refreshToken: res.refresh_token
          },
          user: res.user // { id: number, email: string, name: string, role: string, picture: string }
        });
        this.refreshLocalStorage();
      })
      .catch(err => console.error(err));
  };

  onLogout = () => {
    this.setState({
      user: null,
      jwt: null
    });
    this.refreshLocalStorage();
  };

  refreshLocalStorage() {
    const { user, jwt } = this.state;
    localStorage.setItem(("cb_user": user));
    localStorage.setItem(("cb_jwt": jwt));
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          ...this.state,
          onLogin: this.onLogin,
          onLogout: this.onLogout
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
