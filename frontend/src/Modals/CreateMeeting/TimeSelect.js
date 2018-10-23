import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Select, Grid } from '@material-ui/core/';
import cuid from 'cuid'

class TimeSelect extends React.Component {

  state = {
    hourSelected: 10,
    minuteSelected: 15,
    hours: [],
    minutes: []

  }

  styles = {
    select: {
      marginTop: 8,
      marginRight: 8
    }
  }
  handleHourOnChange = (event) => {
    this.setState({ hourSelected: event.target.value, })
  }

  handleMinuteOnChange = (event) => {
    this.setState({ minuteSelected: event.target.value, })
  }

  componentDidMount() {
    const hoursArray = (Array.from(new Array(24), (x, i) => [i, false]))
    const minutesArray = (Array.from(new Array(4), (x, i) => [i * 15, false]))

    this.setState({ hours: hoursArray, minutes: minutesArray })
  }
  render() {
    return (


      <Grid item xs={6}>
        < FormControl style={{ marginRight: 20, marginBottom: 20 }}>
          <InputLabel >Hour</InputLabel>

          <Select
            value={this.state.hourSelected}
            inputProps={{
              name: 'Hours',
              id: 'hour-simple',
            }}
            onChange={this.handleHourOnChange}
            style={this.styles.select}
          >

            {this.state.hours.map(hour =>
              <MenuItem value={hour[0]} key={cuid()}>{hour[0]}</MenuItem>
            )}
          </Select>
        </FormControl >

        < FormControl style={{ marginRight: 20, marginBottom: 20 }}>
          <InputLabel >Minutes</InputLabel>

          <Select
            value={this.state.minuteSelected}
            inputProps={{
              name: 'Minutes',
              id: 'minute-simple',
            }}
            onChange={this.handleMinuteOnChange}
            style={this.styles.select}
          >

            {this.state.minutes.map(minute =>
              <MenuItem value={minute[0]} key={cuid()}>{minute[0]}</MenuItem>
            )}
          </Select>
        </FormControl>

      </Grid>



    );
  }
}


export default TimeSelect;