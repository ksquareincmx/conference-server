const RoomService = (roomUri, token) => {
  const createOne = room => {
    return fetch(roomUri, {
      method: 'POST',
      body: {
        description: room.description,
        rommId: room.roomId,
        start: room.start,
        end: room.end,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const getOne = id => {
    return fetch(roomUri + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const getAll = () => {
    return fetch(roomUri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const updateOne = (room, id) => {
    return fetch(roomUri + id, {
      method: 'PUT',
      body: {
        description: room.description,
        rommId: room.roomId,
        start: room.start,
        end: room.end,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const deleteOne = id => {
    return fetch(roomUri + id, {
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

export default RoomService;
