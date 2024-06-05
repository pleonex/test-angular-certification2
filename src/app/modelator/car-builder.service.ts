import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ICarColorModel, ICarModel } from "../clients/car-model";

@Injectable({
  providedIn: 'root',
})
export class CarBuilderService {
  private _step2Validity = new BehaviorSubject<boolean>(false);
  private _step3Validity = new BehaviorSubject<boolean>(false);

  private _carModel = new BehaviorSubject<ICarModel | null>(null);
  private _carColor = new BehaviorSubject<ICarColorModel | null>(null);

  step2Validity$ = this._step2Validity.asObservable();
  step3Validity$ = this._step3Validity.asObservable();
  carModel$ = this._carModel.asObservable();
  carColor$ = this._carColor.asObservable();

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
    this._carModel.next(model);
    this._carColor.next(null);
    this.resetStep2Values();
    this.updateStepsValidity();
  }

  setCarColor(color: ICarColorModel | null): void {
    this._carColor.next(color);
    this.resetStep2Values();
    this.updateStepsValidity();
  }

  private resetStep2Values(): void {
    // TODO: cleanup
  }

  private updateStepsValidity(): void {
    const step1Valid = this._carModel.value && this._carColor.value;
    if (!step1Valid) {
      this._step2Validity.next(true);
      this._step3Validity.next(false);
      return;
    }

    // TODO: check step 2 values for step 3
  }
}
