import React, { Component } from 'react';

class DashboardPageLogic extends Component {
  render() {
    return (
      <div className="dashboard-page">
        <h2>Dashboard</h2>
      </div>
    );
  }
}

function DashboardPage() {
  return <DashboardPageLogic />;
}

export default DashboardPage;
