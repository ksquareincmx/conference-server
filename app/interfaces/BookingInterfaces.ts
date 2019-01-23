// Response
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

export interface IGetBookingParams {
  params: {
    id: number;
  };
}

export interface IGetAllBookingParams {
  query: {
    fromDate?: Date;
    toDate?: Date;
  };
}

export interface IDeleteBookingParams {
  params: {
    id: number;
  };
}

// Interface base for ICreateBooking & IUpdateBooking
export interface IBookingRequest {
  description: string;
  roomId: number;
  start: Date;
  end: Date;
  attendees: string[];
  userId: number;
}

export interface ICreateBookingRequest {
  body: IBookingRequest;
}

export interface IUpdateBookingRequest {
  params: {
    id: number;
  };
  body: IBookingRequest;
}
