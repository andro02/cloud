import { Component } from '@angular/core';
import { AxiosService } from '../../axios.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  registerForm: FormGroup;

  constructor(private axiosService: AxiosService, private formBuilder: FormBuilder, private router: Router) {

    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      birthday: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    });
    
  }
  
  onSubmit(): void {

    const form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    this.registerForm.addValidators(this.validatePassword);
    this.registerForm.setErrors(this.validatePassword(this.registerForm));

    if (!(form.checkValidity() === false) && this.registerForm.errors == null) {
      
      const registerData = { ...this.registerForm.value };

      this.axiosService.request(
        "POST",
        "/register",
        {
          'name': registerData.name,
          'surname': registerData.surname,
          'username': registerData.username,
          'email': registerData.email,
          'birthday': registerData.birthday,
          'password': registerData.password,
        },
        "application/json"
      ).then(
        response => {
          this.axiosService.setAuthToken(response.data.AccessToken, response.data.role);
          this.router.navigate(['films']);
        }
      ).catch(
        error => {
          this.axiosService.setAuthToken(null, null);
          this.registerForm.setErrors({ alreadyExists: true });
        }
      );

    }

    form.classList.add('was-validated');

  }

  validatePassword(control: AbstractControl) {
    if (control.get('password')?.value !== control.get('confirmPassword')?.value) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
      var confirmPassword = document.getElementsByName('confirmPassword')[0] as HTMLFormElement;
      if (confirmPassword !== undefined) {
        confirmPassword.classList.add('is-invalid');
        confirmPassword.classList.remove('is-valid');
      }
    } else {
      control.get('confirmPassword')?.setErrors(null);
      var confirmPassword = document.getElementsByName('confirmPassword')[0] as HTMLFormElement;
      if (confirmPassword !== undefined) {
        confirmPassword.classList.remove('is-invalid');
        confirmPassword.classList.add('is-valid');
      }
    }
    return control.get('password')?.value === control.get('confirmPassword')?.value ? null : { mismatch: true };
  }

}
