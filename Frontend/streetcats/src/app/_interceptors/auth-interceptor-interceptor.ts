import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../_services/auth-service/auth-service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const jwt = authService.getToken();

  if (jwt) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + jwt
      }
    });
    console.log("JWT found, adding to request headers:", clonedReq.headers.get('Authorization'));
    return next(clonedReq);
  }else{
    console.log("No JWT found, proceeding without authorization header.");
  }

  return next(req);
};
