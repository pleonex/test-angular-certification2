import { Component, OnDestroy, OnInit, Signal, WritableSignal, computed, effect, signal } from "@angular/core";
import { TeslaCarsClient } from "../clients/tesla-cars.client";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { ICarColorModel, ICarModel } from "../clients/car-model";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-modelator-step1',
  standalone: true,
  templateUrl: './modelator-step1.component.html',
  imports: [CommonModule, FormsModule]
})
export class ModelatorStep1Component implements OnInit, OnDestroy {
  private _clientSub?: Subscription;

  models: ICarModel[] = [];
  selectedModel: WritableSignal<ICarModel | null> = signal<ICarModel | null>(null);

  availableColors: Signal<ICarColorModel[] | undefined> = computed(
    () => this.selectedModel()?.colors);
  selectedColor: Signal<ICarColorModel | null> = signal<ICarColorModel | null>(null);

  carImageUrl: Signal<string> = computed(() =>
    (this.selectedModel() && this.selectedColor())
      ? this._client.getModelImageUrl(this.selectedModel()!.code, this.selectedColor()!.code)
      : "");

  constructor(private _client: TeslaCarsClient) {
    effect(() => console.log(this.selectedModel()));
  }

  ngOnInit(): void {
    this._clientSub = this._client.getModels().subscribe(result => this.models = result);
  }

  ngOnDestroy(): void {
    this._clientSub?.unsubscribe();
  }

  modelSelected(model: ICarModel | null) : void {
    this.selectedModel.set(model);
  }
}
