import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AxiosService } from '../../axios.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-film-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './film-create.component.html',
  styleUrl: './film-create.component.css'
})
export class FilmCreateComponent {
  uploadFileForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private axiosService: AxiosService) {

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
    this.uploadFileForm.patchValue({ fileToUpload: file });


    const validTypes = [
      'video/mp4', 
      'video/x-matroska', // For .mkv
      'video/ogg',
      'video/webm',
      'video/quicktime'
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

  onSubmit(): void {

    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;

    if (form.checkValidity() !== false) {

      const uploadFileData = { ...this.uploadFileForm.value };
      const fileToUpload = this.uploadFileForm.controls["fileToUpload"].value;
      const filename = fileToUpload['name'];

      const query = "?filename=" + filename
        + "&type=" + fileToUpload['type']
        + "&size=" + fileToUpload['size']
        + "&lastModifiedDate=" + fileToUpload['lastModifiedDate']
        + "&creationDate=" + fileToUpload['lastModifiedDate']
        + "&name=" + uploadFileData.name
        + "&description=" + uploadFileData.description
        + "&director=" + uploadFileData.director
        + "&genre=" + uploadFileData.genre
        + "&actors=" + uploadFileData.actors
        + "&releaseDate=" + uploadFileData.releaseDate
        + "&userEmail=" + this.axiosService.getEmail();

      this.axiosService.request(
        "POST",
        "/film" + query,
        fileToUpload,
        "multipart/form-data"
      ).then(
        response => {
          this.router.navigate(['films']);
        }
      );
    }
    
    form.classList.add('was-validated');

  }

}
