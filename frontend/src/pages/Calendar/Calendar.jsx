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

const dateToday = new Date();

// Constants for HeaderStrategy
const daysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthsNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const dayNameToday = daysNames[dateToday.getDay()];
const monthNameToday = monthsNames[dateToday.getMonth()];

// Constants for CalendarStrategy
const localizer = BigCalendar.momentLocalizer(moment);
const minDate = dates.add(dates.startOf(new Date(), 'day'), -16, 'hours');
const maxDate = dates.add(dates.endOf(new Date(), 'day'), -5, 'hours');
const step = 15;
const timeSlots = 4;

const HeaderStrategy = props => {
  switch (props.type) {
    case 'day':
      return (
        <div className="header-date-container">
          <p>{props.dayName}</p>
          <p>{`${props.monthName} ${props.numberDayInMonth} ${props.fullYear}`}</p>
        </div>
      );
    case 'work_week':
      return (
        <div className="header-date-container">
          <p>Week #{props.numberWeekInYear}</p>
          <p>{`${props.monthName} ${props.numberDayInMonth} ${props.fullYear}`}</p>
        </div>
      );
    case 'month':
      return (
        <div className="header-date-container">
          <p>{props.monthName}</p>
          <p>{props.fullYear}</p>
        </div>
      );
    case 'year':
      return (
        <div className="header-date-container">
          <br />
          <p>{props.fullYear}</p>
        </div>
      );
    default:
      return {};
  }
};

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

  getWeekOfYear = date => {
    let d = new Date(+date);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
  };

  FooterChangeButtonLabels = type => {
    switch (type) {
      case 'day':
        return {
          previousButtonLabel: 'Previus day',
          nextButtonLabel: 'Next day',
        };

      case 'work_week':
        return {
          previousButtonLabel: 'Previus week',
          nextButtonLabel: 'Next week',
        };
      case 'month':
        return {
          previousButtonLabel: 'Previus month',
          nextButtonLabel: 'Next month',
        };
      case 'year':
        return {
          previousButtonLabel: 'Previus year',
          nextButtonLabel: 'Next year',
        };
      default:
        return {
          previousButtonLabel: '',
          nextButtonLabel: '',
        };
    }
  };

  render() {
    return (
      <div className="calendar-container">
        <HeaderView
          onClickViewButton={this.handlerOnClickViewButton}
          headerDateContainer={
            <HeaderStrategy
              type={this.state.selector}
              dayName={dayNameToday}
              monthName={monthNameToday}
              numberDayInMonth={dateToday.getDate()}
              numberWeekInYear={this.getWeekOfYear(dateToday)}
              fullYear={dateToday.getFullYear()}
              date={dateToday}
            />
          }
        />
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
        <FooterView
          {...this.FooterChangeButtonLabels(this.state.selector)}
          onClickButton={this.handlerOnCLickTimeButton}
          date={dateToday}
          type={this.state.selector}
        />
      </div>
    );
  }
}

export default CalendarPage;
