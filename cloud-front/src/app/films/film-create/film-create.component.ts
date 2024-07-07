import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Buffer } from 'buffer';
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
      fileToUpload: new FormControl(null)
    });

  }


  onFileChanged(event: Event) {

    if ((event.target as HTMLInputElement).files === null)
      return;
    const file = (event.target as HTMLInputElement).files![0];
    this.uploadFileForm.patchValue({ fileToUpload: file });

  }

  onSubmit(): void {

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
      'creationDate': fileToUpload['lastModifiedDate']
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

}
