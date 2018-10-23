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
const date = new Date();

const HeaderView = props => {
  return (
    <div className="header-container">
      <div className="header-date-container">
        <p>{daysNames[new Date().getDay()]}</p>
        <p>{`${monthsNames[date.getMonth()]} ${date.getDate()} ${date.getYear() + 1900}`}</p>
      </div>
      <div className="header-view-selector">
        <br />
        <div className="veiew-buttons-container">
          <button onClick={props.onClickViewButton('Day')}>Day</button>
          <button onClick={props.onClickViewButton('Week')}>Week</button>
          <button onClick={props.onClickViewButton('Month')}>Month</button>
          <button onClick={props.onClickViewButton('Year')}>Year</button>
        </div>
      </div>
      <div className="header-create-meeting">
        <button className="create-meating-button">CREATE MEETING</button>
      </div>
    </div>
  );
};

export default HeaderView;
