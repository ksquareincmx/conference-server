import React from "react";
import Time from "./Time";
import Date from "./Date";
import CardContainer from "./CardContainer";
import Button from "./Button";
import ReasonAppointment from "./ReasonAppointment";

class DragginCalendar extends React.Component {
  render() {
    return (
      <CardContainer coordinates={this.props.coordinates}>
        <Button
          text={"Room #" + this.props.appointmentInfo.roomId}
          color="green"
        />
        <Time
          from={
            this.props.appointmentInfo.start.hours +
            ":" +
            this.props.appointmentInfo.start.minutes
          }
          to={
            this.props.appointmentInfo.end.hours +
            ":" +
            this.props.appointmentInfo.end.minutes
          }
        />
        <Date
          day={this.props.appointmentInfo.date.day}
          month={this.props.appointmentInfo.date.month}
          year={this.props.appointmentInfo.date.year}
        />
        <ReasonAppointment onChange={this.props.onChange} />
        <Button text="Accept" color="blue" />
      </CardContainer>
    );
  }
}

const postDto = state => {
  const dateFormat = state.date.year + state.date.month + state.date.day;
  return {
    description: state.reasonAppointment,
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
};

export default DragginCalendar;
