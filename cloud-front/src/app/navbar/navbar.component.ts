import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AxiosService } from '../axios.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  notifications: any[] = [];
  auth: AxiosService;

  constructor(public axiosService: AxiosService, private router: Router) {
    this.auth=axiosService
    if (this.axiosService.getRole() == 'Client') {
      this.getNotifications()
      interval(1000000).subscribe(() => {
        this.getNotifications();
      });
    }
  }

  getNotifications(): void {
    this.axiosService.request(
      "GET",
      "/notifications?userEmail=" + this.axiosService.getEmail(),
      null,
      "application/json"
    ).then(
      response => {
        const data = response.data['data'];
        for (let i = 0; i < data.length; i++) {
          let date = data[i]["createdAt"];
          data[i]["createdAt"] = this.parseDateTime(date);
          data[i]["createdAt"].setHours(data[i]["createdAt"].getHours() + 2);
          const day = String(data[i]["createdAt"].getDate()).padStart(2, '0');
          const month = String(data[i]["createdAt"].getMonth() + 1).padStart(2, '0');
          const year = data[i]["createdAt"].getFullYear();

          const hours = String(data[i]["createdAt"].getHours()).padStart(2, '0');
          const minutes = String(data[i]["createdAt"].getMinutes()).padStart(2, '0');

          data[i]["createdAt"] = `${day}.${month}.${year}. ${hours}:${minutes}`;
        }
        this.notifications = data;
        this.notifications.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    );
  }

  parseDateTime(dateTimeStr: string): Date {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
}

  logOut(): void {
    this.axiosService.setAuthToken(null, null);
    this.router.navigate(['auth/login']);
  }

}
