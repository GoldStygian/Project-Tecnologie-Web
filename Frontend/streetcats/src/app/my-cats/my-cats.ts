import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
import { Cat } from '../models/Cat.type';
import { AuthService } from '../_services/auth-service/auth-service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../models/User.type'

@Component({
  selector: 'app-my-cats',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-cats.html',
  styleUrl: './my-cats.scss'
})
export class MyCats implements OnInit{

  authService = inject(AuthService);
  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);
  cats: Cat[] = [];
  userData: User | null = null;
  user: string | null = null;

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user){
      this.restService.getUser(this.user!).subscribe({
        next: (userData: User) =>{
          this.userData = userData;
          this.loadOwnCat();
        },
        error: (err) => {
          this.toastr.error('Errore durante il caricamento dei dati');
          console.log(err);
        }
      })
    }
  }

  loadOwnCat(){
    if (this.userData){
      this.restService.getOwnCats(this.userData.userName).subscribe({
        next: (data) => {
          this.toastr.success('Dati caricati correttamente');
          console.log("user cat", data);
          this.cats = data;
        },
        error: (err) => {
          this.toastr.error('Errore durante il caricamento dei dati');
          console.log(err);
        },
      });
    }
  }

  delCat(catId: number): void{
    this.restService.delCat(catId).subscribe({
      next: (msg) => {
        this.toastr.success('Gatto eliminato correttamente');
        this.cats = this.cats.filter(cat => cat.id !== catId); // filtro per quelli che sono diversi da quello eliminato
        console.log(msg);
        
      },
      error: (err) => {
          this.toastr.error('Errore durante l\'eliminazione');
          console.log(err);
        },
    })
  }

  delUser(): void{
    if(this.userData){
      this.restService.delUser(this.userData?.userName).subscribe({
        next: ()=> {
          this.toastr.success("Utente eliminato con successo");
          this.authService.logout();
          this.router.navigateByUrl("/cats");
        },
        error: (err)=> { this.toastr.error(err?.error?.message)}
      })
    }
  }  

}
