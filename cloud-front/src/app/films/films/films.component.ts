import { Component, OnInit } from '@angular/core';
import { AxiosService } from '../../axios.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilmViewComponent } from '../film-view/film-view.component';
import {Buffer} from 'buffer'; 

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilmViewComponent, FormsModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css'
})
export class FilmsComponent implements OnInit{
  films: any = [];
  searchQueryFilmName = '';
  searchQueryDirector = '';
  searchQueryDescription = '';
  searchQueryActor = '';

  filteredFilms: any = [];

  genres: string[] = [
    '',
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Thriller',
    'Documentary'
  ];

  selectedGenre: string = '';

  constructor(private axiosService: AxiosService){}

  ngOnInit() {

    this.axiosService.request(
      "GET",
      "/film",
      null,
      "application/json"
    ).then(
      response => {
        this.films = response.data.data;
        this.filteredFilms = this.films;
      }
    );

  }

  ngOnChanges(): void {
    // console.log(this.searchQuery);
    this.filteredFilms = this.films;
    if(this.searchQueryFilmName != "")
      this.filteredFilms = this.filteredFilms.filter((film: any) =>
        film.filename?.toLowerCase().includes(this.searchQueryFilmName.toLowerCase())
      );
    else if(this.searchQueryDirector != "")
      this.filteredFilms = this.filteredFilms.filter((film: any) =>
        film.director?.toLowerCase().includes(this.searchQueryDirector.toLowerCase())
      );
    else if(this.searchQueryDescription != "")
      this.filteredFilms = this.filteredFilms.filter((film: any) =>
        film.description?.toLowerCase().includes(this.searchQueryDescription.toLowerCase())
      );
    else if(this.searchQueryActor!= "")
      this.filteredFilms = this.filteredFilms.filter((film: any) =>
        film.actors?.toLowerCase().includes(this.searchQueryActor.toLowerCase())
      );
    else if(this.selectedGenre!= "")
      this.filteredFilms = this.filteredFilms.filter((film: any) =>
        film.genre?.toLowerCase().includes(this.selectedGenre.toLowerCase())
      );
    else
      this.filteredFilms = this.films;
  }

  download(filename: any): void {

    const query = "?filename=" + filename['filename'];

    this.axiosService.request(
      "GET",
      "/downloadFilm" + query,
      null,
      "application/json"
    ).then(
      response => {
        const contentType = response["headers"]["Content-Type"];
        const file = Buffer.from(response.data, "base64");
        const blob = new Blob([file], { type: contentType });
        const urlObject = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = urlObject;
        link.download = filename['filename'];
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlObject);
      }
    );

  }

}

