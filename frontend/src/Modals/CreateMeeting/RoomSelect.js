import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { Select, Grid } from '@material-ui/core/';
import cuid from 'cuid'

class RoomSelect extends React.Component {
  state = {
    rooms: [{ name: 'conference 1', id: 1 }, { name: 'conference 2', id: 2 }],
    roomSelected: 1
  }

  handleOnChange = (event) => {
    this.setState({ roomSelected: event.target.value })
  }

  render() {
    return (
      <Grid item xs={6}>
        < FormControl style={{ marginRight: 20, marginBottom: 20 }}>

          <Select
            value={this.state.roomSelected}
            inputProps={{
              name: 'Rooms',
              id: 'room-simple',
            }}

            onChange={this.handleOnChange}
          >

            {this.state.rooms.map(room =>
              <MenuItem value={room.id} key={cuid()}> {room.name} </MenuItem>
            )}
          </Select>
        </FormControl >
      </Grid>
    );
  }
}


export default RoomSelect;