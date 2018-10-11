import React from 'react';
import dateFormat from 'dateformat';

import BigCalendar from 'react-big-calendar';

import './Days.css';

const DaysView = props => {
  const EventAgenda = ({ event }) => {
    const start = dateFormat(new Date(event.start), 'hh:MM TT');
    const end = dateFormat(new Date(event.end), 'hh:MM TT');
    return (
      <span className="event-resume">
        {event.title} in conference Room #{event.roomId + 1} ( {start} to {end} )
      </span>
    );
  };
  return (
    <div className="days-container">
      <div className="day-agenda" style={{ width: '56.06125%' }}>
        <div className="day-header">
          <div className="day-header-separator" />
          <h2 className="conference-room-name">Conference Room #1</h2>
        </div>
        <BigCalendar
          selectable
          events={props.events[0]}
          views={['day']}
          step={props.step}
          defaultView={BigCalendar.Views.DAY}
          min={props.minDate} // 9 a.m.
          max={props.maxDate} // 6 p.m.
          formats={{ timeGutterFormat: 'hh:mm A', dayFormat: 'ddd D' }}
          localizer={props.localizer}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={props.handleSelect(0)}
          timeslots={props.timeSlots}
          components={{
            event: EventAgenda,
          }}
        />
      </div>
      <div className="day-agenda">
        <div className="day-header">
          <h2 className="conference-room-name">Conference Room #2</h2>
        </div>
        <BigCalendar
          selectable
          events={props.events[1]}
          views={['day']}
          step={props.step}
          defaultView={BigCalendar.Views.DAY}
          min={props.minDate} // 9 a.m.
          max={props.maxDate} // 6 p.m.
          formats={{ timeGutterFormat: ' ' }}
          localizer={props.localizer}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={props.handleSelect(1)}
          timeslots={props.timeSlots}
          components={{
            event: EventAgenda,
          }}
        />
      </div>
    </div>
  );
};

export default DaysView;
