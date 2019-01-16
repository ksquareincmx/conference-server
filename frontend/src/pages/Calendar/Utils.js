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
