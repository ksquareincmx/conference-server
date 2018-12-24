import React from "react";
import { Card, Grid } from "@material-ui/core/";
import Header from "./Header";
import Content from "./Content";
import "./AppointmentCard.css";
class AppointmentCard extends React.Component {
  styles = {
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

  render() {
    return (
      <Grid container justify="center">
        <Card className="card">
          <Header />

          <Grid container className="card-grid-container">
            <Content
              booking={this.props.booking}
              auth={this.props.auth}
              roomService={this.props.roomService}
              userService={this.props.userService}
            />
          </Grid>
        </Card>
      </Grid>
    );
  }
}

export default AppointmentCard;
