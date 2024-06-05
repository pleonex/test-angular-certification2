import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ICarColorModel, ICarModel } from "../clients/car-model";
import { ICar } from "../clients/car";
import { ICarOption } from "../clients/car-options";

@Injectable({
  providedIn: 'root',
})
export class CarBuilderService {
  private _car: ICar;

  private _step2Validity = new BehaviorSubject<boolean>(false);
  private _step3Validity = new BehaviorSubject<boolean>(false);
  private _carSubject: BehaviorSubject<ICar>;

  step2Validity$ = this._step2Validity.asObservable();
  step3Validity$ = this._step3Validity.asObservable();
  car: Readonly<ICar>;
  car$: Observable<ICar>;

  constructor() {
    const carJson = window.localStorage.getItem("car");
    this._car = carJson ? JSON.parse(carJson) : {
      model: null,
      color: null,
    };

    this.car = this._car;
    this._carSubject = new BehaviorSubject<ICar>(this._car);
    this.car$ = this._carSubject.asObservable();
    this.updateStepsValidity();
  }

  isStepValid(step: number): boolean {
    if (step === 2 && this._step2Validity.value) {
      return true;
    } else if (step === 3 && this._step3Validity.value) {
      return true;
    } else {
      return false;
    }
  }

  setCarModel(model: ICarModel | null): void {
    this._car.model = model;
    this._car.color = null;
    this._car.option = null;
    this.save();

    this._carSubject.next(this._car);
    this.updateStepsValidity();
  }

  setCarColor(color: ICarColorModel | null): void {
    this._car.color = color;
    this.save();

    this._carSubject.next(this._car);
    this.updateStepsValidity();
  }

  setCarOption(opts: ICarOption | null): void {
    this._car.option = opts;
    this.save();

    this._carSubject.next(this._car);
    this.updateStepsValidity();
  }

  private updateStepsValidity(): void {
    const step1Valid: boolean = !!this._car.model && !!this._car.color;
    this._step2Validity.next(step1Valid);

    const step2Valid: boolean = !!this._car.option;
    this._step3Validity.next(step1Valid && step2Valid);
  }

  private save() {
    window.localStorage.setItem("car", JSON.stringify(this._car));
  }
}
