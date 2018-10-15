import React from 'react'
import RoomCard from './RoomCard/'
import GridList from '@material-ui/core/GridList';

function RoomList(props) {

  return (
    <GridList style={{ maxHeight: 450, marginLeft: 20 }}>
      <RoomCard backgroundColor='#D8F0BE' colorButton='#4A90E2' />
      <RoomCard backgroundColor='#CAF7ED' colorButton='#92B3AC' />
    </GridList>
  );
}

export default RoomList;