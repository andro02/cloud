import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-favourites-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favourites-card.component.html',
  styleUrl: './favourites-card.component.css'
})
export class FavouritesCardComponent {
  constructor(){}

  @Input() favourite: any = null;
}
