import React from 'react';
import { Card, Grid } from '@material-ui/core/';
import CardContent from '@material-ui/core/CardContent';
import CardConference from './CardConference'
import GridList from '@material-ui/core/GridList';
import Button from '../../components/MaterialButton'
import AppoimentList from './AppointmentsList'

function CardStatusContainer(props) {
  const styles = {
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

    header: {
      backgroundColor: '#DEE8F5',
      color: '#4A90E2',
      fontSize: 20,
      height: 50,
      fontFamily: 'roboto',
      fontWeight: 'bold',
      paddingTop: 20
    },
  };

  return (

    <Grid
      container
      justify='center'
    >

      <Card style={styles.card}>

        <header style={styles.header} >
          <Grid container justify='space-between'>
            <Grid item xs={5} container>
              <span style={{ color: 'black', paddingLeft: 50 }}>Appooiments made!</span>
            </Grid>
            <Grid item xs={6} container>
              <span style={{ color: 'black' }}>Conference Status</span>
            </Grid>
          </Grid>
        </header>

        <Grid container alignItems='flex-start' style={{ height: '100%' }}>
          <CardContent style={{ height: '95%', width: '100%' }}>
            <Grid container style={{ height: '100%', width: '100%', marginBottom: 16 }}>

              <Grid item xs={6} >
                <AppoimentList />
              </Grid>

              <Grid item xs={6} style={{ width: 500, borderLeftWidth: 2, borderLeftColor: 'gray', borderLeftStyle: 'solid' }}>
                <GridList style={{ maxHeight: 450, marginLeft: 20 }}>
                  <CardConference backgroundColor='#D8F0BE' colorButton='#4A90E2' />
                  <CardConference backgroundColor='#CAF7ED' colorButton='#92B3AC' />
                </GridList>

                <div style={{ marginTop: 40 }}>
                  <Button textButton='Go to the calendar' colorButton='#1F599D' />
                  <Button textButton='Create Meeting 2' colorButton='#4A90E2' />
                </div>

              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Card>
    </Grid>
  );
}




export default CardStatusContainer;
