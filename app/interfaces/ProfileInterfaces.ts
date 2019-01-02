export interface IProfileResponse {
  time_zone: string;
  locale: string;
  user_id: number;
}

export interface IFindOneProfile {
  id: number;
}

export interface IFindAllProfile {}

export interface IProfileRequest {
  time_zone: string;
  locale: string;
  user_id: number;
}

export interface IUpdateProfile extends IProfileRequest {
  id: number;
}
