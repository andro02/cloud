import { Component } from '@angular/core';
import { AxiosService } from '../../axios.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private axiosService: AxiosService) { }
  
  onSubmit(): void {

    this.axiosService.request(
      "POST",
      "https://f0ujn573qg.execute-api.eu-central-1.amazonaws.com/register",
      {'email':'nov@gmail.com', 'password':'sifra123'},
      {}
    ).then(
      response => {
        console.log(response)
      }
    );

  }

}
