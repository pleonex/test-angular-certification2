import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IClientCar } from "./client-car.model";

@Injectable({
  providedIn: 'root',
})
export class CarBuilderService {
  private _storageKey = "client_car";
  private _clientCar: IClientCar;

  private _step2Validity = new BehaviorSubject<boolean>(false);
  private _step3Validity = new BehaviorSubject<boolean>(false);
  private _clientCarSubject: BehaviorSubject<Readonly<IClientCar>>;

  step2Validity$ = this._step2Validity.asObservable();
  step3Validity$ = this._step3Validity.asObservable();
  clientCar: Readonly<IClientCar>;
  clientCar$: Observable<IClientCar>;

  constructor() {
    const carJson = window.localStorage.getItem(this._storageKey);
    this._clientCar = carJson
      ? JSON.parse(carJson)
      : {
        modelCode: null,
        colorCode: null,
        configId: null,
        towHitch: false,
        yoke: false,
      } as IClientCar;

    this.clientCar = this._clientCar;
    this._clientCarSubject = new BehaviorSubject<IClientCar>(this._clientCar);
    this.clientCar$ = this._clientCarSubject.asObservable();
    this.updateStepsValidity();
  }

  isStepValid(step: number): boolean {
    if (step === 1) {
      return true; // no pre-requisites
    }

    if (step === 2) {
      return this._step2Validity.value;
    }

    if (step === 3) {
      return this._step3Validity.value;
    }

    return false;
  }

  setCarModel(modelCode: string | null): void {
    if (modelCode === this._clientCar.modelCode) {
      return;
    }

    this._clientCar.modelCode = modelCode;
    this._clientCar.colorCode = null;
    this._clientCar.configId = null;
    this._clientCar.towHitch = false;
    this._clientCar.yoke = false;
    this.saveAndNotify();
  }

  setCarColor(colorCode: string | null): void {
    if (colorCode === this._clientCar.colorCode) {
      return;
    }

    this._clientCar.colorCode = colorCode;
    this.saveAndNotify();
  }

  setCarConfig(configId: number | null): void {
    if (configId === this._clientCar.configId) {
      return;
    }

    this._clientCar.configId = configId;
    this.saveAndNotify();
  }

  setOptionTow(value: boolean): void {
    if (value === this._clientCar.towHitch) {
      return;
    }

    this._clientCar.towHitch = value;
    this.saveAndNotify();
  }

  setOptionYoke(value: boolean): void {
    if (value === this._clientCar.yoke) {
      return;
    }

    this._clientCar.yoke = value;
    this.saveAndNotify();
  }

  private saveAndNotify(): void {
    const carJson = JSON.stringify(this._clientCar);
    window.localStorage.setItem(this._storageKey, carJson);

    this._clientCarSubject.next(this._clientCar);
    this.updateStepsValidity();
  }

  private updateStepsValidity(): void {
    const step1Valid: boolean = !!this._clientCar.modelCode && !!this._clientCar.colorCode;
    this._step2Validity.next(step1Valid);

    const step2Valid: boolean = !!this._clientCar.configId;
    this._step3Validity.next(step1Valid && step2Valid);
  }
}
