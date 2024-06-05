import { Routes } from "@angular/router";
import { ModelatorStep1Component } from "./modelator-step1.component";
import { ModelatorStep2Component } from "./modelator-step2.component";
import { ModelatorStep3Component } from "./modelator-step3.component";
import { getModelatorStepGuard } from "./modelator-step.guard";

export const MODELATOR_ROUTES: Routes = [
  { path: "step1", component: ModelatorStep1Component },
  { path: "step2", component: ModelatorStep2Component, canActivate: [getModelatorStepGuard(2)] },
  { path: "step3", component: ModelatorStep3Component, canActivate: [getModelatorStepGuard(3)] },
  { path: "", redirectTo: "step1", pathMatch: "full" },
];
