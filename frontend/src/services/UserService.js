const UserService = (userUri, token) => {
  getOne = id => {
    return fetch(this.userUri + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then(res => res.json());
  };

  getAll = () => {
    return fetch(userUri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then(res => res.json());
  };

  updateOne = (user, id) => {
    return fetch(userUri + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: {
        googleId: user.googleId,
        picture: user.picture,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    }).then(res => res.json());
  };

  return {
    getOne,
    getAll,
    updateOne,
  };
};

export default UserService;
