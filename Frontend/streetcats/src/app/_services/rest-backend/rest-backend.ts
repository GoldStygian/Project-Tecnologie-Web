import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cat } from '../../models/Cat.type';


@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  url = "http://localhost:3000";
  mediaUrl = "http://localhost:3000";
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest){
    const url = `${this.url}/auth`; 
    return this.http.post<string>(url, loginRequest, this.httpOptions);
  }

  getCats() {
    const url = `${this.url}/cats`; 
    return this.http.get<Cat[]>(url, this.httpOptions);
  }

  getCat(id: string) {
    const url = `${this.url}/cats/${id}`; 
    return this.http.get<Cat>(url, this.httpOptions);
  }

  addCat(data: FormData) {
    const url = `${this.url}/cats`; 
    return this.http.post<Cat>(url, data);
  }

  // getArtist(uuid: string) {
  //   const url = `${this.url}/artists/${uuid}`; 
  //   return this.http.get<Artist>(url, this.httpOptions);
  // }

  // getTracks(){
  //   const url = `${this.url}/tracks`; 
  //   return this.http.get<Track[]>(url, this.httpOptions);
  // }

  // uploadTracks(files: File[], variant: boolean): Observable<HttpEvent<any>> {
  //   const url = `${this.url}/tracks/`; 
  //   const formData = new FormData();
  //   // Aggiungo ogni file con chiave 'files'
  //   files.forEach(file => formData.append('files', file, file.name));
  //   // Aggiungo il parametro variant
  //   formData.append('variant', variant ? 'true' : 'false');

  //   const req = new HttpRequest('POST', url, formData, {
  //     reportProgress: true,
  //   });
  //   return this.http.request(req);
  // }

}

export interface AuthRequest {
  usr: string, 
  pwd: string
}