import React from "react";
import { getReasonStyles } from "./Styles";

function ReasonAppointment(props) {
  const styles = getReasonStyles();
  return (
    <div style={styles.reasonAppointment}>{"Reason for the appointment"}</div>
  );
}

export default ReasonAppointment;
