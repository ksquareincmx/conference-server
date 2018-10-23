import React from 'react'
import { Card, Grid, CardContent } from '@material-ui/core/';
import Divider from '@material-ui/core/Divider';
import TimeSelect from './TimeSelect'
import RoomSelect from './RoomSelect'
import TextField from '@material-ui/core/TextField';
import MaterialButton from '../../components/MaterialButton'
import ChipList from '../../components/ChipList'
import DatePicker from './DatePicker'
import { Link } from 'react-router-dom'


class AppointmentList extends React.Component {
  styles = {
    card: {
      backgroundColor: '#fefefe',
      width: 700,
      maxWidth: 700,
      minHeight: 600,
      borderRadius: 25,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
    },

    header: {
      fontSize: 40,
      color: '#5094E3',
      fontFamily: 'roboto'
    },

    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }

  render() {
    return (
      <Grid
        container
        justify='center'
        alignItems='center'
        style={{ height: '100%' }}>

        <Card style={this.styles.card}>

          <div>
            <header style={this.styles.header}>Appointment List</header>
            <Divider />
          </div>

          <CardContent style={this.styles.cardContent}>

            <div style={{ fontWeight: 'bold' }}> Reservation date </div>
            <Grid container direction='row'>
              <DatePicker />
            </Grid>

            <div style={{ fontWeight: 'bold' }}>Reservation time</div>
            <Grid container direction='row'>
              <TimeSelect />
              <TimeSelect />
            </Grid>

            <div style={{ fontWeight: 'bold' }}> Conference Room </div>
            <RoomSelect />

            <div style={{ fontWeight: 'bold' }}>Reason for the Appointment</div>
            <TextField
              id="standard-full-width"
              style={{ margin: 8 }}
              placeholder="Reason"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

          </CardContent>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 30 }}>
            <ChipList />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MaterialButton
              textButton='Back'
              onClick={this.props.handleOnCloseModal}
              colorButton='#1F599D' />

            <Link to="/calendar"
              style={{ textDecoration: 'none' }}>
              <MaterialButton
                textButton='Next'
                colorButton='#5094E3'
              />
            </Link>
          </div>

        </Card>
      </Grid>
    );
  }
}

export default AppointmentList;