import React from 'react'
import RoomCard from './RoomCard/'
import GridList from '@material-ui/core/GridList';
import cuid from 'cuid'

class RoomList extends React.Component {
  state = {
    roomItems: []
  }

  componentDidMount() {
    this.props.roomService.getListOfRoom().then(rooms => {
      const newRooms = rooms.map(room => {
        if (room.color === 'green') {
          room.backgroundColor = '#D8F0BE'
          room.colorButton = '#4A90E2'
        } else {
          room.backgroundColor = '#CAF7ED'
          room.colorButton = '#92B3AC'
        }

        room.roomId = cuid()
        return room
      })

      this.setState({ roomItems: newRooms })
    }
    )
  }

  render() {
    return (
      <GridList style={{ maxHeight: 450, marginLeft: 20 }}>

        {
          this.state.roomItems.map(room => (
            <RoomCard
              roomName={room.name}
              backgroundColor={room.backgroundColor}
              colorButton={room.colorButton}
              status={room.presence}
              key={room.roomId} />
          ))
        }

      </GridList >
    );
  }

}

export default RoomList;