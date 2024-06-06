export interface ICarOptionDetails {
  configs: ICarConfigDetails[];
  towHitch: boolean;
  yoke: boolean;
}

export interface ICarConfigDetails {
  id: number;
  description: string;
  range: number;
  speed: number;
  price: number;
}
