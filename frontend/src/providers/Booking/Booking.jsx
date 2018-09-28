import React from 'react';
import BookingService from '../../services/BookingService';
import baseUri from '../../config/baseUri';
import AuthConsumer from '../Auth';

const BookingContext = React.createContext({
  createNewBooking: () => {},
  getBooking: () => {},
  getListOfBooking: () => {},
  modifyBooking: () => {},
  removeBooking: () => {},
});

export const BookingConsumer = BookingContext.Consumer;
export class BookingProvider extends React.Component {
  bookingService = BookingService(baseUri + 'Booking/', props.auth.jwt.token);
  createNewBooking = booking => {
    return bookingService.createOne(booking);
  };

  getBooking = id => {
    return bookingService.getOne(id);
  };

  getsListOfBooking = () => {
    return bookingService.getAll();
  };

  modifyBooking = (booking, id) => {
    return bookingService.updateOne(booking, id);
  };

  removeBooking = id => {
    return this.bookingService.deleteOne(id);
  };

  render() {
    return (
      <AuthConsumer>
        auth => (
        <BookingContext.Provider
          auth={auth}
          value={{
            createNewBooking: this.createNewBooking,
            getBooking: this.getBooking,
            getListOfBooking: this.getsListOfBooking,
            modifyBooking: this.modifyBooking,
            removeBooking: this.removeBooking,
          }}>
          {this.props.children}
        </BookingContext.Provider>
        )
      </AuthConsumer>
    );
  }
}
