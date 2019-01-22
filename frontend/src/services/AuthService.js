import { reject } from "bluebird";

const AuthService = authUri => {
  const onLogin = idToken => {
    return fetch(authUri, {
      method: "POST",
      body: JSON.stringify({
        idToken
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      switch (res.status) {
        case 200:
          return res.json();
        case 401:
          return reject(new Error("ERROR 401: Unauthorized Account"));
        case 403:
          return reject(new Error("ERROR 403"));
        default:
          return reject(new Error("Unknow error"));
      }
    });
  };

  return { onLogin };
};

export default AuthService;
