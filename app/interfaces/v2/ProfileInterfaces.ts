export interface IProfileResponse {
  id: number;
  time_zone: string;
  locale: string;
  userId: number;
  created_at: string;
  updated_at: string;
}

export interface IGetProfileParams {
  params: {
    id: number;
  };
}

export interface IGetAllProfileSession {
  where: {
    userId: number;
  };
}

export interface IProfileRequest {
  userId: number;
  time_zone: string;
  locale: string;
}

export interface IUpdateProfileRequest {
  params: {
    id: number;
  };
  body: IProfileRequest;
}
