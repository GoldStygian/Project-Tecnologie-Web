import { Component, OnInit } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-whoiam',
  imports: [MarkdownModule],
  templateUrl: './whoiam.html',
  styleUrl: './whoiam.scss'
})
export class Whoiam implements OnInit{

  data: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('file/data.md', { responseType: 'text' }).subscribe({
      next: (markdown) => {
        this.data = markdown;
        console.log(this.data);
      },
      error: (err) => {
        console.error("Errore nel caricamento del file Markdown:", err);
      }
    });
  }

}
