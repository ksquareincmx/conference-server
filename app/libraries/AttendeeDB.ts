import { Op, Model } from "sequelize";
import { Attendee } from "./../models/Attendee";
import { Controller } from "./Controller";

export async function insertAttendee(email: string) {
  let attendee = await {
    email: email
  };

  return Attendee.findAndCountAll({
    where: {
      email: {
        [Op.eq]: attendee["email"]
      }
    }
  })
    .then(result => {
      if (result.count === 0) {
        return Attendee.create(attendee);
      } else {
        return Attendee.findOne({
          where: {
            email: {
              [Op.eq]: attendee["email"]
            }
          }
        });
      }
    })
    .then(result => {
      return result.id;
    })
    .catch(err => {
      return Controller.serverError(err);
    });
}

export function deleteAttendees(idAttendee: number) {
  return Attendee.destroy({
    where: {
      id: {
        [Op.eq]: idAttendee
      }
    }
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return Controller.serverError(err);
    });
}

export function getAttendee(attendeeEmail: string) {
  return Attendee.findOne({
    where: {
      email: {
        [Op.eq]: attendeeEmail
      }
    }
  })
    .then(result => {
      return result.id;
    })
    .catch(err => {
      return Controller.serverError(err);
    });
}
