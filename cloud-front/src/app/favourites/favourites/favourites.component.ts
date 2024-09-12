import { Component, OnInit } from '@angular/core';
import { FavouritesCardComponent } from '../favourites-card/favourites-card.component';
import { CommonModule } from '@angular/common';
import { AxiosService } from '../../axios.service';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [FavouritesCardComponent, CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit {

  favourites: any[] = [];

  constructor(private axiosService: AxiosService) {}

  ngOnInit(): void {
    
    this.axiosService.request(
      "GET",
      "/favourites?userEmail=" + this.axiosService.getEmail(),
      null,
      "application/json"
    ).then(
      response => {
        this.favourites = response.data.data;
      }
    );

  }

}
