import React from "react";
import List from "@material-ui/core/List";
import BookingItem from "./BookingItem";
import cuid from "cuid";
import "./BookingList.css";

const BookingList = props => {
  return (
    <List component="nav" className="booking-list">
      {props.bookingItems.map(booking => (
        <BookingItem key={cuid()} booking={booking} clicked={props.clicked} />
      ))}
    </List>
  );
};

export default BookingList;
