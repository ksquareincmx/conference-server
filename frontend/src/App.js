import React, { Component } from "react";
import "./App.css";
import LoginPage from "./pages/Login";
import Routes from "../../routes/routes";
import { AuthProvider, AuthConsumer } from "./providers/Auth";

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Routes>
          <AuthConsumer>{auth => <LoginPage auth={auth} />}</AuthConsumer>
        </Routes>
      </AuthProvider>
    );
  }
}

export default App;
