import { Component } from '@angular/core';
import { FavouritesCardComponent } from '../favourites-card/favourites-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [FavouritesCardComponent, CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent {

  favourites: any = ['',''];

  constructor(){}

}
