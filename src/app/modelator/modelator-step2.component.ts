import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ICarOption } from "../clients/car-options";
import { Subscription } from "rxjs";
import { TeslaCarsClient } from "../clients/tesla-cars.client";
import { CarBuilderService } from "./car-builder.service";

@Component({
  selector: 'app-modelator-step2',
  standalone: true,
  templateUrl: './modelator-step2.component.html',
  imports: [CommonModule, FormsModule],
})
export class ModelatorStep2Component implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  private _availableOpts?: ICarOption;
  private _selectedOpts: ICarOption | null = null;

  get selectedOpts(): ICarOption | null {
    return this._selectedOpts;
  }
  set selectedOpts(value: ICarOption | null) {
    this._selectedOpts = value;
  }

  constructor(private _client: TeslaCarsClient, private _builder: CarBuilderService) {
  }

  ngOnInit(): void {
    //this._subs.push(this._client.getConfigs())
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
  }
}
