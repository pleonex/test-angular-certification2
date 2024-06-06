export interface ICarModelDetails {
  code: string;
  description: string;
  colors: ICarColorDetails[];
}

export interface ICarColorDetails {
  code: string;
  description: string;
  private: number;
}
