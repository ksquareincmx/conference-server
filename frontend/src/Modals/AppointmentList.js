import React from 'react'
import { Card, Grid, CardContent } from '@material-ui/core/';
import Divider from '@material-ui/core/Divider';
import SimpleSelect from './SimpleSelect'
import TextField from '@material-ui/core/TextField';
import MaterialButton from '../components/MaterialButton'
import ChipList from '../components/ChipList'

function AppointmentList(props) {
  const styles = {
    card: {
      backgroundColor: '#fefefe',
      minWidth: 700,
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

  return (
    <Grid container justify='center' alignItems='center' style={{ height: '100%' }}>
      <Card style={styles.card}>

        <div>
          <header style={styles.header}>Appointment List</header>
          <Divider />
        </div>

        <CardContent style={styles.cardContent}>

          <div style={{ fontWeight: 'bold' }}>Reservation time</div>
          <Grid container direction='row'>
            <Grid item xs={6}>
              <SimpleSelect />
              <SimpleSelect />
            </Grid>

            <Grid item xs={6}>
              <SimpleSelect />
              <SimpleSelect />
            </Grid>
          </Grid>

          <div style={{ fontWeight: 'bold' }}> Reservation date </div>
          <Grid container direction='row'>
            <Grid item xs={6}>
              <SimpleSelect />
              <SimpleSelect />
            </Grid>

            <Grid item xs={6}>
              <SimpleSelect />
              <SimpleSelect />
            </Grid>
          </Grid>

          <div style={{ fontWeight: 'bold' }}> Conference Room </div>
          <Grid container direction='row'>
            <Grid item xs={6}>
              <SimpleSelect />
            </Grid>
          </Grid>

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
          <MaterialButton textButton='Back' colorButton='#1F599D' />
          <MaterialButton textButton='Next' colorButton='#5094E3' />
        </div>

      </Card>
    </Grid>
  );
}

export default AppointmentList;