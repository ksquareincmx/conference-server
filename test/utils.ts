import * as moment from "moment";

export const getTestDate = () => {
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
