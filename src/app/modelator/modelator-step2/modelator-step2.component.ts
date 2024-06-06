import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { ICarConfigDetails, ICarOptionDetails } from "../../core/car-option-details.model";
import { TeslaCarsClient } from "../../core/tesla-cars.client";
import { CarBuilderService } from "../shared/car-builder.service";
import { IClientCar } from "../shared/client-car.model";

@Component({
  selector: 'app-modelator-step2',
  standalone: true,
  templateUrl: './modelator-step2.component.html',
  imports: [CommonModule, FormsModule],
})
export class ModelatorStep2Component implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  private _clientCar!: Readonly<IClientCar>;

  opts?: ICarOptionDetails;
  configDetails?: ICarConfigDetails;

  carImageUrl: string = "";

  get selectedConfig(): number | null {
    return this._clientCar.configId;
  }
  set selectedConfig(value: number | null) {
    this._builder.setCarConfig(value);
    this.configDetails = this.opts?.configs.find(c => c.id === value);
  }

  get selectedTow(): boolean {
    return this._clientCar.towHitch;
  }
  set selectedTow(value: boolean) {
    this._builder.setOptionTow(value);
  }

  get selectedYoke(): boolean {
    return this._clientCar.yoke;
  }
  set selectedYoke(value: boolean) {
    this._builder.setOptionYoke(value);
  }

  constructor(private _client: TeslaCarsClient, private _builder: CarBuilderService) {
  }

  ngOnInit(): void {
    // we don't have requirements to make this component reactive to model and color changes
    // Angular will always reload the component as we enter it as we use routes.
    // otherwise subscribe to _builder.clientCar$ for all these logic.
    this._clientCar = this._builder.clientCar;

    // pre-condition: model and color selected (we shouldn't be here anyway)
    const validModel: boolean = !!this._clientCar.modelCode && !!this._clientCar.colorCode;
    if (!validModel) {
      return;
    }

    console.log(`Received step2 info: ${this._clientCar.configId}/${this._clientCar.towHitch}/${this._clientCar.yoke}`);
    this.carImageUrl = this._client.getModelImageUrl(this._clientCar.modelCode!, this._clientCar.colorCode!);
    this.selectedTow = this._clientCar.towHitch;
    this.selectedYoke = this._clientCar.yoke;

    // Retrieve from backend available options
    this._subs.push(
      this._client.getConfigs(this._clientCar.modelCode!).subscribe(result => {
        this.opts = result;

        // set the current config once we have all the select options
        this.selectedConfig = this._clientCar.configId;
      }));
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
  }
}
