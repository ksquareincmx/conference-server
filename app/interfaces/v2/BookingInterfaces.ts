import { IGetBookingParams } from "./BookingInterfaces";

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
  room: {
    id: number;
    name: string;
    bg_color: string;
    txt_color: string;
    presence: boolean;
    created_at: string;
    updated_at: string;
  };
  user: {
    id: number;
    auth_provider_id: number;
    picture: string;
    name: string;
    email: string;
  };
}

export interface IGetBookingParams {
  params: {
    id: number;
  };
}

export interface IGetBookingsParams {
  query: {
    start?: { lte: string } | { gte: string };
    end?: { gte: string } | { lte: string };
    roomId?: { eq: number };
    order?: string;
    page?: number;
    pageSize?: number;
  };
}

export interface IDeleteBookingParams {
  params: {
    id: number;
  };
}

// Interface base for ICreateBooking & IUpdateBooking
export interface IBookingRequest {
  id?: string;
  description: string;
  roomId: number;
  start: string;
  end: string;
  attendees: string[];
  userId: number;
}

export interface IBookingDTO {
  description: string;
  room_id: number;
  start: string;
  end: string;
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

export interface IUpdateBookingDTO {
  params: {
    id: number;
  };
  body: IBookingDTO;
}
