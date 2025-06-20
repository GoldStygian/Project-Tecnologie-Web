import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth-service/auth-service';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  submitted = false;

  loginForm = new FormGroup({
    user: new FormControl('', [
      Validators.required
    ]),
    pass: new FormControl('', [
      Validators.required, 
      Validators.minLength(4), 
      Validators.maxLength(16)])
  })
  
  handleLogin() {
    this.submitted = true;
    if(this.loginForm.invalid){
      this.toastr.error("Credenziali non valide");
    } else {
      this.restService.login({
        usr: this.loginForm.value.user as string,
        pwd: this.loginForm.value.pass as string,
      }).subscribe({
        next: (token) => {
          this.authService.updateToken(token).then(() => {
            this.toastr.success(`Login effettuato con successo`,`Benvenuto ${this.loginForm.value.user}!`);
            setTimeout(() => {this.router.navigateByUrl("/cats")}, 10);
          });
        },
        error: (err) => {
          this.toastr.error("Please, insert a valid username and password", "Oops! Invalid credentials");
        },
      })
    }
  }
}
