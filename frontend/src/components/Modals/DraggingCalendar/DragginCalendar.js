import React from "react";
import Time from "./Time";
import Date from "./Date";
import CardContainer from "./CardContainer";
import Button from "./Button";
import ReasonAppointment from "./ReasonAppointment";

class DragginCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        reasonAppointment: "",
        propsLoaded: false
      }
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.appointmentInfo !== undefined) {
      return { appointmentInfo: props.appointmentInfo };
    }
    return null;
  }

  render() {
    return (
      <CardContainer coordinates={this.props.coordinates}>
        <Button
          text={"Room #" + this.state.appointmentInfo.roomId}
          color="green"
        />
        <Time
          from={
            this.state.appointmentInfo.start.hours +
            ":" +
            this.state.appointmentInfo.start.minutes
          }
          to={
            this.state.appointmentInfo.end.hours +
            ":" +
            this.state.appointmentInfo.end.minutes
          }
        />
        <Date
          day={this.state.appointmentInfo.date.day}
          month={this.state.appointmentInfo.date.month}
          year={this.state.appointmentInfo.date.year}
        />
        <ReasonAppointment />
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
