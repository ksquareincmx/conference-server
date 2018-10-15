import React from 'react';

import BigCalendar from 'react-big-calendar';
import './Months.css';

const MonthsView = props => {
  return (
    <div className="months-container">
      <BigCalendar
        // selectable
        // onSelectEvent={event => alert(event.title)}
        // onSelectSlot={props.handleSelect(0)}
        // timeslots={4}
        // step={15}
        events={[...props.events[0], ...props.events[1]]}
        views={['month']}
        defaultView={BigCalendar.Views.MONTH}
        min={props.minDate}
        max={props.maxDate}
        scrollToTime={new Date(1970, 1, 1, 6)}
        localizer={props.localizer}
      />
    </div>
  );
};

export default MonthsView;
