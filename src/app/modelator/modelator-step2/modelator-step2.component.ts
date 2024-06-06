import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { ICarOptionDetails } from "../../core/car-option-details.model";
import { TeslaCarsClient } from "../../core/tesla-cars.client";
import { CarBuilderService } from "../shared/car-builder.service";

@Component({
  selector: 'app-modelator-step2',
  standalone: true,
  templateUrl: './modelator-step2.component.html',
  imports: [CommonModule, FormsModule],
})
export class ModelatorStep2Component implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  private _selectedConfig: number | null = null;

  opts?: ICarOptionDetails;

  get selectedConfig(): number | null {
    return this._selectedConfig;
  }
  set selectedConfig(value: number | null) {
    this._selectedConfig = value;
  }

  constructor(private _client: TeslaCarsClient, private _builder: CarBuilderService) {
  }

  ngOnInit(): void {
    // Get last car config for query
    this._subs.push(
      this._client.getConfigs("S").subscribe(result => {
        this.opts = result;

        this._subs.push(this._builder.clientCar$.subscribe(c => {
          console.log(`Received step2 info: ${c.configId}/${c.towHitch}/${c.yoke}`);
          this.selectedConfig = c.configId;
        }));
    }));
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
  }
}
