import React from 'react';

const TitleView = date => {
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

  return (
    <div>
      <h2>{daysNames[new Date().getDay()]}</h2>
      <h3>{`${monthsNames[date.getMonth()]} ${date.getDate()} ${date.getYear() + 1900}`}</h3>
    </div>
  );
};

export default TitleView;
