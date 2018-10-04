import React from 'react';
import events from './events';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import dates from 'react-big-calendar/lib/utils/dates';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import MyDays from './DaysView';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment);

class CalendarPage extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = { events };
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      });
  };

  render() {
    return (
      <div className="calendar-container">
        <BigCalendar
          selectable
          events={this.state.events}
          views={{
            day: MyDays,
            work_week: true,
            month: true,
            agenda: true,
          }}
          step={15}
          //defaultView={BigCalendar.Views.WORK_WEEK}
          defaultView={BigCalendar.Views.DAY}
          min={dates.add(dates.startOf(new Date(), 'day'), -15, 'hours')} // 9 a.m.
          max={dates.add(dates.endOf(new Date(), 'day'), -6, 'hours')} // 6 p.m.
          scrollToTime={new Date(1970, 1, 1, 6)}
          localizer={localizer}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
          timeslots={4}
        />
      </div>
    );
  }
}

export default CalendarPage;
