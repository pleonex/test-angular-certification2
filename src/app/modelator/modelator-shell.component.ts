import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Subscription, filter, map } from "rxjs";
import { CarBuilderService } from "./car-builder.service";

@Component({
  selector: 'app-modelator-shell',
  templateUrl: './modelator-shell.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class ModelatorShellComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];

  currentStep: number = 0;
  enableStep2: boolean = false;
  enableStep3: boolean = false;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _builder: CarBuilderService) {
    // We subscribe in the constructor because in OnInit would be too late for the first event.
    this._subs.push(this._router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => e as NavigationEnd),
        filter(e => e.urlAfterRedirects.startsWith("/modelator/step"))
      )
      .subscribe(e => this.currentStep = Number(e.urlAfterRedirects['/modelator/step'.length])));
  }

  ngOnInit(): void {
    this._subs.push(this._builder.step2Validity$.subscribe(v => this.enableStep2 = v));
    this._subs.push(this._builder.step3Validity$.subscribe(v => this.enableStep3 = v));
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
  }

  navigateToStep(stepId: number): void {
    this._router.navigate([`step${stepId}`], { relativeTo: this._route});
  }
}
