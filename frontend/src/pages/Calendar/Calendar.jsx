import React from 'react';
import events from './events';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import DaysView from './Days';
import HeaderView from './Header';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

class CalendarPage extends React.Component {
  localizer = BigCalendar.momentLocalizer(moment);
  constructor(...args) {
    super(...args);
    this.state = { events: [[...events], [...events]] };
  }

  handleSelect = conferenceRoomName => ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      this.setState(prevState => {
        prevState.events[conferenceRoomName].push({
          start,
          end,
          title,
        });
        return { events: prevState.events };
      });
    }
  };

  handlerOnClickViewButton = buttonIdentifier => {};

  render() {
    return (
      <div className="calendar-container">
        <HeaderView onClickViewButton={this.handlerOnClickViewButton} />
        <DaysView events={this.state.events} handleSelect={this.handleSelect} localizer={this.localizer} />
      </div>
    );
  }
}

export default CalendarPage;
