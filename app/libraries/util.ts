import * as moment from "moment-timezone";
import * as EmailValidator from "email-validator";
import { IBookingDateInfo } from "../interfaces/v2/SlackInterfaces";

export const months = [
  { name: "January", val: 1 },
  { name: "February", val: 2 },
  { name: "March", val: 3 },
  { name: "April", val: 4 },
  { name: "May", val: 5 },
  { name: "June", val: 6 },
  { name: "July", val: 7 },
  { name: "August", val: 8 },
  { name: "September", val: 9 },
  { name: "October", val: 10 },
  { name: "November", val: 11 },
  { name: "December", val: 12 }
];

export const weekdays = [
  { name: "Sunday", val: 0 },
  { name: "Monday", val: 1 },
  { name: "Tuesday", val: 2 },
  { name: "Wednesday", val: 3 },
  { name: "Thursday", val: 4 },
  { name: "Friday", val: 5 },
  { name: "Saturday", val: 6 }
];

export const colors = ["red", "purple", "blue", "light-blue", "orange"];

export function numberFixedLen(n, len) {
  return (1e4 + "" + n).slice(-len);
}

export function numToMonth(n) {
  return months[n - 1].name;
}

export function getRandomColor() {
  let index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

export function getActualDate(): string {
  return moment()
    .utc()
    .format();
}

/**
 * Checks if it's a falsy value. Don't includes 0.
 * @param {*} Value to evaluate
 * @return {boolean}
 */
export function isEmpty(attribute) {
  return !attribute && attribute !== 0;
}

// Returns a object with the same propertys but with the format keys eg.
// a = { firstName: "John", lastName: "Doe" } =>
// a = { first_name: "John", last_name: "Doe" }
export function toSyntax(obj, syntaxConverter) {
  return Object.keys(obj).reduce(
    (acc, key) => ((acc[syntaxConverter(key)] = obj[key]), acc),
    {}
  );
}

export function isValidDate(date: string): boolean {
  return moment(date).isValid();
}

export function isAvailableDate(
  start: string,
  end: string,
  timezone = "America/Mexico_City"
): boolean {
  const startDate: moment = moment(start).tz(timezone);
  const endDate: moment = moment(end).tz(timezone);

  // Check if is weekday
  const isAvailableDay = (day: number) => !(day === 6 || day === 7);

  // Check if the hours is in office hours
  const isAvailableHour = (starHour: string, endHour: string) =>
    starHour >= "08:00" && endHour <= "18:00";

  return (
    isAvailableDay(startDate.isoWeekday()) &&
    isAvailableHour(startDate.format("HH:mm"), endDate.format("HH:mm"))
  );
}

export function areValidsEmails(emails: string[]) {
  return emails.every(email => EmailValidator.validate(email));
}

export const formatDateFromSlack = ({
  date,
  startHour,
  startMinute,
  endHour,
  endMinute
}: IBookingDateInfo) => {
  const hourOffset =
    moment()
      .tz("America/Mexico_city")
      .utcOffset() / 60;

  const startDate = moment(`${date}T${startHour}:${startMinute}`)
    .utcOffset(hourOffset, true)
    .utc()
    .format();

  const endDate = moment(`${date}T${endHour}:${endMinute}`)
    .utcOffset(hourOffset, true)
    .utc()
    .format();

  return { startDate, endDate };
};
