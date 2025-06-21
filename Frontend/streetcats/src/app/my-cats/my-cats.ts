import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
import { Cat } from '../models/Cat.type';
import { AuthService } from '../_services/auth-service/auth-service';
import { RouterLink } from '@angular/router';

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
  cats: Cat[] = [];
  user: string | null = null;

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user){
      this.restService.getOwnCats(this.user).subscribe({
        next: (data) => {
          this.toastr.success('Dati caricati correttamente');
          console.log(data);
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

}
