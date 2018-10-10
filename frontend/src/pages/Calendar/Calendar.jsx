import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import DaysView from '../../components/Calendar/Days';
import WeeksView from '../../components/Calendar/Weeks';
import MonthsView from '../../components/Calendar/Months';
import HeaderView from '../../components/Calendar/Header';
import FooterView from '../../components/Calendar/Footer';
import dates from 'react-big-calendar/lib/utils/dates';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = BigCalendar.momentLocalizer(moment);
const minDate = dates.add(dates.startOf(new Date(), 'day'), -16, 'hours');
const maxDate = dates.add(dates.endOf(new Date(), 'day'), -5, 'hours');
const step = 30;
const timeSlots = 2;

const CalendarStrategy = props => {
  switch (props.type) {
    case 'DAYS':
      return <DaysView {...props} />;
    case 'WEEKS':
      return <WeeksView {...props} />;
    case 'MONTHS':
      return <MonthsView {...props} />;
    default:
      return <DaysView {...props} />;
  }
};

class CalendarPage extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      events: [[], []],
    };
  }

  handleSelect = conferenceRoomName => ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      if (end < new Date()) {
        alert('La fecha de finalización no puede ser previa a la fecha actual');
      } else {
        this.setState(prevState => {
          prevState.events[conferenceRoomName].push({
            start,
            end,
            title,
          });
          return { events: prevState.events };
        });
      }
    }
  };

  handlerOnClickViewButton = buttonIdentifier => () => {
    this.setState({ selector: buttonIdentifier });
  };

  render() {
    return (
      <div className="calendar-container">
        <HeaderView onClickViewButton={this.handlerOnClickViewButton} />
        <CalendarStrategy
          type={this.state.selector}
          events={this.state.events}
          handleSelect={this.handleSelect}
          localizer={localizer}
          minDate={minDate}
          maxDate={maxDate}
          step={step}
          timeSlots={timeSlots}
        />
        <FooterView />
      </div>
    );
  }
}

export default CalendarPage;
