export interface IHour {
  start: string;
  end: string;
}

export interface IHourResponse {
  hours: IHour[];
}

export interface IGetHourParams {
  params: {
    id: number;
  };
  query: {
    fromDate: Date;
  };
}
