import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreateFavouriteModalComponent } from '../../favourites/create-favourite-modal/create-favourite-modal.component';
import { Router, RouterLink } from '@angular/router';
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
  private modal: any;
  currentRating: number = 0;

  constructor(public datePipe: DatePipe, private axiosService: AxiosService, private router: Router) {
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
      }
    );

  }

  showRatings(name: String): void {
    for (let i = 0; i < this.ratings!.length; i++) {
      const rating = this.ratings![i].rating;
      const inputId = `ratingStar${rating}${i}${name}`;
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      inputElement.checked = true;
    }
  }

  openFavouritesDialog(name: String): void {
    if (this.createFavouriteModal) {
      this.createFavouriteModal.name = name;
      this.createFavouriteModal.openModal();
    }
  }
  rating(filename: String, name: String): void{
    const selectedRating = (document.querySelector('input[name="rating"]:checked') as HTMLInputElement)?.value;
    if(selectedRating!=null) {
      const ratingInformation = {
        'userEmail': this.axiosService.getEmail(),
        'rating': selectedRating,
        'filename': filename
      }
      
      this.axiosService.request(
        "POST",
        "/ratings",
        ratingInformation,
        "application/json"
      ).then(
        response => {
          const closeButton = document.getElementById('myModalClose'+name);
          closeButton?.click();
          this.axiosService.request(
            "GET",
            "/ratings?filename=" + this.film.filename,
            null,
            "application/json"
          ).then(
            response => {
              this.ratings = response.data['data'];
            }
          );
        }
      );
    }
  }

}
