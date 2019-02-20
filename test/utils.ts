import * as moment from "moment";

const getWeekdayDate = () => {
  const day = new Date().getDay();
  const actualDate = moment();

  const nextWeekday = (addDays: number) =>
    actualDate.add(addDays, "day").format("YYYY-MM-DD");

  // can't make a booking in weekend
  if (day === 6) {
    return nextWeekday(2);
  }
  if (day === 5) {
    return nextWeekday(3);
  }

  return nextWeekday(1);
};

const getDateTimeOutOffice = () => {
  return {
    startDate: `${getWeekdayDate()}T10:00:00.000Z`, // "YYYY-MM-DDT04:00:00-06"
    endDate: `${getWeekdayDate()}T11:00:00.000Z` // "YYYY-MM-DDT05:00:00-06"
  };
};

const getWeekendDate = () => {
  const day = new Date().getDay();
  const actualDate = moment();

  const nextWeekendDay = (addDays: number) =>
    actualDate.add(addDays, "day").format("YYYY-MM-DD");

  // return next saturday date
  const weekendDay = nextWeekendDay(6 - day);

  return {
    startDate: `${weekendDay}T18:00:00.000Z`,
    endDate: `${weekendDay}T18:10:00.000Z`
  };
};

// Useful for booking tests
export const availableDate = getWeekdayDate();
export const timeOutOffice = getDateTimeOutOffice();
export const weekendDate = getWeekendDate();
export const pastDate = {
  startDate: "1970-10-10T18:00:00.000Z",
  endDate: "1970-10-10T18:00:00.000Z"
};
export const invalidEmail = "invalid@ksquareinc";
export const inexistRoom = Number.MAX_SAFE_INTEGER;
export const inexistBooking = Number.MAX_SAFE_INTEGER;
