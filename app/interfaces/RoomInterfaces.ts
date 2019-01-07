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

export interface IFindAllRoomRequest {}

export interface IDeleteRoomRequest {
  id: number;
}

export interface ICreateRoomRequest extends IRoomRequest {}

export interface IUpdateRoomRequest extends IRoomRequest {
  id: number;
}
