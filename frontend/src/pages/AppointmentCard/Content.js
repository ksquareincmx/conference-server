import React from 'react'
import CardContent from '@material-ui/core/CardContent';
import RoomList from './RoomList/'
import Button from '../../components/MaterialButton'
import BookingList from './BookingList/'
import Modal from '@material-ui/core/Modal';
import AppointmentList from '../../Modals/CreateMeeting/'
import { Link } from 'react-router-dom'
import { Grid } from '@material-ui/core/';

class Content extends React.Component {
  state = {
    openModal: false
  }
  handleOnClickCreateMeeting = (event) => {
    this.setState({ openModal: true })
  }

  handleOnCloseModal = (event) => {
    const bookObj = { description: "prueba", roomId: 1, start: "2018-11-19T16:50:00.000Z", end: "2018-11-20T17:01:00.000Z" }
    this.props.booking.createNewBooking(bookObj)
    this.setState({ openModal: false })
  }

  render() {
    return (
      <CardContent style={{ height: '95%', width: '100%' }}>
        <Grid container style={{ height: '100%', width: '100%', marginBottom: 16 }}>

          <Grid item xs={6} >
            <BookingList
              booking={this.props.booking}
              auth={this.props.auth} />
          </Grid>

          <Grid item xs={6} style={{
            width: 500,
            borderLeftWidth: 2,
            borderLeftColor: 'gray',
            borderLeftStyle: 'solid'
          }}>

            <Modal
              open={this.state.openModal}
              onClose={this.handleClose}
              disableAutoFocus={true}
              style={{ width: '100%', height: '100%' }}
            >
              <AppointmentList handleOnCloseModal={this.handleOnCloseModal} booking={this.props.booking} />
            </Modal>

            <RoomList roomService={this.props.roomService} onClick={this.handleOnClickCreateMeeting} />

            <div style={{ marginTop: 40 }}>
              <Link
                to='/calendar'
                style={{ textDecoration: 'none' }}
              >
                <Button
                  textButton='Go to the calendar'
                  colorButton='#1F599D' />
              </Link>

              <Button
                textButton='Create Meeting '
                colorButton='#4A90E2'
                onClick={this.handleOnClickCreateMeeting} />
            </div>

          </Grid>
        </Grid>
      </CardContent>);
  }
}

export default Content