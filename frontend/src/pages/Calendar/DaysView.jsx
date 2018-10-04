import React from 'react';
import BigCalendar from 'react-big-calendar';
import dates from 'react-big-calendar/lib/utils/dates';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';
import TitleView from './TitleView';

class MyDays extends React.Component {
  styles = {
    days_container: {
      display: 'flex',
      flexDirection: 'row',
      width: 800,
      margin: 'auto',
    },
    day_agenda: {
      width: '50%',
    },
    conference_room_name: { display: 'flex', flexDirection: 'row' },
    separator: { width: 78.4844, minWidth: 78.4844, maxWidth: 78.4844 },
  };

  render() {
    let { date } = this.props;
    let range = MyDays.range(date);

    return (
      <div style={this.styles.days_container}>
        <div style={this.styles.day_agenda}>
          <div style={this.styles.conference_room_name}>
            <span style={this.styles.separator} />
            <h2 style={{ textAlaign: 'centre' }}>Conference Room #1</h2>
          </div>
          <TimeGrid {...this.props} range={range} eventOffset={15} />
        </div>
        <div style={this.styles.day_agenda}>
          <div style={this.styles.conference_room_name}>
            <span style={this.styles.separator} />
            <h2 style={{ textAlaign: 'centre' }}>Conference Room #2</h2>
          </div>
          <TimeGrid {...this.props} range={range} eventOffset={15} />
        </div>
      </div>
    );
  }
}

MyDays.title = TitleView;

MyDays.range = date => {
  let start = date;
  let range = [start];
  return range;
};

MyDays.navigate = (date, action) => {
  switch (action) {
    case BigCalendar.Navigate.PREVIOUS:
      return dates.add(date, -1, 'day');

    case BigCalendar.Navigate.NEXT:
      return dates.add(date, 1, 'day');

    default:
      return date;
  }
};

// const getMonday = d => {
//   d = new Date(d);
//   var day = d.getDay(),
//     diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
//   return new Date(d.setDate(diff));
// };

export default MyDays;
