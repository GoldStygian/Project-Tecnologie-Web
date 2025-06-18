import { effect, Injectable, signal, WritableSignal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthState } from '../../models/AuthState.type';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  router = inject(Router);
  toastr = inject(ToastrService);
  
  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(),
    isAuthenticated: this.verifyToken(this.getToken())
  });

  userSignal = computed(() => this.authState().user); // segnale read-only
  tokenSignal = computed(() => this.authState().token);
  isAuthenticatedSignal = computed(() => this.authState().isAuthenticated);

  constructor() {
    effect(() => {
      const token = this.authState().token;
      const user = this.authState().user;
      if (token !== null) {
        localStorage.setItem("jwt", token);
      } else {
        localStorage.removeItem("jwt");
      }
      if (user !== null) {
        localStorage.setItem("user", user);
      } else {
        localStorage.removeItem("user");
      }
    });
  }

  getToken(){
    return localStorage.getItem("jwt");
  }

  getUser(){
    return localStorage.getItem("user");
  }

  async updateToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    })
  }

  verifyToken(token: string | null): boolean {
    if(token !== null){
      try{
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if(expiration === undefined || Date.now() >= expiration * 1000){
          return false; //expiration not available or in the past
        } else {
          return true; //token not expired
        }
      } catch(error) {  //invalid token
        return false;
      }
    }
    return false;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout(){
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    this.router.navigateByUrl("/cats");
    this.toastr.success("Logout effettuato con successo", "Arrivederci!");
  }

}
