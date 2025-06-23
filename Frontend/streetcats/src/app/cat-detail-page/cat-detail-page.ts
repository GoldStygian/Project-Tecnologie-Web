import { Component, inject, OnInit } from '@angular/core';
import { Cat } from '../models/Cat.type';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { loading } from '../models/loading.type';
import { Loading } from '../_utils/loading/loading';
import { MarkdownModule } from 'ngx-markdown';
import * as L from 'leaflet';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth-service/auth-service';

@Component({
  selector: 'app-cat-detail-page',
  standalone: true,
  imports: [Loading, MarkdownModule, ReactiveFormsModule],
  templateUrl: './cat-detail-page.html',
  styleUrl: './cat-detail-page.scss'
})
export class CatDetailPage implements OnInit {

  restService = inject(RestBackendService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cat!: Cat;

  loading: loading = "false";

  showCommentForm: boolean = false;

  commentForm = new FormGroup({
    content: new FormControl('', [Validators.required, Validators.maxLength(250)]),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = "loading";
    this.restService.getCat(id!).subscribe({
      next: (cat: Cat) => {
        this.cat = cat;
        this.loading = "loaded";
        setTimeout(() => {
          this.loadMap(); // nota in basso
          this.cat.createdAt = this.cat.createdAt ? new Date(this.cat.createdAt).toLocaleDateString('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) : 'Data non disponibile';
        }, 0);
      },
      error: (err) => {
        this.toastr.error('Errore durante il recupero dei dati');
        this.loading = "error";
      },
    });
  }

  loadMap(): void {
    console.log("When: ", this.loading);

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'leaflet/marker-icon-2x.png',
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    });

    const lat = Number(this.cat.latitudine);
    const lng = Number(this.cat.longitudine);

    const map = L.map('map3').setView([lat, lng], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`Lat: ${lat}, Lng: ${lng}`).openPopup();
  }

  handleAddComment() {

    const commentValue = this.commentForm.value.content;
    // console.log("read destructivly: ", this.commentForm.value.content);
    
    if(this.commentForm.invalid){
      this.toastr.error("Devi inserire un commento di massimo 250 caratteri");
    }else{
      if(commentValue && this.cat.id){
        this.restService.addComment(commentValue, this.cat.id).subscribe({
          next: (comment) => {
            console.log(comment)
              this.toastr.success("Commento pubblicato con successo");
              this.cat.Comments?.push(comment);
          },
          error: (err) => {
            this.toastr.error(err.message, "Commento non pubblicato");
          }
        })

        this.commentForm.reset();
        this.showCommentForm = false;
      }
    }
  }

  cancelComment() {
    this.commentForm.reset();
    this.showCommentForm = false;
  }

  toggleCommentBtn(){
    if(this.authService.isUserAuthenticated()){
      this.showCommentForm = !this.showCommentForm;
    }else{
      this.router.navigateByUrl('/login');
      this.toastr.warning("Solo gli utenti autenticati possono pubblicare commenti");
    }
  
  }
  
}

// NOTA
// Quando imposti this.loading = "loaded", Angular programma l'aggiornamento del DOM per il prossimo ciclo di rilevamento delle modifiche.
// Usando setTimeout(() => { this.loadMap(); }, 0), la chiamata a loadMap() viene posticipata alla fine della coda degli eventi, garantendo 
// che il <div id="map3"> sia presente nel DOM quando la funzione viene eseguita.
//
// con ngAvterViewInit non andava