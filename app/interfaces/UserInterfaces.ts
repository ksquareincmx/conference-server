export interface IUserResponse {
  id: number;
  auth_provider: number;
  picture: string;
  name: string;
  email: string;
}

export interface IGetUserParams {
  params: {
    id: number;
  };
}

export interface IUserRequest {
  picture: string;
  name: string;
  email: string;
  password: string;
}
