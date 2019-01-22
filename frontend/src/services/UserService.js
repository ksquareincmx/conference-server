const UserService = (userUri, token) => {
  const getOne = id => {
    return fetch(userUri + id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(res => res.json());
  };

  const getAll = () => {
    return fetch(userUri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    }).then(res => res.json());
  };

  const updateOne = (user, id) => {
    return fetch(userUri + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: {
        authProviderId: user.authProviderId,
        picture: user.picture,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
      }
    }).then(res => res.json());
  };

  return {
    getOne,
    getAll,
    updateOne
  };
};

export default UserService;
