import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeslaCarsClient } from "../clients/tesla-cars.client";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { ICarColorModel, ICarModel } from "../clients/car-model";
import { FormsModule } from "@angular/forms";
import { CarBuilderService } from "./car-builder.service";

@Component({
  selector: 'app-modelator-step1',
  standalone: true,
  templateUrl: './modelator-step1.component.html',
  imports: [CommonModule, FormsModule]
})
export class ModelatorStep1Component implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  private _selectedModel: ICarModel | null = null;
  private _selectedColor: ICarColorModel | null = null;

  models: ICarModel[] = [];
  availableColors: ICarColorModel[] = [];
  carImageUrl: string = "";

  get selectedModel(): ICarModel | null {
    return this._selectedModel;
  }
  set selectedModel(value: ICarModel | null) {
    if (value !== this._selectedModel) {
      this._selectedModel = value;
      this._builder.setCarModel(value);
    }
  }

  get selectedColor(): ICarColorModel | null {
    return this._selectedColor;
  }
  set selectedColor(value: ICarColorModel | null) {
    if (value !== this._selectedColor) {
      this._selectedColor = value;
      this._builder.setCarColor(value);
    }
  }

  constructor(private _client: TeslaCarsClient, private _builder: CarBuilderService) {
  }

  ngOnInit(): void {
    this._subs.push(this._client.getModels().subscribe(result => this.models = result));
    this._subs.push(this._builder.car$.subscribe(c => {
      this.selectedModel = c.model;
      this.availableColors = c.model?.colors ?? [];
      this.selectedColor = c.color;
      this.carImageUrl = this.getCarImageUrl();
    }));
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
  }

  getCarImageUrl(): string {
    if (this.selectedModel && this.selectedColor) {
      return this._client.getModelImageUrl(this.selectedModel.code, this.selectedColor.code);
    }

    return "";
  }
}
