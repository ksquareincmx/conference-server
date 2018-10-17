import React from 'react';

import BigCalendar from 'react-big-calendar';
import './Weeks.css';

const WeeksView = props => {
  return (
    <div className="weeks-container">
      <BigCalendar
        selectable
        events={[...props.events[0], ...props.events[1]]}
        views={[props.type]}
        step={props.step}
        defaultView={BigCalendar.Views.WORK_WEEK}
        min={props.minDate} // 9 a.m.
        max={props.maxDate} // 6 p.m.
        localizer={props.localizer}
        onSelectEvent={event => alert(event.title)}
        onSelectSlot={props.handleSelect(0)}
        timeslots={props.timeSlots}
        components={props.components}
      />
    </div>
  );
};

export default WeeksView;
