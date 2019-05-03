export interface ISlashCommandInfo {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
}

export interface IBookingInfoForResponse {
  slackUserName: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description: string;
  attendees: Array<string> | null;
}

export interface IBookingDateInfo {
  date: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

export interface IErrorMessageParams {
  toURL: string;
  message: string;
}

interface ICommandAction {}
