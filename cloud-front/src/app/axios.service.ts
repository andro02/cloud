import { Injectable } from '@angular/core';
import axios, { Method } from 'axios'
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() {
    window.localStorage.removeItem("auth_token");
    axios.defaults.baseURL = 'https://f0ujn573qg.execute-api.eu-central-1.amazonaws.com';
    //axios.defaults.baseURL = 'http://localhost:3000';
    //axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  getUser(): any | null {
    const helper = new JwtHelperService();
    if (this.getAuthToken() != undefined)
    {
      const decodedToken = helper.decodeToken(this.getAuthToken()!);
      return decodedToken;
    }
    return null;
  }

  getEmail(): string | null {
    const user = this.getUser();
    if (user != null)
    {
      return user["username"];
    }
    return "";
  }

  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  setAuthToken(token: string | null): void {
    if (token !== null) {
      window.localStorage.setItem("auth_token", token);
    } else {
      window.localStorage.removeItem("auth_token");
    }
  }

  request(method: string, url: string, data: any, headers: any): Promise<any> {

    return axios({
      method: method as Method,
      url: url,
      data: data,
      headers: headers
    });

  }

}