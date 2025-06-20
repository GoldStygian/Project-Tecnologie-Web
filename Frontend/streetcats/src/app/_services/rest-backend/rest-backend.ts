import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cat } from '../../models/Cat.type';
import { Comment } from '../../models/Comment.type'

export interface AuthRequest {
  usr: string, 
  pwd: string
}

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  url = "https://localhost:3000";
  mediaUrl = "https://localhost:3000";
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

  signup(signupRequest: AuthRequest){
    const url = `${this.url}/signup`; 
    return this.http.post<string>(url, signupRequest, this.httpOptions);
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

  addComment(content: String, catId: number){
    const url = `${this.url}/cats/${catId}/comments`; 
    return this.http.post<Comment>(url, {content});
  }

}