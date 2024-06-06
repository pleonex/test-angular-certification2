import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { FormsModule } from "@angular/forms";
import { TeslaCarsClient } from "../../core/tesla-cars.client";
import { CarBuilderService } from "../shared/car-builder.service";
import { ICarColorDetails, ICarModelDetails } from "../../core/car-model-details.model";

@Component({
  selector: 'app-modelator-step1',
  standalone: true,
  templateUrl: './modelator-step1.component.html',
  imports: [CommonModule, FormsModule]
})
export class ModelatorStep1Component implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  private _selectedModel: string | null = null;
  private _selectedColor: string | null = null;

  models: ICarModelDetails[] = [];
  availableColors: ICarColorDetails[] = [];
  carImageUrl: string = "";

  get selectedModel(): string | null {
    return this._selectedModel;
  }
  set selectedModel(value: string | null) {
    this._selectedModel = value;
    this._builder.setCarModel(value);
  }

  get selectedColor(): string | null {
    return this._selectedColor;
  }
  set selectedColor(value: string | null) {
    this._selectedColor = value;
    this._builder.setCarColor(value);
  }

  constructor(private _client: TeslaCarsClient, private _builder: CarBuilderService) {
  }

  ngOnInit(): void {
    this._subs.push(
      this._client.getModels().subscribe(result => {
        this.models = result;

        // After receiving the list of models from the backend (one-time only)
        // we can subscribe to our car builder status as we will have the selects filled of options.
        this._subs.push(this._builder.clientCar$.subscribe(c => {
          console.log(`"Received step1 info ${c.modelCode}/${c.colorCode}`);
          this.selectedModel = c.modelCode;

          if (c.modelCode) {
            const modelDetails = this.models.find(m => m.code === c.modelCode);
            this.availableColors = modelDetails?.colors ?? [];
            this.selectedColor = c.colorCode;
          } else {
            this.availableColors = [];
          }

          this.carImageUrl = this.getCarImageUrl();
        }));
    }));
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
  }

  getCarImageUrl(): string {
    if (this.selectedModel && this.selectedColor) {
      return this._client.getModelImageUrl(this.selectedModel, this.selectedColor);
    }

    return "";
  }
}
