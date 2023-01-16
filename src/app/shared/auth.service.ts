import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export class User {
  nom!: String
  prenom!: String
  login!: String
  role!: String
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // uri = "http://localhost:8010/api/users";
  uri = "https://api-angular.onrender.com/api/users";
  loggedIn = false;
  admin = false;
  constructor(private http: HttpClient) { }

  logIn(login: string, password: string) {
    return this.http.post<User>(this.uri + "/login", { login: login, password: password })
  }

  setLoggedIn(value: boolean) {
    this.loggedIn = value;
  }

  isLogged() {
    return this.loggedIn;
  }

  setIsAdmin(value: boolean) {
    this.admin = value;
  }

  isAdmin() {
    return this.admin;
  }
}
