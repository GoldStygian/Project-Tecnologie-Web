import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Cat } from '../models/Cat.type';
import * as L from 'leaflet';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
// import { FlashMessageService } from '../_services/flash-message/flash-message';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cats-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cats-page.html',
  styleUrl: './cats-page.scss'
})
export class CatsPage implements OnInit {

  restService = inject(RestBackendService);
  // flash = inject(FlashMessageService);
  toastr = inject(ToastrService);
  cats: Cat[] = [];
  loaded: boolean = false;

  // setTimeout(() => {this.router.navigateByUrl("/cats")}, 10);

  ngOnInit() {
    this.restService.getCats().subscribe({
      next: (data) => {
        this.toastr.success('Cats loaded successfully!');
        console.log(data);
        this.cats = data;
        this.loadMap();
        this.loaded = true;
      },
      error: (err) => {
        this.toastr.error('Error loading cats!');
        console.log(err);
      },
      complete: () => {
        console.log('Cats loaded');
      }
    });
  }

  loadMap() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'leaflet/marker-icon-2x.png',
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    });
    // 1. Crea la mappa nel div #map, centrata su Napoli
    const map = L.map('map').setView([40.8518, 14.2681], 13);

    // 2. Aggiungi layer di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(map);

    // Puoi aggiungere marker, popup, ecc.
    for (const cat of this.cats) {
      const lat = Number(cat.latitudine);
      const lng = Number(cat.longitudine);
      L.marker([lng, lat])
        .addTo(map)
        .bindPopup(cat.title)
        .openPopup();
    }
    // L.marker([40.8518, 14.2681])
    //   .addTo(map)
    //   .bindPopup('Naples Cat!')
    //   .openPopup();

    // Popup per mostrare le coordinate
    var popup = L.popup();
    function onMapClick(e: L.LeafletMouseEvent) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }
    map.on('click', onMapClick);

  }

}
