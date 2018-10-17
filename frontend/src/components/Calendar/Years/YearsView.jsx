import React from 'react';

import BigCalendar from 'react-big-calendar';
import './Years.css';

const monthRow = props => idMonth => (
  <div className="column">
    <BigCalendar
      events={[...props.events[0], ...props.events[1]]}
      views={[props.type]}
      defaultView={BigCalendar.Views.MONTH}
      min={props.minDate}
      max={props.maxDate}
      scrollToTime={new Date(1970, 1, 1, 6)}
      localizer={props.localizer}
      defaultDate={new Date(props.date.getFullYear(), idMonth)}
      localizer={props.localizer}
      components={props.components}
    />
  </div>
);

const YearsView = props => {
  props = { ...props, type: 'month' };
  return (
    <div className="years-container">
      <div className="row">{[0, 1, 2, 3].map(monthRow(props))}</div>
      <div className="row">{[4, 5, 6, 7].map(monthRow(props))}</div>
      <div className="row">{[8, 9, 10, 11].map(monthRow(props))}</div>
    </div>
  );
};

export default YearsView;
