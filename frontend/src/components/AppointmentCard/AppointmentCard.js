import React from "react";
import { Card, Grid } from "@material-ui/core/";
import Header from "./Header";
import Content from "./Content";
import "./AppointmentCard.css";

function AppointmentCard(props) {
  const styles = {
    card: {
      width: 1250,
      height: 700,
      marginTop: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      textAlign: "center",
      borderRadius: 25
    },
    cardGridContainer: {
      height: "100%"
    }
  };

  return (
    <Grid container justify="center">
      <Card className="card">
        <Header />

        <Grid container className="card-grid-container">
          <Content
            booking={props.booking}
            auth={props.auth}
            roomService={props.roomService}
            userService={props.userService}
          />
        </Grid>
      </Card>
    </Grid>
  );
}

export default AppointmentCard;
