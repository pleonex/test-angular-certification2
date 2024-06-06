import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription, forkJoin } from "rxjs";
import { IClientCar } from "../shared/client-car.model";
import { TeslaCarsClient } from "../../core/tesla-cars.client";
import { CarBuilderService } from "../shared/car-builder.service";
import { ICarColorDetails, ICarModelDetails } from "../../core/car-model-details.model";
import { ICarConfigDetails } from "../../core/car-option-details.model";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-modelator-step3',
  standalone: true,
  templateUrl: './modelator-step3.component.html',
  imports: [CommonModule],
})
export class ModelatorStep3Component implements OnInit, OnDestroy {
  private _clientSub?: Subscription;

  modelDetails?: ICarModelDetails;
  colorDetails?: ICarColorDetails;
  configDetails?: ICarConfigDetails;
  hasTow: boolean = false;
  hasYoke: boolean = false;
  optionsPrice: number = 0;
  totalCost: number = 0;
  carImageUrl: string = "";

  constructor(private _client: TeslaCarsClient, private _builder: CarBuilderService) {
  }

  ngOnInit(): void {
    // Expected to re-load the component when some car setting change
    // otherwise subscribe to observable
    const clientCar: Readonly<IClientCar> = this._builder.clientCar;

    // precondition
    const hasAllOptions: boolean = !!clientCar.modelCode && !!clientCar.colorCode && !!clientCar.configId;
    if (!hasAllOptions) {
      return;
    }

    this.hasTow = clientCar.towHitch;
    this.hasYoke = clientCar.yoke;

    this.carImageUrl = this._client.getModelImageUrl(clientCar.modelCode!, clientCar.colorCode!);

    const modelDescriptions$ = this._client.getModels();
    const optsDescription$ = this._client.getConfigs(clientCar.modelCode!);
    this._clientSub = forkJoin({ model: modelDescriptions$, opts: optsDescription$ })
      .subscribe(details => {
        this.modelDetails = details.model.find(m => m.code === clientCar.modelCode);
        this.colorDetails = this.modelDetails?.colors.find(c => c.code === clientCar.colorCode);
        this.configDetails = details.opts.configs.find(c => c.id === clientCar.configId);

        this.optionsPrice = this._client.getOptionsPrice();
        if (this.colorDetails && this.configDetails) {
          this.totalCost = this.colorDetails.price + this.configDetails.price;
          this.totalCost += this.hasTow ? this.optionsPrice : 0;
          this.totalCost += this.hasYoke ? this.optionsPrice : 0;
        }
      });
  }

  ngOnDestroy(): void {
    this._clientSub?.unsubscribe();
  }
}
