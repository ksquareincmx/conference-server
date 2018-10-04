import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import AppointmentCard from './pages/AppointmentCard/';
import { AuthProvider, AuthConsumer } from './providers/Auth';
import LoginView from './Views/Login';

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={LoginView} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/appointment" component={AppointmentCard} />
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
  </div>
);

const Calendar = () => (
  <div>
    <h2>Calendar</h2>
    <CalendarPage />
  </div>
);

export default Routes;
