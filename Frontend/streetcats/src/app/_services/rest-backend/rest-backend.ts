import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Cat } from '../../models/Cat.type';
import { User } from '../../models/User.type';
import { Comment } from '../../models/Comment.type';

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

  getUser(username: string){
    const url = `${this.url}/users`;
    const params = new HttpParams().set('username', username);
    return this.http.get<User>(url, { headers: this.httpOptions.headers,   params });
  }

  delUser(username: string){
    const url = `${this.url}/users`;
    const params = new HttpParams().set('username', username);
    return this.http.delete<void>(url, { headers: this.httpOptions.headers,   params });
  }

  getCats() {
    const url = `${this.url}/cats`; 
    return this.http.get<Cat[]>(url, this.httpOptions);
  }

  getOwnCats(username: string){
    const url = `${this.url}/cats`;
    const params = new HttpParams().set('username', username);
    return this.http.get<Cat[]>(url, { headers: this.httpOptions.headers,   params });
  }

  getCat(id: string) {
    const url = `${this.url}/cats/${id}`; 
    return this.http.get<Cat>(url, this.httpOptions);
  }

  delCat(catId: number){
    const url = `${this.url}/cats/${catId}`; 
    return this.http.delete<{ message: string}>(url, this.httpOptions);
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