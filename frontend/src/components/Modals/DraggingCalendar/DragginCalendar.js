import React from "react";
import Time from "./Time";
import Date from "./Date";
import CardContainer from "./CardContainer";
import Button from "./Button";
import ReasonAppointment from "./ReasonAppointment";

class DragginCalendar extends React.Component {
  render() {
    let start = { hours: "0", minutes: "0" };
    let end = { hours: "0", minutes: "0" };

    let room = { roomId: 0 };

    let date = { day: "0", month: "0", year: "0" };

    if (this.props.appointmentInfo) {
      start = this.props.appointmentInfo.start;
      end = this.props.appointmentInfo.end;
      room = this.props.appointmentInfo.roomId;
      date = this.props.appointmentInfo.date;
    }

    return (
      <CardContainer coordinates={this.props.coordinates}>
        <Button text={"Room #" + room} color="green" />
        <Time
          from={start.hours + ":" + start.minutes}
          to={end.hours + ":" + end.minutes}
        />
        <Date day={date.day} month={date.month} year={date.year} />
        <ReasonAppointment />
        <Button text="Accept" color="blue" />
      </CardContainer>
    );
  }
}

function postDto(state) {
  const dateFormat = state.date.year + state.date.month + state.date.day;
  return {
    description: state.reasonAppoointmentText,
    roomId: state.roomId,
    start:
      dateFormat +
      "T" +
      state.start.hours +
      ":" +
      state.start.minutes +
      ":" +
      "00.000Z",
    end:
      dateFormat +
      "T" +
      state.end.hour +
      ":" +
      state.end.minute +
      ":" +
      "00.000Z",
    attendees: []
  };
}

export default DragginCalendar;
