//Response
export interface IBookingResponse {
  description: string;
  room_id: number;
  start: Date;
  end: Date;
  attendees: string[];
  user_id: number;
  id: number;
  event_id: string;
  updated_at: Date;
  created_at: Date;
}

//Request
export interface IGetBooking {
  id: number;
}

export interface IGetAllBooking {
  fromDate?: Date;
}
export interface IDeleteBooking {
  id: number;
}

// interface base for ICreateBooking & IUpdateBooking
export interface IBookingRequest {
  description: string;
  roomId: number;
  start: Date;
  end: Date;
  attendees: string[];
  userId: number;
}
export interface ICreateBooking extends IBookingRequest {}

export interface IUpdateBooking extends IBookingRequest {
  id: number;
}
