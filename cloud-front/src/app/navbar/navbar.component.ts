import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AxiosService } from '../axios.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  notifications: any[] = [];

  constructor(public axiosService: AxiosService, private router: Router) {

    this.axiosService.request(
      "GET",
      "/notifications?userEmail" + this.axiosService.getEmail(),
      null,
      "application/json"
    ).then(
      response => {
        const data = response.data.body.data
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          let date = data[i]["createdAt"];
          data[i]["createdAt"] = new Date(date[0], date[1] - 1, date[2], date[3], date[4]);
        }
        this.notifications = data;
        this.notifications.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    );

  }

  logOut(): void {
    this.axiosService.setAuthToken(null, null);
    this.router.navigate(['auth/login']);
  }

}
