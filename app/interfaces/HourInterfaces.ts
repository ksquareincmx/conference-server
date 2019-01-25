interface IHour {
  start: Date;
  end: Date;
}

export interface IHourResponse {
  hours: IHour[];
}

export interface IGetHourParams {
  params: {
    id: number;
  };
}
