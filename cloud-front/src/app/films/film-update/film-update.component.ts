import { DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../../axios.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-film-update',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './film-update.component.html',
  styleUrl: './film-update.component.css'
})
export class FilmUpdateComponent {
  // @Input() film: any = null;
  route: ActivatedRoute = inject(ActivatedRoute);
  filename = '';
  film: any;
  filmForm: FormGroup;
  
  constructor(public datePipe: DatePipe, private fb: FormBuilder, private axiosService: AxiosService){
    
    this.filename = String(this.route.snapshot.params['filename']);

    this.filmForm = this.fb.group({
      file: [null, Validators.compose([Validators.required])],
      fileToUpload: new FormControl(null),
      name: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
      director: [null, Validators.compose([Validators.required])],
      genre: [null, Validators.compose([Validators.required])],
      actors: [null, Validators.compose([Validators.required])],
      releaseDate: [null, Validators.compose([Validators.required])],
    })
  }

  ngOnInit(): void {
    this.axiosService.request(
      "GET",
      "/film/filename?filename=" + this.filename,
      null,
      "application/json"
    ).then(
      response => {
        this.film = response.data.data[0];

        this.filmForm.patchValue({
          file: this.film.file,
          name: this.film?.name,
          fileToUpload: this.film.file,
          description: this.film.description,
          director: this.film.director,
          genre: this.film.genre,
          actors: this.film.actors,
          releaseDate: this.film.releaseDate,
        });
      }
    );
    
  }

  onSubmit(): void {
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;

    if (form.checkValidity() !== false) {
      const uploadFileData = { ...this.filmForm.value };
      const fileToUpload = this.filmForm.controls["fileToUpload"].value;
      const filename = fileToUpload['name'];

      const query = "?filename=" + filename;

      // this.axiosService.request(
      //   "PUT",
      //   "/uploadFilm" + query,
      //   fileToUpload,
      //   "multipart/form-data"
      // );

      const fileInformation = {
        'filename': filename,
        'type': fileToUpload['type'],
        'size': fileToUpload['size'],
        'lastModifiedDate': fileToUpload['lastModifiedDate'],
        'creationDate': fileToUpload['lastModifiedDate'],
        'name': uploadFileData.name,
        'description': uploadFileData.description,
        'director': uploadFileData.director,
        'genre': uploadFileData.genre,
        'actors': uploadFileData.actors,
        'releaseDate': uploadFileData.releaseDate,
        'userEmail': this.axiosService.getEmail()
      }

      // this.axiosService.request(
      //   "PUT",
      //   "/film",
      //   fileInformation,
      //   "application/json"
      // );
    }
  }
  

  deleteFilm(): void {
    
      // this.axiosService.request(
      //   "PUT",
      //   "/uploadFilm" + query,
      //   fileToUpload,
      //   "multipart/form-data"
      // );  

            // this.axiosService.request(
      //   "PUT",
      //   "/film",
      //   fileInformation,
      //   "application/json"
      // );
  }
}
