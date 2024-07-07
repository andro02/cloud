import { Component } from '@angular/core';
import { AxiosService } from '../../axios.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FilmViewComponent } from '../film-view/film-view.component';
import {Buffer} from 'buffer';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilmViewComponent],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css'
})
export class FilmsComponent {
  films: any = [];

  constructor(private axiosService: AxiosService){}
  ngOnInit() {

    this.axiosService.request(
      "GET",
      "https://f0ujn573qg.execute-api.eu-central-1.amazonaws.com//film",
      null,
      {}
    ).then(
      response => {
        this.films = response.data.data;
      }
    );

  }

  download(filename: any): void {

    const query = "?filename=" + filename['filename'];

    this.axiosService.request(
      "GET",
      "https://f0ujn573qg.execute-api.eu-central-1.amazonaws.com/downloadFilm" + query,
      null,
      {}
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

