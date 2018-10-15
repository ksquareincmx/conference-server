import React from 'react';

import BigCalendar from 'react-big-calendar';
import './Months.css';

const MonthsView = props => {
  return (
    <div className="months-container">
      <BigCalendar
        selectable
        events={props.events[0]}
        views={['month']}
        step={15}
        defaultView={BigCalendar.Views.MONTH}
        min={props.minDate} // 9 a.m.
        max={props.maxDate} // 6 p.m.
        scrollToTime={new Date(1970, 1, 1, 6)}
        localizer={props.localizer}
        onSelectEvent={event => alert(event.title)}
        onSelectSlot={props.handleSelect(0)}
        timeslots={4}
      />
    </div>
  );
};

export default MonthsView;
