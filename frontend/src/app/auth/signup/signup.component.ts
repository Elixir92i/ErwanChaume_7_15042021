import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  passwordForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  loading: boolean;
  errorMsg: string;
  hide = true;
  hideConfirm = true;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      lastname: [null, Validators.required],
      firstname: [null, Validators.required] });
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Ce champs ne doit pas être vide';
    }

    return this.email.hasError('email') ? 'Veuillez entrer un mail valide' : '';
  }

  onSignup() {
    this.loading = true;
    const email = this.signupForm.get('email').value;
    const password = this.passwordForm.get('password').value;
    const firstname = this.signupForm.get('firstname').value;
    const lastname = this.signupForm.get('lastname').value;
    this.auth.createUser(email, password, firstname, lastname).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.auth.loginUser(email, password).then(
          () => {
            this.loading = false;
            this.router.navigate(['/timeline']);
          }
        ).catch(
          (error) => {
            this.loading = false;
            console.error(error);
            this.errorMsg = error.message;
          }
        );
      }
    ).catch((error) => {
        this.loading = false;
        console.error(error);
        this.errorMsg = error.message;
    });
  }

}
