import { Injectable } from '@angular/core';
import axios, { Method } from 'axios'

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() {
    axios.defaults.baseURL = '';
    //axios.defaults.headers.post['Content-Type'] = 'application/json';
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