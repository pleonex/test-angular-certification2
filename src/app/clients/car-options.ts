export interface ICarOption {
  configs: ICarConfig[];
  towHitch: boolean;
  yoke: boolean;
}

export interface ICarConfig {
  id: number;
  description: string;
  range: number;
  speed: number;
  price: number;
}
