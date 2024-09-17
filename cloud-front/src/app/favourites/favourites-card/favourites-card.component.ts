import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { AxiosService } from '../../axios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourites-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favourites-card.component.html',
  styleUrl: './favourites-card.component.css'
})
export class FavouritesCardComponent {

  @Input() favourite: any = null;
  auth: AxiosService;

  constructor(private axiosService: AxiosService, private router: Router) {
    this.auth = axiosService;
  }

  unsubscribe(favourite: string): void {
    this.axiosService.request(
      "DELETE",
      "/deleteFavourites?userEmail=" + this.axiosService.getEmail() + "&topicName=" + favourite,
      null,
      "application/json"
    ).then(
      response => {
        this.router.navigate(['films']);
      });
  }

}
