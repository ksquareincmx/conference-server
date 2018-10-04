import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

function AppointmentsList(props) {
  return (
    <List component='nav' style={{ maxHeight: 450, overflow: 'auto', maxWidth: 550 }}>
      <ListItem button>
        <Grid container direction='row' style={{ height: '100%', width: '100%' }}>
          <Grid item xs={2} container direction='column' justify='center'>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <div style={{ fontSize: 15, color: 'gray' }}> Room #1</div>
          </Grid>
          <Grid item xs={8} container direction='column'>
            <div style={{ fontSize: 20 }}>Sandra Adams </div>
            <div style={{ color: 'gray' }}> From 9:30 AM to 10:00 AM </div>
          </Grid>
          <Grid item xs={2}>
            <div style={{ color: 'gray' }}>Today</div>
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
    </List>
  );
}

export default AppointmentsList;