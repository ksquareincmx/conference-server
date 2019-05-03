import * as CalendarAPI from "node-google-calendar";
import { config } from "./../config/config";

class GoogleCalendarService {
  params: any;
  timeZone: string;
  calendarId: string;
  calendar: any;

  constructor(
    sendUpdates: string = "all",
    timeZone: string = "America/Mexico_City",
    calendarId: string = "primary"
  ) {
    this.params = {
      sendUpdates: sendUpdates
    };
    this.timeZone = timeZone;
    this.calendarId = calendarId;
    this.calendar = new CalendarAPI(config.serviceAccount);
  }

  insertEvent(
    start: string,
    end: string,
    description: string,
    attendees: Array<string>,
    location: string
  ) {
    let event = this.defineEvent(start, end, description, location);

    attendees.forEach(attendee => {
      let email = {
        email: attendee
      };
      event.attendees.push(email);
    });

    return this.calendar.Events.insert(this.calendarId, event, this.params)
      .then(result => {
        return result;
      })
      .catch(err => {
        return new Error(err);
      });
  }

  updateEvent(
    eventId: number,
    start: string,
    end: string,
    description: string,
    attendees: Array<string>,
    location: string
  ) {
    let event = this.defineEvent(start, end, description, location);

    attendees.forEach(attendee => {
      let email = {
        email: attendee
      };
      event.attendees.push(email);
    });

    return this.calendar.Events.update(
      this.calendarId,
      eventId,
      event,
      this.params
    )
      .then(result => {
        return result;
      })
      .catch(err => {
        return new Error(err);
      });
  }

  deleteEvent(eventId: number) {
    return this.calendar.Events.delete(this.calendarId, eventId, this.params)
      .then(result => {
        return result;
      })
      .catch(err => {
        return new Error(err);
      });
  }

  defineEvent(
    start: string,
    end: string,
    description: string,
    location: string
  ) {
    let event = {
      location,
      start: {
        dateTime: start,
        timeZone: this.timeZone
      },
      end: {
        dateTime: end,
        timeZone: this.timeZone
      },
      summary: description,
      attendees: []
    };
    return event;
  }
}

const calendarService = new GoogleCalendarService();
export default calendarService;
