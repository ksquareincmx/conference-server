export interface IUserResponse {
  id: number;
  googleId: string;
  authProviderId: string;
  picture: string;
  name: string;
  email: string;
  password: string;
  role: string;
  create_time: Date;
  updated_time: Date;
}

export interface IGetUser {
  id: number;
}

export interface IUserRequest {
  picture: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IUpdateUser extends IUserRequest {
  id: number;
}

export interface IDeleteUser {
  id: number;
}
