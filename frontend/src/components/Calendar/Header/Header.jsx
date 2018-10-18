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

const weekOfYear = date => {
  let d = new Date(+date);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};

const headerDateContainer = (date, typeView) => {
  switch (typeView) {
    case 'day':
      return (
        <div className="header-date-container">
          <p>{daysNames[date.getDay()]}</p>
          <p>{`${monthsNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`}</p>
        </div>
      );
    case 'work_week':
      return (
        <div className="header-date-container">
          <p>Week #{weekOfYear(date)}</p>
          <p>{`${monthsNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`}</p>
        </div>
      );
    case 'month':
      return (
        <div className="header-date-container">
          <p>{monthsNames[date.getMonth()]}</p>
          <p>{date.getFullYear()}</p>
        </div>
      );
    case 'year':
      return (
        <div className="header-date-container">
          <p>{date.getFullYear()}</p>
        </div>
      );
    default:
      return {};
  }
};

const HeaderView = props => {
  return (
    <div className="header-container">
      {headerDateContainer(props.date, props.type)}
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
