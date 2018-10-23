import React from 'react'
import { BookingConsumer, BookingProvider } from '../../providers/Booking'
import { RoomConsumer, RoomProvider } from '../../providers/Room'
import { AuthConsumer } from '../../providers/Auth'
import NavBar from '../../components/NavBar/NavBar'
import AppointmentCard from '../AppointmentCard'

class DashboardPageLogic extends React.Component {
  render() {
    return (
      <BookingProvider auth={this.props.auth}>
        <BookingConsumer>
          {booking =>
            (<RoomProvider auth={this.props.auth}>
              <RoomConsumer>
                {roomService => (
                  < div >
                    <NavBar
                      userName={this.props.auth.user.name}
                    />
                    <AppointmentCard
                      booking={booking}
                      auth={this.props.auth}
                      roomService={roomService}
                    />
                  </div>
                )
                }
              </RoomConsumer>
            </RoomProvider>

            )
          }
        </BookingConsumer>
      </BookingProvider>

    );
  }
}

function VerifyAuth(auth) {
  if (auth.jwt !== null) {
    return (
      <DashboardPageLogic auth={auth} />
    )
  }
}

function DashboardPage() {
  return (
    <AuthConsumer>{auth =>
      VerifyAuth(auth)}
    </AuthConsumer>)
}

export default DashboardPage;
