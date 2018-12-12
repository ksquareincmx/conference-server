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


const GetDate = (date) => {
  return addZero(date.getDate()) + '/' + addZero(date.getMonth() + 1) + '/' + date.getFullYear()
}

function BookingItem(props) {

  const startNotFormmat = props.startDate.substring(0, props.startDate.length - 1)
  const startDate = new Date(startNotFormmat)

  const endNotFormat = props.endDate.substring(0, props.endDate.length - 1)
  const endDate = new Date(endNotFormat)

  const startTime = addZero(startDate.getHours()) + ':' + addZero(startDate.getMinutes())
  const endTime = addZero(endDate.getHours()) + ':' + addZero(endDate.getMinutes())

  const booking = {
    userId: props.userId,
    bookingId: props.bookingId,
    userName: props.userName,
    roomName: props.roomName,
    roomId: props.roomId,
    startDate: props.startDate,
    endDate: props.endDate,
    attendees: props.attendees
  }

  return (
    <ListItem button onClick={props.clicked(booking)}>
      <Grid container direction='row' style={{ height: '100%', width: '100%' }}>
        <Grid item xs={3} container direction='column' justify='center'>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <div style={{ fontSize: 15, color: 'gray' }}> {props.roomName}</div>
        </Grid>
        <Grid item xs={7} container direction='column'>
          <div style={{ fontSize: 20 }}> {props.userName} </div>
          <div style={{ color: 'gray' }}> {startTime + ' to ' + endTime} </div>
        </Grid>
        <Grid item xs={2}>
          <div style={{ color: 'gray' }}>{GetDate(startDate)}</div>
        </Grid>
      </Grid>
      <Divider />

    </ListItem>
  )
}

export default BookingItem;