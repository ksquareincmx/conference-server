import { IRoomSlackFormat } from "./RoomInterfaces";
import { IHour } from "./HourInterfaces";

interface IRoomInfo {
  id: number | string;
  name: string;
}

interface IOpenDialogDefaultValues {
  date: string;
  room: IRoomInfo;
}

export interface IDialogParams {
  type: string;
  defaultValues?: IOpenDialogDefaultValues;
}

export interface IOpenDialogConfig {
  trigger_id: string;
  dialogParams: IDialogParams;
}

export interface IDialogForAppointmentParams {
  roomsFormated: IRoomSlackFormat[];
  defaultValues: IOpenDialogDefaultValues;
}

export interface IDialogSubmitResponseParams {
  toURL: string;
  responseContent: IDateRoomConfirmationInfo | IAppointmentInfo;
}

export interface IAppointmentInfo {
  slackUserName: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  attendees: Array<string> | null;
}

export interface IDateRoomConfirmationInfo {
  date: string;
  room: IRoomInfo;
  availableHours: IHour[];
}

export interface IMessageParams {
  toURL: string;
  text: string;
  type: string;
}

export interface IBookingDateInfo {
  date: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}
