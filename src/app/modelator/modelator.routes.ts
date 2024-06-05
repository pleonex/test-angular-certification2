import { Routes } from "@angular/router";
import { ModelatorStep1Component } from "./modelator-step1.component";
import { ModelatorStep2Component } from "./modelator-step2.component";
import { ModelatorStep3Component } from "./modelator-step3.component";

export const MODELATOR_ROUTES: Routes = [
  { path: "step1", component: ModelatorStep1Component },
  { path: "step2", component: ModelatorStep2Component },
  { path: "step3", component: ModelatorStep3Component },
  { path: "", redirectTo: "step1", pathMatch: "full" },
];
