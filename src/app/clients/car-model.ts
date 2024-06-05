export interface ICarModel {
  code: string;
  description: string;
  colors: ICarColorModel[];
}

export interface ICarColorModel {
  code: string;
  description: string;
  private: number;
}
