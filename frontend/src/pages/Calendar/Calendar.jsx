import React from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import DaysView from "../../components/Calendar/Days";
import WeeksView from "components/Calendar/Weeks";
import MonthsView from "components/Calendar/Months";
import YearsView from "components/Calendar/Years";
import HeaderView from "components/Calendar/Header";
import FooterView from "components/Calendar/Footer";
import dates from "react-big-calendar/lib/utils/dates";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import NavBar from "components/NavBar/NavBar";
import DraggingCalendar from "components/Modals/DraggingCalendar";
import { BookingConsumer, BookingProvider } from "providers/Booking";
import { AuthConsumer } from "providers/Auth";
import { Redirect } from "react-router-dom";
import { addZeros, postDto } from "./Utils.js";
// Constants for HeaderStrategy
const daysNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const monthsNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// Constants for CalendarStrategy
const localizer = BigCalendar.momentLocalizer(moment);
const minDate = dates.add(dates.startOf(new Date(), "day"), -16, "hours");
const maxDate = dates.add(dates.endOf(new Date(), "day"), -5, "hours");
const step = 15;
const timeSlots = 4;

const HeaderStrategy = props => {
  switch (props.type) {
    case "day":
      return (
        <div className="header-date-container">
          <p className="top-date">{props.dayName}</p>
          <p className="bottom-date">{`${props.monthName} ${
            props.numberDayInMonth
          } ${props.fullYear}`}</p>
        </div>
      );
    case "work_week":
      return (
        <div className="header-date-container">
          <p className="top-date">Week #{props.numberWeekInYear}</p>
          <p className="bottom-date">{`${props.monthName} ${
            props.numberDayInMonth
          } ${props.fullYear}`}</p>
        </div>
      );
    case "month":
      return (
        <div className="header-date-container">
          <p className="top-date">{props.monthName}</p>
          <p className="bottom-date">{props.fullYear}</p>
        </div>
      );
    case "year":
      return (
        <div className="header-date-container">
          <p className="top-date">{props.fullYear}</p>
        </div>
      );
    default:
      return {};
  }
};

const CalendarStrategy = props => {
  switch (props.type) {
    case "day":
      return <DaysView {...props} />;
    case "work_week":
      return <WeeksView {...props} />;
    case "month":
      return <MonthsView {...props} />;
    case "year":
      return <YearsView {...props} />;
    default:
      return <DaysView {...props} />;
  }
};
const getNameDay = date => daysNames[date.getDay()];
const getNameMonth = date => monthsNames[date.getMonth()];
const getWeekOfYear = date => {
  let d = new Date(+date);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};

class CalendarPageLogic extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      events: [[], []],
      selector: "day",
      focusDate: new Date(),
      appointmentInfo: {
        start: {
          hours: "0",
          minutes: "0"
        },
        end: {
          hours: "0",
          minutes: "0"
        },
        roomId: 0,
        date: {
          day: 0,
          month: 0,
          year: 0
        },
        reasonAppointment: ""
      },
      redirectDashboard: false
    };
  }

  handleClickCreateBookingDraggingCalendar = async () => {
    const post = postDto(this.state.appointmentInfo);
    const res = await this.props.bookingService.createNewBooking(post);
    this.setState({ redirectDashboard: true });
  };

  handleChangeReasonAppointment = event => {
    const keyPressed = event.target.value;
    this.setState(prevState => {
      prevState.appointmentInfo.reasonAppointment = keyPressed;
      return prevState;
    });
  };
  handleEventView = ({ event }) => {
    let color = "blue";
    if (event.roomId) {
      color = "red";
    }

    return (
      <span style={{ color }}>
        <strong>{event.title}</strong>
        {event.desc && ":  " + event.desc}
      </span>
    );
  };

  handleSelect = conferenceRoomName => event => {
    const start = event.start;
    const end = event.end;
    //  const title = window.prompt("New Event name");
    const appointmentInfo = {
      start: {
        hours: start.getHours(),
        minutes: start.getMinutes()
      },
      end: {
        hours: end.getHours(),
        minutes: end.getMinutes()
      },
      date: {
        day: start.getDate(),
        month: start.getMonth() + 1,
        year: start.getFullYear()
      },
      roomId: conferenceRoomName + 1,
      reasonAppointment: ""
    };
    const title = 1;

    if (title) {
      if (end < new Date()) {
        return alert(
          "La fecha de finalización no puede ser previa a la fecha actual"
        );
      }

      this.setState(prevState => {
        prevState.events[conferenceRoomName].push({
          start,
          end,
          title,
          roomId: conferenceRoomName
        });
        return {
          events: prevState.events,
          coordinates: event.bounds,
          appointmentInfo: appointmentInfo
        };
      });
    }
  };

  handlerOnClickViewButton = buttonIdentifier => () => {
    this.setState({ selector: buttonIdentifier });
  };

  handlerOnCLickTimeButton = buttonId => () => {
    let selector;
    this.state.selector === "work_week"
      ? (selector = "week")
      : (selector = this.state.selector);
    switch (buttonId) {
      case "previous":
        this.setState(prevState => ({
          focusDate: dates.add(prevState.focusDate, -1, selector)
        }));
        break;
      case "next":
        return this.setState(prevState => ({
          focusDate: dates.add(prevState.focusDate, 1, selector)
        }));
      case "today":
        return this.setState({ focusDate: new Date() });
      default:
        return {};
    }
  };

  FooterChangeButtonLabels = type => {
    switch (type) {
      case "day":
        return {
          previousButtonLabel: "Previus day",
          nextButtonLabel: "Next day"
        };
      case "work_week":
        return {
          previousButtonLabel: "Previus week",
          nextButtonLabel: "Next week"
        };
      case "month":
        return {
          previousButtonLabel: "Previus month",
          nextButtonLabel: "Next month"
        };
      case "year":
        return {
          previousButtonLabel: "Previus year",
          nextButtonLabel: "Next year"
        };
      default:
        return {
          previousButtonLabel: "",
          nextButtonLabel: ""
        };
    }
  };

  renderRedirectDashboard = () => {
    if (this.state.redirectDashboard) {
      return <Redirect to="/dashboard" />;
    }
  };

  render() {
    return (
      <div className="calendar-container">
        {this.renderRedirectDashboard()}
        <NavBar />
        <HeaderView
          onClickViewButton={this.handlerOnClickViewButton}
          headerDateContainer={
            <HeaderStrategy
              type={this.state.selector}
              numberDayInMonth={this.state.focusDate.getDate()}
              fullYear={this.state.focusDate.getFullYear()}
              date={this.state.focusDate}
              dayName={getNameDay(this.state.focusDate)}
              monthName={getNameMonth(this.state.focusDate)}
              numberWeekInYear={getWeekOfYear(this.state.focusDate)}
            />
          }
        />
        <CalendarStrategy
          type={this.state.selector}
          events={this.state.events}
          handleSelect={this.handleSelect}
          components={{ event: this.handleEventView }}
          localizer={localizer}
          minDate={minDate}
          maxDate={maxDate}
          step={step}
          timeSlots={timeSlots}
          date={this.state.focusDate}
        />

        <DraggingCalendar
          coordinates={this.state.coordinates}
          appointmentInfo={this.state.appointmentInfo}
          onChange={this.handleChangeReasonAppointment}
          onClick={this.handleClickCreateBookingDraggingCalendar}
        />

        <FooterView
          {...this.FooterChangeButtonLabels(this.state.selector)}
          currentDateLabel={"Today"}
          onClickButton={this.handlerOnCLickTimeButton}
        />
      </div>
    );
  }
}

function VerifyAuth(auth) {
  if (auth.jwt !== null) {
    return (
      <BookingProvider auth={auth}>
        <BookingConsumer>
          {bookingService => (
            <CalendarPageLogic bookingService={bookingService} />
          )}
        </BookingConsumer>
      </BookingProvider>
    );
  }
}

function CalendarPage() {
  return <AuthConsumer>{auth => VerifyAuth(auth)}</AuthConsumer>;
}
export default CalendarPage;
