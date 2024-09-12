import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { AxiosService } from '../../axios.service';

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

  constructor(private axiosService: AxiosService) {
    this.auth = axiosService;
  }

  unsubscribe(): void {
    this.axiosService.request(
      "DELETE",
      "/deleteFavourites?id=" + this.favourite.id,
      null,
      "application/json"
    ).then(
      response => {

      });
  }

}
