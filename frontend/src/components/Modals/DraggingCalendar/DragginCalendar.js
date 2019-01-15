import React from "react";
import Time from "./Time";
import Date from "./Date";
import CardContainer from "./CardContainer";
import Button from "./Button";
import ReasonAppointment from "./ReasonAppointment";

function DragginCalendar(props) {
  return (
    <CardContainer>
      <Button text="Room #1" color="green" />
      <Time from="9:00" to="10:00" />
      <Date />
      <ReasonAppointment />
      <Button text="Accept" color="blue" />
    </CardContainer>
  );
}

export default DragginCalendar;
