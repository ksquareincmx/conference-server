import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/calendar" component={Calendar} />
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const Login = () => (
  <div>
    <h2>Login</h2>
  </div>
);

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
  </div>
);

const Calendar = () => (
  <div>
    <h3>Calendar</h3>
  </div>
);

export default Routes;
