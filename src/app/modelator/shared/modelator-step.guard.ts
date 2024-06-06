import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CarBuilderService } from './car-builder.service';

export function getModelatorStepGuard(step: number): CanActivateFn {
  return () => {
    const isStepValid = inject(CarBuilderService).isStepValid(step);
    if (!isStepValid) {
      inject(Router).navigate(["/"]);
    }

    return isStepValid;
  }
}
