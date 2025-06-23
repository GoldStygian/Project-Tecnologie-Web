import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth-service/auth-service';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  submitted = false;

  signupForm = new FormGroup({
    user: new FormControl('', [
      Validators.required
    ]),
    pass: new FormControl('', [
      Validators.required, 
      Validators.minLength(4), 
      Validators.maxLength(16)])
  })
  
  handleSignup() {
    this.submitted = true;
    if(this.signupForm.invalid){
      this.toastr.error("Credenziali non valide");
    } else {
      this.restService.signup({
        usr: this.signupForm.value.user as string,
        pwd: this.signupForm.value.pass as string,
      }).subscribe({
        next: (user) => {
          this.toastr.success(`Registrazione effettuata con successo, effettua ora il login`,`Benvenuto ${this.signupForm.value.user}!`);
          setTimeout(() => {this.router.navigateByUrl("/login")}, 10);
        },
        error: (err) => {
          console.log(err.status);
          if (err.status === 409) {
            this.toastr.error("Username già esistente, scegli un altro username");
          } else {
            this.toastr.error("Errore durante la registrazione. Inserisci username e password validi");
          }
        },
      })
    }
  }
}
