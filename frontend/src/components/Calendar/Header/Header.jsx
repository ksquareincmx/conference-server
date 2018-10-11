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
        <p>{`${monthsNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`}</p>
      </div>
      <div className="header-view-selector">
        <br />
        <div className="veiew-buttons-container">
          <button onClick={props.onClickViewButton('DAYS')}>Day</button>
          <button onClick={props.onClickViewButton('WEEKS')}>Week</button>
          <button onClick={props.onClickViewButton('MONTHS')}>Month</button>
          <button onClick={props.onClickViewButton('YEARS')}>Year</button>
        </div>
      </div>
      <div className="header-create-meeting">
        <button className="create-meating-button">CREATE MEETING</button>
      </div>
    </div>
  );
};

export default HeaderView;
