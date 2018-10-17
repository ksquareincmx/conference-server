import React from 'react';
import './Header.css';

const daysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthsNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const HeaderView = props => {
  return (
    <div className="header-container">
      <div className="header-date-container">
        <p>{daysNames[props.date.getDay()]}</p>
        <p>{`${monthsNames[props.date.getMonth()]} ${props.date.getDate()} ${props.date.getFullYear()}`}</p>
      </div>
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
