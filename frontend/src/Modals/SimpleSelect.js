import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function SimpleSelect(props) {
  return (
    <FormControl style={{ marginRight: 20, marginBottom: 20 }}>
      <InputLabel htmlFor="age-simple">Hour</InputLabel>

      <Select
        value={10}
        inputProps={{
          name: 'Hour',
          id: 'hour-simple',
        }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}


export default SimpleSelect;