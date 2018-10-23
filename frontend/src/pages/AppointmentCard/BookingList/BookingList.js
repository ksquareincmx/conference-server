import React from 'react'
import List from '@material-ui/core/List';
import BookingItem from './BookingItem'
import cuid from 'cuid'

class BookigList extends React.Component {

  state = {
    bookingItems: [],
  }

  componentDidMount() {
    this.props.booking.getDetailedListOfBooking().then(data => {
      this.setState(prevState => ({
        bookingItems: prevState.bookingItems.concat(data)
      }))
    })
  }

  render() {
    return (
      <List component='nav' style={{
        maxHeight: 450,
        overflow: 'auto',
        maxWidth: 550
      }}>
        {this.state.bookingItems.map(data =>
          <BookingItem
            key={cuid()}
            userId={data.user.name}
            roomId={data.room.name}
            startDate={data.start}
            endDate={data.end}
          />
        )}
      </List>
    );
  }
}
export default BookigList;
