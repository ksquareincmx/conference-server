import React from 'react';

import BigCalendar from 'react-big-calendar';
import './Years.css';

const monthRow = props => {
  const dateToday = new Date();
  return idMonth => (
    <div className="column">
      <BigCalendar
        selectable
        events={props.events[0]}
        views={['month']}
        step={15}
        defaultView={BigCalendar.Views.MONTH}
        min={props.minDate} // 9 a.m.
        max={props.maxDate} // 6 p.m.
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date(dateToday.getFullYear(), idMonth)}
        localizer={props.localizer}
        onSelectEvent={event => alert(event.title)}
        onSelectSlot={props.handleSelect(0)}
        timeslots={4}
      />
    </div>
  );
};

const YearsView = props => {
  return (
    <div className="years-container">
      <div className="row">{[0, 1, 2, 3].map(monthRow(props))}</div>
      <div className="row">{[4, 5, 6, 7].map(monthRow(props))}</div>
      <div className="row">{[8, 9, 10, 11].map(monthRow(props))}</div>
    </div>
  );
};

export default YearsView;
