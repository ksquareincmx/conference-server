import React, { Component } from "react";
import "./App.css";
import LoginPage from "./pages/Login";
import Routes from "./Routes";
import { AuthProvider, AuthConsumer } from "./providers/Auth";

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Routes />
      </AuthProvider>
    );
  }
}

export default App;

