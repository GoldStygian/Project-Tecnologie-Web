import { Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend';
import L from 'leaflet';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
// @ts-ignore
import Editor from '@toast-ui/editor'

@Component({
  selector: 'app-add-cat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MarkdownModule],
  templateUrl: './add-cat.html',
  styleUrl: './add-cat.scss'
})
export class AddCat implements AfterViewInit {

  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  editor!: Editor;
  submitted = false;

  catForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    longitudine: new FormControl('', [Validators.required, Validators.min(-180), Validators.max(180)]),
    latitudine: new FormControl('', [Validators.required,Validators.min(-90), Validators.max(90)]),
    description: new FormControl('# Descrizione in formato markdown', [Validators.required])
  });
  selectedFile!: File;

  @ViewChild('editorContainer', { static: true }) editorRef!: ElementRef;
  ngAfterViewInit(): void {

    this.configureMap();
    
    this.configureEditor();
    
  }

  configureMap(){
    const map2 = L.map('map2').setView([40, 14], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map2);

    const popup = L.popup();
    map2.on('click', (e: L.LeafletMouseEvent) => {
      popup
        .setLatLng(e.latlng)
        .setContent("Longitudine: " + e.latlng.lng + "<br>" + "Latitudine: " + e.latlng.lat)
        .openOn(map2);

      // Bonus: aggiorna il form
      this.catForm.patchValue({
        latitudine: String(e.latlng.lat),
        longitudine: String(e.latlng.lng)
      });
    });
  }

  configureEditor() {
    this.editor = new Editor({
      el: this.editorRef.nativeElement,
      height: '300px',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      initialValue: '# Descrizione in formato markdown',
    });

    this.editor.on('change', () => {
      const rawMarkdown = this.editor.getMarkdown();

      // Elimina spazi, tab, righe vuote ecc.
      const cleaned = rawMarkdown.replace(/\s/g, '');

      const isEmpty = cleaned.length === 0;

      if (!isEmpty) {
        this.catForm.patchValue({
          description: rawMarkdown
        });
      } else {
        this.catForm.patchValue({
          description: '' // oppure null
        });
      }
    });
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  handleAddCat(): void {
    this.submitted = true;
    if (this.catForm.invalid) {
      this.toastr.error("Compila tutti i campi e seleziona un'immagine", "Form non valido");
      return;
    }

    const fd = new FormData();
    fd.append('title', this.catForm.value.title as string);
    fd.append('longitudine', String(this.catForm.value.longitudine));
    fd.append('latitudine', String(this.catForm.value.latitudine));
    fd.append('immagine', this.selectedFile);
    fd.append('description', this.catForm.value.description as string);

    this.restService.addCat(fd).subscribe({
      next: () => {
        this.toastr.success("Cat added successfully", "Success");
        this.router.navigateByUrl("/cats");
      },
      error: (err) => {
        this.toastr.error(err?.error?.message, "Error");
      }
    });
  }

}
