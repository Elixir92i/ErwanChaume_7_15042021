import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean;
  errorMsg: string;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Ce champs ne doit pas être vide';
    }

    return this.email.hasError('email') ? 'Veuillez entrer un mail valide' : '';
  }

  onLogin() {
    this.loading = true;
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.auth.loginUser(email, password).then(
      () => {
        this.loading = false;
        this.router.navigate(['/timeline']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }

}
