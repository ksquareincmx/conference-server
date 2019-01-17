import React from "react";
import moment from "moment";
import dates from "react-big-calendar/lib/utils/dates";
import BigCalendar from "react-big-calendar";
import WeeksView from "components/Calendar/Weeks";
import MonthsView from "components/Calendar/Months";
import YearsView from "components/Calendar/Years";
import DaysView from "components/Calendar/Days";

export const addZeros = number => {
  if (number < 10) {
    return "0" + String(number);
  }
  return String(number);
};

export const postDto = state => {
  const dateFormat =
    addZeros(state.date.year) +
    "-" +
    addZeros(state.date.month) +
    "-" +
    addZeros(state.date.day);
  return {
    description: state.reasonAppointment,
    roomId: state.roomId,
    start:
      dateFormat +
      "T" +
      addZeros(state.start.hours) +
      ":" +
      addZeros(state.start.minutes) +
      ":" +
      "00.000Z",
    end:
      dateFormat +
      "T" +
      addZeros(state.end.hours) +
      ":" +
      addZeros(state.end.minutes) +
      ":" +
      "00.000Z",
    attendees: []
  };
};

export const daysNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
export const monthsNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// Constants for CalendarStrategy
export const localizer = BigCalendar.momentLocalizer(moment);
export const minDate = dates.add(
  dates.startOf(new Date(), "day"),
  -16,
  "hours"
);
export const maxDate = dates.add(dates.endOf(new Date(), "day"), -5, "hours");
export const step = 15;
export const timeSlots = 4;

export const DayHeaderStrategy = props => (
  <div className="header-date-container">
    <p className="top-date">{props.dayName}</p>
    <p className="bottom-date">{`${props.monthName} ${props.numberDayInMonth} ${
      props.fullYear
    }`}</p>
  </div>
);

export const WeekHeaderStrategy = props => (
  <div className="header-date-container">
    <p className="top-date">Week #{props.numberWeekInYear}</p>
    <p className="bottom-date">{`${props.monthName} ${props.numberDayInMonth} ${
      props.fullYear
    }`}</p>
  </div>
);

export const MonthHeaderStrategy = props => (
  <div className="header-date-container">
    <p className="top-date">{props.monthName}</p>
    <p className="bottom-date">{props.fullYear}</p>
  </div>
);

export const YearHeaderStrategy = props => (
  <div className="header-date-container">
    <p className="top-date">{props.fullYear}</p>
  </div>
);

export const HeaderStrategy = props => {
  switch (props.type) {
    case "day":
      return (
        <DayHeaderStrategy
          dayName={props.dayName}
          monthName={props.monthName}
          numberDayInMonth={props.numberDayInMonth}
          fullYear={props.fullYear}
        />
      );
    case "work_week":
      return (
        <WeekHeaderStrategy
          numberWeekInYear={props.numberWeekInYear}
          monthName={props.monthName}
          numberDayInMonth={props.numberDayInMonth}
          fullYear={props.fullYear}
        />
      );
    case "month":
      return (
        <MonthHeaderStrategy
          monthName={props.monthName}
          fullYear={props.fullYear}
        />
      );
    case "year":
      return <YearHeaderStrategy fullYear={props.fullYear} />;
    default:
      return null;
  }
};

export const CalendarStrategy = props => {
  switch (props.type) {
    case "day":
      return <DaysView {...props} />;
    case "work_week":
      return <WeeksView {...props} />;
    case "month":
      return <MonthsView {...props} />;
    case "year":
      return <YearsView {...props} />;
    default:
      return <DaysView {...props} />;
  }
};
export const getNameDay = date => daysNames[date.getDay()];
export const getNameMonth = date => monthsNames[date.getMonth()];
export const getWeekOfYear = date => {
  let d = new Date(+date);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};

export const footerChangeButtonLabels = type => {
  switch (type) {
    case "day":
      return {
        previousButtonLabel: "Previus day",
        nextButtonLabel: "Next day"
      };
    case "work_week":
      return {
        previousButtonLabel: "Previus week",
        nextButtonLabel: "Next week"
      };
    case "month":
      return {
        previousButtonLabel: "Previus month",
        nextButtonLabel: "Next month"
      };
    case "year":
      return {
        previousButtonLabel: "Previus year",
        nextButtonLabel: "Next year"
      };
    default:
      return {
        previousButtonLabel: "",
        nextButtonLabel: ""
      };
  }
};
