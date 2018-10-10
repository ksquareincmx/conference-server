import React from 'react';

import BigCalendar from 'react-big-calendar';

import './Days.css';

const DaysView = props => {
  const EventAgenda = idConference => ({ event }) => {
    return (
      <span style={{ textAlign: 'center' }}>
        <em>
          {event.title} in conference Room # {idConference + 1}
        </em>
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
            event: EventAgenda(0),
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
        />
      </div>
    </div>
  );
};

export default DaysView;
