export interface IRoomResponse {
  id: number;
  name: string;
  color: string;
  presence: boolean;
  created_at: Date;
  updated_at: Date;
  booking_id_actual: number;
  status: string;
}

export interface IRoomRequest {
  name: string;
  color: string;
}

export interface IFindRoomParams {
  params: {
    id: number;
  };
}

export interface IFindAllRoomParams {}

export interface IDeleteRoomParams {
  params: {
    id: number;
  };
}

export interface ICreateRoomRequest {
  body: IRoomRequest;
}

export interface IUpdateRoomRequest {
  params: {
    id: number;
  };
  body: IRoomRequest;
}
