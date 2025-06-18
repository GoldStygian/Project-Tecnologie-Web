import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend';

@Component({
  selector: 'app-add-cat',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-cat.html',
  styleUrl: './add-cat.scss'
})
export class AddCat {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);

  catForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    longitudine: new FormControl('', [Validators.required]),
    latitudine: new FormControl('', [Validators.required]),
  });
  selectedFile!: File;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  handleAddCat() {
    if (this.catForm.invalid) {
      this.toastr.error("Compila tutti i campi e seleziona un'immagine", "Form non valido");
      return;
    }

    const fd = new FormData();
    fd.append('title', this.catForm.value.title as string);
    fd.append('longitudine', String(this.catForm.value.longitudine));
    fd.append('latitudine', String(this.catForm.value.latitudine));
    // il backend multer si aspetta il campo 'immagine'
    fd.append('immagine', this.selectedFile);


    this.restService.addCat(fd).subscribe({
      next: () => {
        this.toastr.success("Cat added successfully", "Success");
        this.router.navigateByUrl("/cats");
      },
      error: (err) => {
        this.toastr.error("Failed to add cat", "Error");
      }
    });
  }

}
