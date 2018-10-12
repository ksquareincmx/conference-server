import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import './Login.css';
import LoginCard from './LoginCard';
import { AuthConsumer } from '../../providers/Auth';
import NavBar from '../../components/NavBar/NavBar'
import { BookingConsumer, BookingProvider } from '../../providers/Booking'
import AppointmentCard from '../../pages/AppointmentCard'

class LoginPageLogic extends Component {
  onFailure = res => {
    console.log('Error:', res);
  };

  render() {
    return (
      <div className="login-page">
        {this.props.auth.jwt == null ? (
          <LoginCard>
            <GoogleLogin
              clientId="129092023456-82964pfqurangtddv4q9g4q62cbq6abm.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              className="login-button"
              onSuccess={this.props.auth.onLogin}
              onFailure={this.onFailure}
            />
          </LoginCard>
        ) : (
            <BookingProvider auth={this.props.auth}>
              <BookingConsumer>
                {booking => (
                  < div >
                    <NavBar
                      userName={this.props.auth.user.name}
                    />
                    <AppointmentCard
                      booking={booking}
                      auth={this.props.auth}
                    />
                  </div>
                )}
              </BookingConsumer>
            </BookingProvider>
          )}
      </div>
    );
  }
}

function LoginPage() {
  return <AuthConsumer>{auth => <LoginPageLogic auth={auth} />}</AuthConsumer>;
}

export default LoginPage;
