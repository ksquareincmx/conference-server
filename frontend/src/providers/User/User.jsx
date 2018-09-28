import React from 'react';
import UserService from '../../services/UserService';
import baseUri from '../../config/baseUri';
import AuthConsumer from '../Auth';

const UserContext = React.createContext({
  getUser: () => {},
  getUsers: () => {},
  modifyUser: () => {},
});

export const UserConsumer = UserContext.Consumer;
export class UserProvider extends React.Component {
  userService = UserService(baseUri + 'User/', props.auth.jwt.token);
  getUser = id => {
    return userService.getOne(id);
  };

  getUsers = () => {
    return userService.getAll();
  };

  modifyUser = (user, id) => {
    return userService.updateOne(user, id);
  };

  render() {
    <AuthConsumer>
      auth => (
      <UserContext.Provider
        auth={auth}
        value={{
          getUser: this.getUser,
          getUsers: this.getUsers,
          modifyUser: this.modifyUser,
        }}>
        {this.props.children}
      </UserContext.Provider>
      ; )
    </AuthConsumer>;
  }
}
