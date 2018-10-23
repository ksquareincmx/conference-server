import { Op, Model } from "sequelize";
import { BookingAttendee } from "./../models/BookingAttendee";
import { insertAttendee, getAttendee } from "./AttendeeDB";
import { Attendee } from "./../models/Attendee";
import { Controller } from "./Controller";

export function insertBookingAttendee(bookingId: number, attendeeId: number) {
  let bookingAttendee = {
    emailId: attendeeId,
    bookingId: bookingId
  };

  return BookingAttendee.create(bookingAttendee)
    .then(result => {
      return result;
    })
    .catch(err => {
      return Controller.serverError(err);
    });
}

export function deleteBookingAttendee(bookingId: number, attendeeId: number) {
  BookingAttendee.destroy({
    where: {
      bookingId: {
        [Op.eq]: bookingId
      },
      emailId: {
        [Op.eq]: attendeeId
      }
    }
  }).catch(err => {
    Controller.serverError(err);
  });
}

export function deleteAllBookingAttendee(bookingId: number) {
  BookingAttendee.destroy({
    where: {
      bookingId: {
        [Op.eq]: bookingId
      }
    }
  }).catch(err => {
    Controller.serverError(err);
  });
}

export async function updateBookingAttendee(
  bookingId: number,
  updatedAttendees: Array<string>
) {
  let attendees = await getAttendees(bookingId);

  let originalAttendees = attendees.map(x => x["email"]);
  let originalAttendeesSet = new Set(originalAttendees);
  let updatedAttendeesSet = new Set(updatedAttendees);

  let attendeesToDelete = originalAttendees.filter(
    x => !updatedAttendeesSet.has(x)
  );

  let attendeesToAdd = updatedAttendees.filter(
    x => !originalAttendeesSet.has(x)
  );

  attendeesToAdd.forEach(async attendeeEmail => {
    try {
      let attendeeId = await insertAttendee(attendeeEmail);
      let bookingAttendee = await {
        emailId: attendeeId,
        bookingId: bookingId
      };
      BookingAttendee.create(bookingAttendee);
    } catch (err) {
      return Controller.serverError(err);
    }
  });

  attendeesToDelete.forEach(async attendeeEmail => {
    try {
      let attendeeId = await getAttendee(attendeeEmail);
      deleteBookingAttendee(bookingId, attendeeId);
    } catch (err) {
      return Controller.serverError(err);
    }
  });

  return updatedAttendees;
}

export function getAttendees(bookingId: number) {
  return BookingAttendee.findAll({
    where: {
      bookingId: {
        [Op.eq]: bookingId
      }
    },
    include: [Attendee]
  })
    .then(async result => {
      let parsedResult = await JSON.parse(JSON.stringify(result));
      let attendees = parsedResult.map(item => item["attendee"]);
      return attendees;
    })
    .catch(err => {
      return Controller.serverError(err);
    });
}
