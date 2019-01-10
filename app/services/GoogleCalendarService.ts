import * as CalendarAPI from "node-google-calendar";
import { Controller } from "./../libraries/Controller";
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
    start: Date,
    end: Date,
    description: string,
    attendees: Array<string>
  ) {
    let event = this.defineEvent(start, end, description);

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
      .catch(err => Controller.serverError(err, err));
  }

  updateEvent(
    eventId: number,
    start: Date,
    end: Date,
    description: string,
    attendees: Array<string>
  ) {
    let event = this.defineEvent(start, end, description);

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
        Controller.serverError(err);
      });
  }

  deleteEvent(eventId: number) {
    return this.calendar.Events.delete(this.calendarId, eventId, this.params)
      .then(result => {
        return result;
      })
      .catch(err => {
        Controller.serverError(err);
      });
  }

  defineEvent(start: Date, end: Date, description: string) {
    let event = {
      start: {
        dateTime: start,
        timeZone: this.timeZone
      },
      end: {
        dateTime: start,
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
