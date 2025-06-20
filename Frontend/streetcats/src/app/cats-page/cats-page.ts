import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Cat } from '../models/Cat.type';
import * as L from 'leaflet';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
import { ToastrService } from 'ngx-toastr';
import { loading } from '../models/loading.type';
import { Loading } from '../_utils/loading/loading';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cats-page',
  standalone: true,
  imports: [CommonModule, Loading, RouterLink],
  templateUrl: './cats-page.html',
  styleUrl: './cats-page.scss'
})
export class CatsPage implements OnInit {

  restService = inject(RestBackendService);
  router = inject(Router);
  toastr = inject(ToastrService);
  cats: Cat[] = [];
  loading: loading = "false";

  sleeps(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ngOnInit(): Promise<void> {
    // await setTimeout((): void => { console.log("end timeout") }, 10);
    this.loading = "loading";
    await this.sleeps(1000);
    this.restService.getCats().subscribe({
      next: (data) => {
        this.toastr.success('Cats loaded successfully!');
        console.log(data);
        this.cats = data;
        this.loadMap();
        this.loading = "loaded";
      },
      error: (err) => {
        this.toastr.error('Error loading cats!');
        console.log(err);
        this.loading = "error";
      },
    });
  }

  loadMap() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'leaflet/marker-icon-2x.png',
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    });

    const map = L.map('map').setView([40, 14], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(map);

    for (const cat of this.cats) {
      const lat = Number(cat.latitudine);
      const lng = Number(cat.longitudine);
      const formattedDate = cat.createdAt ? 
        new Date(cat.createdAt).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        }) : 'Data non disponibile';
      
      const popupContent = `
        <div style="
          font-family: sans-serif;
          width: 200px;
          overflow: hidden;
        ">
          <div style="text-align: center; padding: 10px;">
            <p id="cat-link-${cat.id}" style="margin: 0; cursor: pointer;">${cat.title}</p>
            <img
              src="${this.restService.mediaUrl}${cat.photo}"
              alt="${cat.title}"
              style="
                display: block;
                margin: 0 auto 0;
                width: 100%;
                height: auto;
                border-radius: 5px;
              "
            />
          </div>
          <div style="padding: 10px; text-align: left;">
            <p style="margin: 1px 1px;"><strong>Utente:</strong> ${cat.userName}</p>
            <p style="margin: 1px 1px;">🕒 ${formattedDate}</p>
            <p style="margin: 1px 1px;"><img src="./icons/longitude.png" style="width: 20px; height: 20px; alt="Latitudine Icon" /> lng ${lng}</p>
            <p style="margin: 1px 1px;"><img src="./icons/latitude.png" style="width: 20px; height: 20px; margin: 0 0; alt="Latitudine Icon" /> lat ${lat}</p>
          </div>
        </div>
      `;

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(popupContent)
        // .openPopup() // Per aprire il popup automaticamente
        .on('popupopen', () => {
          const link = document.getElementById(`cat-link-${cat.id}`);
          link?.addEventListener('click', () => {
            this.router.navigate(['/cats', cat.id]);
          });
        });
    }

    // Popup per mostrare le coordinate
    var popup = L.popup();
    function onMapClick(e: L.LeafletMouseEvent) {
      popup
        .setLatLng(e.latlng)
        .setContent("Longitudine: " + e.latlng.lng + "<br>" + "Latitudine: " + e.latlng.lat)
        .openOn(map);
    }
    map.on('click', onMapClick);

  }

}
