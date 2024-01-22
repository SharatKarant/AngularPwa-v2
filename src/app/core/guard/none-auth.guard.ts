import { CanActivateFn } from '@angular/router';

export const noneAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
