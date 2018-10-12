const ProfileService = (profileUri, token) => {
  const getOne = id => {
    return fetch(profileUri + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const getAll = () => {
    return fetch(profileUri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json());
  };

  const modifyOne = (profile, id) => {
    return fetch(profileUri + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: {
        time_zone: profile.time_zone,
        locale: profile.locale,
      },
    }).then(res => res.json());
  };

  return {
    getOne,
    getAll,
    modifyOne,
  };
};

export default ProfileService;
