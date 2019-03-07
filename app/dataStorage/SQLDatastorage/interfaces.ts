export interface IQuery {
  where?: string;
  page?: number;
  pageSize?: number;
  order?: string;
  include?: string;
}

export interface IBooking {
  id?: number;
  description: string;
  start: Date;
  end: Date;
  eventId: string;
  roomId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
  bookingAttendee: Array<any>;
}
