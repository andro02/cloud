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

  constructor(public axiosService: AxiosService, private router: Router) {}

  logOut(): void {
    this.axiosService.setAuthToken(null);
    this.router.navigate(['auth/login']);
  }

}
