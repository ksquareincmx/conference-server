import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LoginPage from "./pages/Login";
import AppointmentCard from './pages/AppointmentCard/'
import { AuthProvider, AuthConsumer } from "./providers/Auth";

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/appointment" component={Appointment} />
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
    <AuthConsumer>{auth => <LoginPage auth={auth} />}</AuthConsumer>
  </div>
);

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
  </div>
);

const Appointment = () => (
  <div>
    <AppointmentCard />
  </div>
);
const Calendar = () => (
  <div>
    <h2>Calendar</h2>
  </div>
);

export default Routes;
