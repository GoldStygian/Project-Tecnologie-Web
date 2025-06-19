/*
 * app-map.component.ts
 * Reusable Leaflet map component that emits events on map clicks and marker clicks
 */
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as L from 'leaflet';

export interface MapMarker {
  id: string | number;
  title: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  userName?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  template: `<div #mapContainer class="map-container"></div>`,
  styles: [`.map-container { width: 100%; height: 100%; }`,],
})
export class LeafletMap implements OnInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  @Input() center: { lat: number; lng: number } = { lat: 40, lng: 14 };
  @Input() zoom = 5;
  @Input() markers: MapMarker[] = [];

  @Output() mapClick = new EventEmitter<{ lat: number; lng: number }>();
  @Output() markerClick = new EventEmitter<string | number>();

  private map!: L.Map;
  private markerLayer = L.layerGroup();

  ngOnInit() {
    // Initialize map
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.center.lat, this.center.lng],
      this.zoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );

    // Layer for markers
    this.markerLayer.addTo(this.map);

    // Map click event
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.mapClick.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    // Initial markers
    this.renderMarkers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['markers'] && !changes['markers'].firstChange) {
      this.renderMarkers();
    }
    if (changes['center'] && this.map) {
      this.map.setView([this.center.lat, this.center.lng], this.zoom);
    }
  }

  ngOnDestroy() {
    this.map.off();
    this.map.remove();
  }

  private renderMarkers() {
    this.markerLayer.clearLayers();

    this.markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng]);

      const date = m.createdAt
        ? new Date(m.createdAt).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Data non disponibile';

      const popupContent = `
        <div style="font-family: sans-serif; width:200px;">
          <p style="cursor:pointer; margin:0; text-align:center;" id="marker-${m.id}">${m.title}</p>
          ${m.photoUrl ? `<img src="${m.photoUrl}" alt="${m.title}" style="width:100%; height:auto; border-radius:5px; margin:5px 0;"/>` : ''}
          <small><strong>Utente:</strong> ${m.userName || '-'}<br/>🕒 ${date}</small>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const el = document.getElementById(`marker-${m.id}`);
        el?.addEventListener('click', () => this.markerClick.emit(m.id));
      });

      marker.addTo(this.markerLayer);
    });
  }
}
