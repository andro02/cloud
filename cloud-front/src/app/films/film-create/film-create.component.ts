import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../../axios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-film-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './film-create.component.html',
  styleUrl: './film-create.component.css'
})
export class FilmCreateComponent {
  uploadFileForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private axiosService: AxiosService) {

    this.uploadFileForm = this.formBuilder.group({
      file: [null, Validators.compose([Validators.required])],
      fileToUpload: new FormControl(null),
      name: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
      director: [null, Validators.compose([Validators.required])],
      genre: [null, Validators.compose([Validators.required])],
      actors: [null, Validators.compose([Validators.required])],
      releaseDate: [null, Validators.compose([Validators.required])],
    });

  }


  onFileChanged(event: Event) {

    if ((event.target as HTMLInputElement).files?.length == 0) {
      var fileLabel = document.getElementsByClassName('custom-file-label')[0] as HTMLFormElement;
      fileLabel.classList.remove("selected");
      fileLabel.innerHTML = 'Choose file';
      return;
    }

    const file = (event.target as HTMLInputElement).files![0];
    this.uploadFileForm.patchValue({ fileToUpload: file });

    var fileLabel = document.getElementsByClassName('custom-file-label')[0] as HTMLFormElement;
    fileLabel.classList.add("selected");
    fileLabel.innerHTML = file['name'];

  }

  onSubmit(): void {

    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;

    if (form.checkValidity() !== false) {

      const uploadFileData = { ...this.uploadFileForm.value };
      const fileToUpload = this.uploadFileForm.controls["fileToUpload"].value;
      const filename = fileToUpload['name'];

      const query = "?filename=" + filename;

      this.axiosService.request(
        "POST",
        "https://f0ujn573qg.execute-api.eu-central-1.amazonaws.com/uploadFilm" + query,
        fileToUpload,
        {
          "Content-Type": "multipart/form-data"
        }
      );

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
        'releaseDate': uploadFileData.releaseDate
      }

      this.axiosService.request(
        "POST",
        "https://f0ujn573qg.execute-api.eu-central-1.amazonaws.com/film",
        fileInformation,
        {
          "Content-Type": "application/json"
        }
      );

    }
    
    form.classList.add('was-validated');

  }

}
