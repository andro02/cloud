import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../../axios.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Buffer } from 'buffer'; 

@Component({
  selector: 'app-film-update',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './film-update.component.html',
  styleUrl: './film-update.component.css'
})
export class FilmUpdateComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  route: ActivatedRoute = inject(ActivatedRoute);
  filename = '';
  film: any;
  filmForm: FormGroup;
  
  constructor(public datePipe: DatePipe, private fb: FormBuilder, private axiosService: AxiosService, private router: Router){
    
    this.filename = String(this.route.snapshot.params['filename']);

    this.filmForm = this.fb.group({
      file: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      fileToUpload: new FormControl(null),
      description: [null, Validators.compose([Validators.required])],
      director: [null, Validators.compose([Validators.required])],
      genre: [null, Validators.compose([Validators.required])],
      actors: [null, Validators.compose([Validators.required])],
      releaseDate: [null, Validators.compose([Validators.required])],
    })
  }

  fileError: boolean = false;
  errorMessage: string = '';

  onFileChanged(event: Event) {
    if ((event.target as HTMLInputElement).files?.length == 0) {
      var fileLabel = document.getElementsByClassName('custom-file-label')[0] as HTMLFormElement;
      fileLabel.classList.remove("selected");
      fileLabel.innerHTML = 'Choose file';
      return;
    }

    const file = (event.target as HTMLInputElement).files![0];
    this.filmForm.patchValue({ fileToUpload: file });

    const validTypes = [
      'video/mp4', 
      'video/x-matroska', // For .mkv
      'video/ogg',
      'video/webm',
      'video/quicktime',
      'binary/octet-stream'
    ]

    if(!validTypes.includes(file.type)){
      var fileLabel = document.getElementsByClassName('custom-file-label')[0] as HTMLFormElement;
      fileLabel.classList.remove("selected");
      fileLabel.innerHTML = 'Choose file';
      this.fileError = true;
      this.errorMessage = 'Invalid file type! Please select a valid video file (.mp4, .mkv, .mov, .webm, .ogg)';
      return;
    }

    var fileLabel = document.getElementsByClassName('custom-file-label')[0] as HTMLFormElement;
    fileLabel.classList.add("selected");
    fileLabel.innerHTML = file['name'];
    this.fileError = false;
    this.errorMessage = '';

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

        const query = "?filename=" + this.filename;
        this.axiosService.request(
          "GET",
          "/downloadFilm" + query,
          null,
          "application/json"
        ).then(
          response => {
            const contentType = response["headers"]["content-type"];
            const file = Buffer.from(response.data, "base64");
            const blob = new Blob([file], { type: contentType });
            const fileUpload = new File([blob], this.filename, { type: contentType });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(fileUpload);
            this.fileInput.nativeElement.files = dataTransfer.files;

            const event = new Event('change', { bubbles: true });
            this.fileInput.nativeElement.dispatchEvent(event);
          }
        );
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
      console.log("Fim dddddddddddd")
      console.log(fileInformation)
      console.log(fileToUpload)

      this.axiosService.request(
        "PUT",
        "/updateFile" + query,
        fileToUpload,
        "multipart/form-data"
      ).then(
        response => {
          this.axiosService.request(
          "PUT",
          "/updateFilm",
          fileInformation,
          "application/json"
          ).then(
            response => {
              this.router.navigate(['films']);
            }
          );
        }
      );
    }
    
    form.classList.add('was-validated');
  }
  

  deleteFilm(): void {
    
      this.axiosService.request(
        "DELETE",
        "/deleteFile?filename=" + this.filename,
        null,
        "application/json"
      ).then(
        response => {
          this.axiosService.request(
          "DELETE",
          "/film/filename?filename=" + this.filename,
          null,
          "application/json"
          ).then(
            response => {
              this.router.navigate(['films']);
            }
          );
        }
      );
      
  }
}
