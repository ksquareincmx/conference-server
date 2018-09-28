import React from 'react';
import RoomService from '../../services/RoomService';
import baseUri from '../../config/baseUri';
import AuthConsumer from '../Auth';

const RoomContext = React.createContext({
  createNewRoom: () => {},
  getRoom: () => {},
  getListOfRoom: () => {},
  modifyRoom: () => {},
  removeRoom: () => {},
});

export const RoomConsumer = RoomContext.Consumer;
export class RoomProvider extends React.Component {
  roomService = RoomService(baseUri + 'Room/', props.auth.jwt.token);
  createNewRoom = room => {
    return roomService.createOne(room);
  };

  getRoom = id => {
    return roomService.getOne(id);
  };

  getsListOfRoom = () => {
    return roomService.getAll();
  };

  modifyRoom = (room, id) => {
    return roomService.updateOne(room, id);
  };

  removeRoom = id => {
    return roomService.deleteOne(id);
  };

  render() {
    return (
      <AuthConsumer>
        auth => (
        <RoomContext.Provider
          auth={auth}
          value={{
            createNewRoom: this.createNewRoom,
            getRoom: this.getRoom,
            getListOfRoom: this.getsListOfRoom,
            modifyRoom: this.modifRoom,
            removeRoom: this.removeRoom,
          }}>
          {this.props.children}
        </RoomContext.Provider>
        )
      </AuthConsumer>
    );
  }
}
