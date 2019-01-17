import React from "react";
import dates from "react-big-calendar/lib/utils/dates";
import { Redirect, withRouter } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import NavBar from "components/NavBar/NavBar";
import DraggingCalendar from "components/Modals/DraggingCalendar";
import HeaderView from "components/Calendar/Header";
import FooterView from "components/Calendar/Footer";
import * as Utils from "./Utils.js";
import "./Calendar.css";

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
      }
    };
  }

  handleClickCreateBookingDraggingCalendar = async () => {
    const post = Utils.postDto(this.state.appointmentInfo);
    const res = await this.props.bookingService.createNewBooking(post);
    this.props.history.push("/dashboard");
  };

  handleChangeReasonAppointment = event => {
    const keyPressed = event.target.value;
    this.setState(prevState => {
      prevState.appointmentInfo.reasonAppointment = keyPressed;
      return prevState;
    });
  };
  handleEventView = ({ event }) => {
    return (
      <span>
        <strong>{event.title}</strong>
        {event.desc && ":  " + event.desc}
      </span>
    );
  };

  handleSelect = conferenceRoomName => event => {
    const start = event.start;
    const end = event.end;
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
    this.state.selector === "work_week" ? "week" : this.state.selector;
    switch (buttonId) {
      case "previous":
        return this.setState(prevState => ({
          focusDate: dates.add(prevState.focusDate, -1, selector)
        }));
      case "next":
        return this.setState(prevState => ({
          focusDate: dates.add(prevState.focusDate, 1, selector)
        }));
      case "today":
        return this.setState({ focusDate: new Date() });
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="calendar-container">
        <NavBar />
        <HeaderView
          onClickViewButton={this.handlerOnClickViewButton}
          headerDateContainer={
            <Utils.HeaderStrategy
              type={this.state.selector}
              numberDayInMonth={this.state.focusDate.getDate()}
              fullYear={this.state.focusDate.getFullYear()}
              date={this.state.focusDate}
              dayName={Utils.getNameDay(this.state.focusDate)}
              monthName={Utils.getNameMonth(this.state.focusDate)}
              numberWeekInYear={Utils.getWeekOfYear(this.state.focusDate)}
            />
          }
        />
        <Utils.CalendarStrategy
          type={this.state.selector}
          events={this.state.events}
          handleSelect={this.handleSelect}
          components={{ event: this.handleEventView }}
          localizer={Utils.localizer}
          minDate={Utils.minDate}
          maxDate={Utils.maxDate}
          step={Utils.step}
          timeSlots={Utils.timeSlots}
          date={this.state.focusDate}
        />

        <DraggingCalendar
          coordinates={this.state.coordinates}
          appointmentInfo={this.state.appointmentInfo}
          onChange={this.handleChangeReasonAppointment}
          onClick={this.handleClickCreateBookingDraggingCalendar}
        />

        <FooterView
          {...Utils.footerChangeButtonLabels(this.state.selector)}
          currentDateLabel={"Today"}
          onClickButton={this.handlerOnCLickTimeButton}
        />
      </div>
    );
  }
}

export default withRouter(CalendarPageLogic);
