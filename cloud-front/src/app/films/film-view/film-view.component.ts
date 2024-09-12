import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreateFavouriteModalComponent } from '../../favourites/create-favourite-modal/create-favourite-modal.component';
import { RouterLink } from '@angular/router';
import { AxiosService } from '../../axios.service';

@Component({
  selector: 'app-film-view',
  standalone: true,
  imports: [CommonModule, CreateFavouriteModalComponent, RouterLink],
  templateUrl: './film-view.component.html',
  styleUrl: './film-view.component.css'
})

export class FilmViewComponent {
  @Input() film: any = null;
  @Output() download = new EventEmitter();  
  @ViewChild(CreateFavouriteModalComponent) createFavouriteModal!: CreateFavouriteModalComponent;

  auth: AxiosService;
  actors: String[] | null = null;
  genres: String[] | null = null;
  ratings: any[] | null = null;

  constructor(public datePipe: DatePipe, private axiosService: AxiosService) {
    this.auth=axiosService
  };

  ngOnInit(): void {

    if (this.film.actors) {
      this.actors = this.film.actors.split(",").map((item: string) => item.trim());
    }

    if (this.film.actors) {
      this.genres = this.film.genre.split(",").map((item: string) => item.trim());
    }

    this.axiosService.request(
      "GET",
      "/ratings?filename=" + this.film.filename,
      null,
      "application/json"
    ).then(
      response => {
        this.ratings = response.data['data'];
        console.log(this.ratings)
      }
    );

  }

  openFavouritesDialog(name: String): void {
    if (this.createFavouriteModal) {
      this.createFavouriteModal.name = name;
      this.createFavouriteModal.openModal();
    }
  }
  rating(): void{
    const selectedRating = (document.querySelector('input[name="rating"]:checked') as HTMLInputElement)?.value;
    if(selectedRating!=null) {
      const ratingInformation = {
        'userEmail': this.axiosService.getEmail(),
        'rating': selectedRating,
        'filename': this.film.filename
      }
      
      this.axiosService.request(
        "POST",
        "/ratings",
        ratingInformation,
        "application/json"
      ).then(
        response => {
          // this.closeModal();
        }
      );
    }
  }

}
