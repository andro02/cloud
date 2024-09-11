import { DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../../axios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-film-update',
  standalone: true,
  imports: [ReactiveFormsModule],
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

    this.filename = this.route.snapshot.params['id'];


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
        // console.log(response.data.data);
        
        this.filmForm.patchValue({
          file: response.data.fileName,
          name: response.data.fileName,
          fileToUpload: response.data.fileToUpload,
          description: response.data.description,
          director: response.data.director,
          genre: response.data.fileName,
          actors: response.data.actors,
          releaseDate: response.data.releaseDate,
        });
        // response.data.data.forEach((f: any) => {
        //   if(f.filename.toLowerCase() == this.filename.toLowerCase()){
        //     this.film = f;
        //     console.log(this.film);

        //     this.filmForm.patchValue({
        //       file: this.film.file,
        //       name: this.film?.name,
        //       fileToUpload: this.film.file,
        //       description: this.film.description,
        //       director: this.film.director,
        //       genre: this.film.genre,
        //       actors: this.film.actors,
        //       releaseDate: this.film.releaseDate,
        //     });



        //   }


        // });
        
      }
    );


    // console.log(this.film.filename);


    // Initialize form with existing film data if needed
    
  }


  

}
