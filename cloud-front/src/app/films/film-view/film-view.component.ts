import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreateFavouriteModalComponent } from '../../favourites/create-favourite-modal/create-favourite-modal.component';

@Component({
  selector: 'app-film-view',
  standalone: true,
  imports: [CommonModule, CreateFavouriteModalComponent],
  templateUrl: './film-view.component.html',
  styleUrl: './film-view.component.css'
})

export class FilmViewComponent {
  @Input() film: any = null;
  @Output() download = new EventEmitter();  
  @ViewChild(CreateFavouriteModalComponent) createFavouriteModal!: CreateFavouriteModalComponent;

  actors: String[] | null = null;
  genres: String[] | null = null;

  constructor(public datePipe: DatePipe) {
  };

  ngOnInit(): void {
    if (this.film.actors) {
      this.actors = this.film.actors.split(",").map((item: string) => item.trim());
    }
    if (this.film.actors) {
      this.genres = this.film.genre.split(",").map((item: string) => item.trim());
    }
  }

  openFavouritesDialog(name: String): void {
    if (this.createFavouriteModal) {
      this.createFavouriteModal.name = name;
      this.createFavouriteModal.openModal();
    }
  }

}
