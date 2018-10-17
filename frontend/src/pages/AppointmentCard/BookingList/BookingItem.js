import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function BookingItem(props) {

  const startDate = new Date(props.startDate)
  const endDate = new Date(props.endDate)

  const startTime = addZero(startDate.getHours()) + ':' + addZero(startDate.getMinutes())
  const endTime = addZero(endDate.getHours()) + ':' + addZero(endDate.getMinutes())
  return (
    <ListItem button>
      <Grid container direction='row' style={{ height: '100%', width: '100%' }}>
        <Grid item xs={3} container direction='column' justify='center'>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <div style={{ fontSize: 15, color: 'gray' }}> {props.roomId}</div>
        </Grid>
        <Grid item xs={7} container direction='column'>
          <div style={{ fontSize: 20 }}> {props.userId} </div>
          <div style={{ color: 'gray' }}> {startTime + ' to ' + endTime} </div>
        </Grid>
        <Grid item xs={2}>
          <div style={{ color: 'gray' }}>Today</div>
        </Grid>
      </Grid>
      <Divider />

    </ListItem>
  )
}

export default BookingItem;