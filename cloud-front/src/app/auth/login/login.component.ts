import { Component } from '@angular/core';
import { AxiosService } from '../../axios.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private axiosService: AxiosService, private formBuilder: FormBuilder, private router: Router) {

    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    });
    
  }
  
  onSubmit(): void {

    const form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;

    if (!(form.checkValidity() === false)) {
      
      const loginData = { ...this.loginForm.value };

      this.axiosService.request(
        "POST",
        "/login",
        {
          'email': loginData.email,
          'password': loginData.password,
        },
        "application/json"
      ).then(
        response => {
          this.axiosService.setAuthToken(response.data.body.AccessToken, response.data.role);
          this.router.navigate(['films']);
        }
      ).catch(
        error => {
          this.axiosService.setAuthToken(null, null);
          this.loginForm.setErrors({ notFound: true });
        }
      );

    }

    form.classList.add('was-validated');

  }

}
