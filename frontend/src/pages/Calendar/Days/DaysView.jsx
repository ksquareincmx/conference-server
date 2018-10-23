import React from 'react';

import BigCalendar from 'react-big-calendar';
import dates from 'react-big-calendar/lib/utils/dates';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Days.css';

const DaysView = props => {
  return (
    <div className="days-container">
      <div className="day-agenda">
        <div className="day-header">
          <h2 className="conference-room-name">Conference Room #1</h2>
        </div>
        <BigCalendar
          selectable
          events={props.events[0]}
          views={['day']}
          step={15}
          defaultView={BigCalendar.Views.DAY}
          min={dates.add(dates.startOf(new Date(), 'day'), -15, 'hours')} // 9 a.m.
          max={dates.add(dates.endOf(new Date(), 'day'), -6, 'hours')} // 6 p.m.
          scrollToTime={new Date(1970, 1, 1, 6)}
          localizer={props.localizer}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={props.handleSelect(0)}
          timeslots={4}
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
          step={15}
          defaultView={BigCalendar.Views.DAY}
          min={dates.add(dates.startOf(new Date(), 'day'), -15, 'hours')} // 9 a.m.
          max={dates.add(dates.endOf(new Date(), 'day'), -6, 'hours')} // 6 p.m.
          scrollToTime={new Date(1970, 1, 1, 6)}
          localizer={props.localizer}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={props.handleSelect(1)}
          timeslots={4}
        />
      </div>
    </div>
  );
};

export default DaysView;
