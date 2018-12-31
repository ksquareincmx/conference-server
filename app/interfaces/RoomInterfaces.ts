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

export interface IFindRoom {
  id: number;
}

export interface IFindAllRoom {}

export interface IDeleteRoom {
  id: number;
}

export interface IRoomRequest {
  name: string;
  color: string;
}

export interface ICreateRoom extends IRoomRequest {}

export interface IUpdateRoom extends IRoomRequest {
  id: number;
}
