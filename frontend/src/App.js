import React, { Component } from "react";
import "./App.css";
import LoginPage from "./pages/Login";
import { AuthProvider, AuthConsumer } from "./providers/Auth";

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <AuthConsumer>{auth => <LoginPage auth={auth} />}</AuthConsumer>
      </AuthProvider>
    );
  }
}

export default App;
