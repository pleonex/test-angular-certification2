import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Subscription, filter, map } from "rxjs";

@Component({
  selector: 'app-modelator-shell',
  templateUrl: './modelator-shell.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class ModelatorShellComponent implements OnDestroy {
  private _routeSub?: Subscription;

  currentStep: number = 0;

  constructor(private _router: Router, private _route: ActivatedRoute) {
    this._routeSub = _router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => e as NavigationEnd),
        filter(e => e.urlAfterRedirects.startsWith("/modelator/step"))
      )
      .subscribe(e => this.currentStep = Number(e.urlAfterRedirects['/modelator/step'.length]));
  }

  ngOnDestroy(): void {
    this._routeSub?.unsubscribe();
  }

  navigateToStep(stepId: number): void {
    this._router.navigate([`step${stepId}`], { relativeTo: this._route});
  }
}
