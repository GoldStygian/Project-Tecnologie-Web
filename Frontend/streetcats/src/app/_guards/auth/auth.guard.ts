import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../_services/auth-service/auth-service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  console.log("[authGuard] user is auth? ", authService.isUserAuthenticated());
  if(authService.isUserAuthenticated()){
    return true;
  } else {
    toastr.warning("Please, login to access this feature", "Unauthorized!");
    return router.parseUrl("/login"); //return a UrlTree
  }
};
