import React from "react";
import List from "@material-ui/core/List";
import BookingItem from "components/AppointmentCard/BookingList/BookingItem";
import cuid from "cuid";

class BookigList extends React.Component {
  state = {
    bookingItems: []
  };

  GetUsers = () => {
    let bookingItems = Promise.all(
      this.state.bookingItems.map(async book => {
        const user = await this.props.userService.getUser(book.userId);
        const room = await this.props.roomService.getRoom(book.roomId);

        return {
          ...book,
          userName: user.name,
          roomName: room.name
        };
      })
    );

    bookingItems.then(res => {
      this.setState({ bookingItems: res });
    });
  };

  componentDidMount() {
    this.props.booking.getDetailedListOfBooking().then(data => {
      this.setState({ bookingItems: data }, () => this.GetUsers());
    });
  }

  render() {
    return (
      <List
        component="nav"
        style={{
          maxHeight: 450,
          overflow: "auto",
          maxWidth: 550
        }}
      >
        {this.state.bookingItems.map(data => (
          <BookingItem
            key={cuid()}
            userId={data.userId}
            bookingId={data.id}
            userName={data.userName}
            roomName={data.roomName}
            roomId={data.roomId}
            startDate={data.start}
            endDate={data.end}
            attendees={data.attendees}
            clicked={this.props.clicked}
          />
        ))}
      </List>
    );
  }
}
export default BookigList;
