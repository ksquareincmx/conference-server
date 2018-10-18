import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import DaysView from '../../components/Calendar/Days';
import WeeksView from '../../components/Calendar/Weeks';
import MonthsView from '../../components/Calendar/Months';
import YearsView from '../../components/Calendar/Years';
import HeaderView from '../../components/Calendar/Header';
import FooterView from '../../components/Calendar/Footer';
import dates from 'react-big-calendar/lib/utils/dates';
import dateFormat from 'dateformat';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = BigCalendar.momentLocalizer(moment);
const minDate = dates.add(dates.startOf(new Date(), 'day'), -16, 'hours');
const maxDate = dates.add(dates.endOf(new Date(), 'day'), -5, 'hours');
const dateToday = new Date();
const step = 15;
const timeSlots = 4;

const CalendarStrategy = props => {
  switch (props.type) {
    case 'day':
      return <DaysView {...props} />;
    case 'work_week':
      return <WeeksView {...props} />;
    case 'month':
      return <MonthsView {...props} />;
    case 'year':
      return <YearsView {...props} />;
    default:
      return <DaysView {...props} />;
  }
};

class CalendarPage extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      events: [[], []],
      selector: 'day',
    };
  }

  handleEventView = ({ event }) => {
    const start = dateFormat(new Date(event.start), 'hh:MM TT');
    const end = dateFormat(new Date(event.end), 'hh:MM TT');

    let color = 'blue';
    if (event.roomId) {
      color = 'red';
    }

    return (
      <span style={{ color }}>
        <strong>{event.title}</strong>
        {event.desc && ':  ' + event.desc}
      </span>
    );
  };

  handleSelect = conferenceRoomName => ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      if (end < new Date()) {
        return alert('La fecha de finalización no puede ser previa a la fecha actual');
      }

      this.setState(prevState => {
        prevState.events[conferenceRoomName].push({
          start,
          end,
          title,
          roomId: conferenceRoomName,
        });
        return { events: prevState.events };
      });
    }
  };

  handlerOnClickViewButton = buttonIdentifier => () => {
    this.setState({ selector: buttonIdentifier });
  };

  handlerOnCLickTimeButton = buttonId => event => {
    console.log(buttonId);
  };

  render() {
    return (
      <div className="calendar-container">
        <HeaderView onClickViewButton={this.handlerOnClickViewButton} date={dateToday} type={this.state.selector} />
        <CalendarStrategy
          type={this.state.selector}
          events={this.state.events}
          handleSelect={this.handleSelect}
          components={{
            event: this.handleEventView,
          }}
          localizer={localizer}
          minDate={minDate}
          maxDate={maxDate}
          step={step}
          timeSlots={timeSlots}
          date={dateToday}
        />
        <FooterView onClickButton={this.handlerOnCLickTimeButton} />
      </div>
    );
  }
}

export default CalendarPage;
