import React from 'react';
import ProfileService from '../../services/ProfileService';
import baseUri from '../../config/baseUri';
import AuthConsumer from '../Auth';

const ProfileContext = React.createContext({
  getProfile: () => {},
  getProfiles: () => {},
  modifyProfile: () => {},
});

export const ProfileConsumer = ProfileContext.Consumer;
export class ProfileProvider extends React.Component {
  profileService = ProfileService(baseUri + 'Profile/', props.auth.jwt.token);
  getProfile = id => {
    return profileService.getOne(id);
  };

  getProfiles = () => {
    return profileService.getAll();
  };

  modifyProfile = (profile, id) => {
    return profileService.modifyOne(profile, id);
  };

  render() {
    <AuthConsumer>
      auth => (
      <ProfileContext.Provider
        auth={auth}
        value={{
          getProfile: this.getProfile,
          getProfiles: this.getProfiles,
          modifyProfile: this.modifyProfile,
        }}>
        {this.props.children}
      </ProfileContext.Provider>
      )
    </AuthConsumer>;
  }
}
