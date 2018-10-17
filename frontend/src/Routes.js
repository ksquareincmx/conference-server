import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './pages/Login/Login';
import HomePage from './pages/Home';
import CalendarPage from './pages/Calendar';
import DashboardPage from './pages/Dashboard';
import AppointmentList from './Modals/AppointmentList'

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path='/app' component={AppointmentList} />

    </div>
  </Router>
);

export default Routes;
