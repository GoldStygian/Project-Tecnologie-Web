import { Component, inject, OnInit } from '@angular/core';
import { Cat } from '../models/Cat.type';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { loading } from '../models/loading.type';
import { Loading } from '../_utils/loading/loading';
import * as L from 'leaflet';

@Component({
  selector: 'app-cat-detail-page',
  standalone: true,
  imports: [Loading],
  templateUrl: './cat-detail-page.html',
  styleUrl: './cat-detail-page.scss'
})
export class CatDetailPage implements OnInit {

  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  cat!: Cat;

  loading: loading = "false";

  sleeps(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = "loading";
    await this.sleeps(2000);
    this.restService.getCat(id!).subscribe({
      next: (cat: Cat) => {
        this.cat = cat;
        this.loading = "loaded";
      },
      error: (err) => {
        this.toastr.error('Errore durante il fetch dei dati', err);
        this.loading = "loaded";
      }
    });
  }



}
