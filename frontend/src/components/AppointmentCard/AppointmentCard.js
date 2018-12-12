import React from 'react';
import { Card, Grid } from '@material-ui/core/';
import Header from './Header'
import Content from './Content'

class AppointmentCard extends React.Component {

  styles = {
    card: {
      width: 1250,
      height: 700,
      marginTop: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      textAlign: 'center',
      borderRadius: 25
    },
  };



  render() {

    return (
      <Grid
        container
        justify='center'
      >
        <Card style={this.styles.card}>
          <Header />

          <Grid container style={{ height: '100%' }}>
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
