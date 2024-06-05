import { ICarColorModel, ICarModel } from "./car-model";
import { ICarOption } from "./car-options";

export interface ICar {
  model: ICarModel | null;
  color: ICarColorModel | null;
  option: ICarOption | null;
}
