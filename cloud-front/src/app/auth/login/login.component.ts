import { Component } from '@angular/core';
import { AxiosService } from '../../axios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private axiosService: AxiosService) { }
  
  onSubmit(): void {

    this.axiosService.request(
      "POST",
      "https://f0ujn573qg.execute-api.eu-central-1.amazonaws.com/login",
      {'email':'nov@gmail.com', 'password':'sifra123'},
      {}
    ).then(
      response => {
        console.log(response)
        this.axiosService.setAuthToken(response.data.AccessToken);
      }
    ).catch(
      error => {
        this.axiosService.setAuthToken(null);
      }
    );

  }

}
