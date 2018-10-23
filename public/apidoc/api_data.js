define({ "api": [
  {
    "type": "post",
    "url": "/api/v1/auth/change/",
    "title": "Change password",
    "permission": [
      {
        "name": "access"
      }
    ],
    "name": "postChangeAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Change password data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.oldPass",
            "description": "<p>User old password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.newPass",
            "description": "<p>User new password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Success credentials</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.token",
            "description": "<p>JWT token</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.expires",
            "description": "<p>Token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.refresh_token",
            "description": "<p>JWT refresh token data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.refresh_token.token",
            "description": "<p>JWT Refresh Token</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.refresh_token.expires",
            "description": "<p>Refresh token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.refresh_token.expires_in",
            "description": "<p>Refresh token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.user.id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.profile",
            "description": "<p>User profile</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Auth.ts",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/googleLogin/",
    "title": "Google login",
    "permission": [
      {
        "name": "none"
      }
    ],
    "name": "postGoogleLoginAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idToken",
            "description": "<p>token id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Success credentials</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.token",
            "description": "<p>JWT token</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.expires",
            "description": "<p>Token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.refresh_token",
            "description": "<p>JWT refresh token data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.refresh_token.token",
            "description": "<p>JWT Refresh Token</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.refresh_token.expires",
            "description": "<p>Refresh token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.refresh_token.expires_in",
            "description": "<p>Refresh token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.user.id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.profile",
            "description": "<p>User profile</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Auth.ts",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/logout/",
    "title": "Logout",
    "permission": [
      {
        "name": "access"
      }
    ],
    "name": "postLogoutAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Auth.ts",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/refresh/",
    "title": "Refresh token",
    "permission": [
      {
        "name": "refresh (valid refresh token present in Authorization header)"
      }
    ],
    "name": "postRefreshAuth",
    "group": "Auth",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Success credentials</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.token",
            "description": "<p>JWT token</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.expires",
            "description": "<p>Token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.refresh_token",
            "description": "<p>JWT refresh token data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.refresh_token.token",
            "description": "<p>JWT Refresh Token</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.refresh_token.expires",
            "description": "<p>Refresh token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.refresh_token.expires_in",
            "description": "<p>Refresh token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.user.id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.profile",
            "description": "<p>User profile</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Auth.ts",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/register/",
    "title": "Register",
    "permission": [
      {
        "name": "none"
      }
    ],
    "name": "postRegisterAuth",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Login credentials</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.password",
            "description": "<p>User password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Success credentials</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.token",
            "description": "<p>JWT token</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.expires",
            "description": "<p>Token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.refresh_token",
            "description": "<p>JWT refresh token data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.refresh_token.token",
            "description": "<p>JWT Refresh Token</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.refresh_token.expires",
            "description": "<p>Refresh token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.refresh_token.expires_in",
            "description": "<p>Refresh token expiration time</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.user.id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.profile",
            "description": "<p>User profile</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Auth.ts",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/api/v1/Booking/:id",
    "title": "Get a Booking",
    "permission": [
      {
        "name": "access"
      }
    ],
    "name": "GetAllBooking",
    "group": "Booking",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.id",
            "description": "<p>Booking id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Booking details</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "body.start",
            "description": "<p>Booking date start</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.description",
            "description": "<p>Booking description</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "body.end",
            "description": "<p>Booking date end</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.roomId",
            "description": "<p>Booking room id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>Booking user id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.room",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.room.color",
            "description": "<p>Room color</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "body.room.presence",
            "description": "<p>Room presence</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.googleId",
            "description": "<p>User google account id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.password",
            "description": "<p>User password (Minimum length 8 characters)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Booking.ts",
    "groupTitle": "Booking"
  },
  {
    "type": "get",
    "url": "/api/v1/Booking/",
    "title": "Gets a list of Booking",
    "permission": [
      {
        "name": "access"
      }
    ],
    "name": "GetBooking",
    "group": "Booking",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Booking details</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "body.start",
            "description": "<p>Booking date start</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.description",
            "description": "<p>Booking description</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "body.end",
            "description": "<p>Booking date end</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.roomId",
            "description": "<p>Booking room id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>Booking user id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.room",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.room.color",
            "description": "<p>Room color</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "body.room.presence",
            "description": "<p>Room presence</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.googleId",
            "description": "<p>User google account id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.password",
            "description": "<p>User password (Minimum length 8 characters)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Booking.ts",
    "groupTitle": "Booking"
  },
  {
    "type": "post",
    "url": "/api/v1/Booking/",
    "title": "Create a new Booking",
    "permission": [
      {
        "name": "access (Enforces access only to owner)"
      }
    ],
    "name": "PostBooking",
    "group": "Booking",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Booking</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "body.start",
            "description": "<p>Booking date start</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.description",
            "description": "<p>Booking description</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "body.end",
            "description": "<p>Booking date end</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.roomId",
            "description": "<p>Booking room id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>Booking user id</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body.room",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.room.color",
            "description": "<p>Room color</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "body.room.presence",
            "description": "<p>Room presence</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.googleId",
            "description": "<p>User google account id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.password",
            "description": "<p>User password (Minimum length 8 characters)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Booking</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "body.start",
            "description": "<p>Booking date start</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.description",
            "description": "<p>Booking description</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "body.end",
            "description": "<p>Booking date end</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.roomId",
            "description": "<p>Booking room id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>Booking user id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.room",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.room.color",
            "description": "<p>Room color</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "body.room.presence",
            "description": "<p>Room presence</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.googleId",
            "description": "<p>User google account id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.password",
            "description": "<p>User password (Minimum length 8 characters)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Booking.ts",
    "groupTitle": "Booking"
  },
  {
    "type": "put",
    "url": "/api/v1/Booking/:id",
    "title": "Modify a Booking",
    "permission": [
      {
        "name": "access (admin and owner)"
      }
    ],
    "name": "PutBooking",
    "group": "Booking",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Booking</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "body.start",
            "description": "<p>Booking date start</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.description",
            "description": "<p>Booking description</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "body.end",
            "description": "<p>Booking date end</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.roomId",
            "description": "<p>Booking room id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>Booking user id</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body.room",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.room.color",
            "description": "<p>Room color</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "body.room.presence",
            "description": "<p>Room presence</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.googleId",
            "description": "<p>User google account id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.password",
            "description": "<p>User password (Minimum length 8 characters)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Booking</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "body.start",
            "description": "<p>Booking date start</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.description",
            "description": "<p>Booking description</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "body.end",
            "description": "<p>Booking date end</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.roomId",
            "description": "<p>Booking room id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>Booking user id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.room",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.room.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.room.color",
            "description": "<p>Room color</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "body.room.presence",
            "description": "<p>Room presence</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body.user",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.googleId",
            "description": "<p>User google account id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.password",
            "description": "<p>User password (Minimum length 8 characters)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.user.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Booking.ts",
    "groupTitle": "Booking"
  },
  {
    "type": "delete",
    "url": "/api/v1/Booking/:id",
    "title": "Removes a Booking",
    "permission": [
      {
        "name": "access (admin and owner)"
      }
    ],
    "name": "deleteBooking",
    "group": "Booking",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Booking.ts",
    "groupTitle": "Booking"
  },
  {
    "type": "get",
    "url": "/api/v1/Profile/",
    "title": "Get a list of Profile",
    "permission": [
      {
        "name": "access (Enforces access only to owner)"
      }
    ],
    "name": "getAllProfiles",
    "group": "Profile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Profile details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.time_zone",
            "description": "<p>Profile time zone</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.locale",
            "description": "<p>Profile locale (&quot;en&quot;, &quot;es&quot;)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>User id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Profile.ts",
    "groupTitle": "Profile"
  },
  {
    "type": "get",
    "url": "/api/v1/Profile/:id",
    "title": "Get a Profile",
    "permission": [
      {
        "name": "access (Enforces access only to owner)"
      }
    ],
    "name": "getProfile",
    "group": "Profile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Profile id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Profile details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.time_zone",
            "description": "<p>Profile time zone</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.locale",
            "description": "<p>Profile locale (&quot;en&quot;, &quot;es&quot;)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>User id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Profile.ts",
    "groupTitle": "Profile"
  },
  {
    "type": "put",
    "url": "/api/v1/Profile/:id",
    "title": "Modify a Profile",
    "permission": [
      {
        "name": "access (Enforces access only to owner)"
      }
    ],
    "name": "putProfile",
    "group": "Profile",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Profile id</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Profile details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.time_zone",
            "description": "<p>Profile time zone</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.locale",
            "description": "<p>Profile locale (&quot;en&quot;, &quot;es&quot;)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>User id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Profile details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.time_zone",
            "description": "<p>Profile time zone</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.locale",
            "description": "<p>Profile locale (&quot;en&quot;, &quot;es&quot;)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "body.userId",
            "description": "<p>User id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Profile.ts",
    "groupTitle": "Profile"
  },
  {
    "type": "delete",
    "url": "/api/v1/Room/:id",
    "title": "Delete a Room",
    "permission": [
      {
        "name": "access (only admin)"
      }
    ],
    "name": "deleteRoom",
    "group": "Room",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Room.ts",
    "groupTitle": "Room"
  },
  {
    "type": "get",
    "url": "/api/v1/Room/",
    "title": "Get a list of Rooms",
    "permission": [
      {
        "name": "access"
      }
    ],
    "name": "getAllRooms",
    "group": "Room",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.color",
            "description": "<p>The color to show in the UI for this room</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "body.presence",
            "description": "<p>If there is someone in the room</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Room.ts",
    "groupTitle": "Room"
  },
  {
    "type": "get",
    "url": "/api/v1/Room/:id",
    "title": "Get a Room",
    "permission": [
      {
        "name": "access"
      }
    ],
    "name": "getRoom",
    "group": "Room",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.color",
            "description": "<p>The color to show in the UI for this room</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "body.presence",
            "description": "<p>If there is someone in the room</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Room.ts",
    "groupTitle": "Room"
  },
  {
    "type": "post",
    "url": "/api/v1/Room/",
    "title": "Create a Room",
    "permission": [
      {
        "name": "access (only admin)"
      }
    ],
    "name": "postRoom",
    "group": "Room",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.color",
            "description": "<p>The color to show in the UI for this room</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "body.presence",
            "description": "<p>If there is someone in the room</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.color",
            "description": "<p>The color to show in the UI for this room</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "body.presence",
            "description": "<p>If there is someone in the room</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Room.ts",
    "groupTitle": "Room"
  },
  {
    "type": "put",
    "url": "/api/v1/Room/:id",
    "title": "Modify a room",
    "permission": [
      {
        "name": "access (only admin)"
      }
    ],
    "name": "putRoom",
    "group": "Room",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.color",
            "description": "<p>The color to show in the UI for this room</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "body.presence",
            "description": "<p>If there is someone in the room</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Room details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>Room name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.color",
            "description": "<p>The color to show in the UI for this room</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "body.presence",
            "description": "<p>If there is someone in the room</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/Room.ts",
    "groupTitle": "Room"
  },
  {
    "type": "delete",
    "url": "/api/v1/Users/:id",
    "title": "Delete an User",
    "permission": [
      {
        "name": "access (only admin can delete user)"
      }
    ],
    "name": "deleteUser",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/User.ts",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/v1/Users/:id",
    "title": "Get an User",
    "permission": [
      {
        "name": "access"
      }
    ],
    "name": "getUser",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.googleId",
            "description": "<p>User google id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/User.ts",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/api/v1/Users/:id",
    "title": "Modify an User",
    "permission": [
      {
        "name": "access (only admin can edit user)"
      }
    ],
    "name": "putUser",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Application/Json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer [jwt token]</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>User details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.googleId",
            "description": "<p>User google id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>User details</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.googleId",
            "description": "<p>User google id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.picture",
            "description": "<p>The URL of the user profile picture (provided by google)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "body.role",
            "description": "<p>User role (&quot;user&quot;, &quot;admin&quot;)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/controllers/v1/User.ts",
    "groupTitle": "User"
  }
] });
