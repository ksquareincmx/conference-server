import React from 'react';
import './Header.css';

const HeaderView = props => {
  return (
    <div className="header-container">
      {props.headerDateContainer}
      <div className="header-view-selector">
        <br />
        <div className="veiew-buttons-container">
          <button onClick={props.onClickViewButton('day')}>Day</button>
          <button onClick={props.onClickViewButton('work_week')}>Week</button>
          <button onClick={props.onClickViewButton('month')}>Month</button>
          <button onClick={props.onClickViewButton('year')}>Year</button>
        </div>
      </div>
      <div className="header-create-meeting">
        <button className="create-meating-button">CREATE MEETING</button>
      </div>
    </div>
  );
};

export default HeaderView;
