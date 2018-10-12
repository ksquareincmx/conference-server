const BookingService = (bookingUri, token) => {
  const createOne = booking => {
    return fetch(bookingUri, {
      method: 'POST',
      body: {
        description: booking.description,
        rommId: booking.roomId,
        start: booking.start,
        end: booking.end,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const getOne = id => {
    return fetch(bookingUri + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const getAll = () => {
    return fetch(bookingUri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const updateOne = (booking, id) => {
    return fetch(bookingUri + id, {
      method: 'PUT',
      body: {
        description: booking.description,
        rommId: booking.roomId,
        start: booking.start,
        end: booking.end,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const deleteOne = id => {
    return fetch(bookingUri + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  return {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
  };
};

export default BookingService;
