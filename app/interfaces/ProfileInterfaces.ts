export interface IProfileResponse {
  id: number;
  time_zone: string;
  locale: string;
  userId: number;
  created_at: string;
  updated_at: string;
}

export interface IGetProfileRequest {
  userId: number; //userId
}

export interface IUpdateProfileRequest {
  id: number;
  userId: number;
  time_zone: string;
  locale: string;
}
