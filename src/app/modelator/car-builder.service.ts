import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ICarColorModel, ICarModel } from "../clients/car-model";

@Injectable({
  providedIn: 'root',
})
export class CarBuilderService {
  private _carModel = new BehaviorSubject<ICarModel | null>(null);
  private _carColor = new BehaviorSubject<ICarColorModel | null>(null);

  carModel$ = this._carModel.asObservable();
  carColor$ = this._carColor.asObservable();

  setCarModel(model: ICarModel | null): void {
    this._carModel.next(model);
    this._carColor.next(null);
  }

  setCarColor(color: ICarColorModel | null): void {
    this._carColor.next(color);
  }
}
