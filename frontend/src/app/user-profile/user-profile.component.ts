import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  updateForm: FormGroup;
  mode: string;
  loading: boolean;
  errorMsg: string;
  user: User;
  user_id: string;


  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.route.params.subscribe(
      (params) => {
        console.log(this.auth.getUserId());
        this.auth.getUserById(this.auth.getUserId()).then(
          (user: User) => {
            console.log(user);
            this.user = user;
            this.loading = false;
          }
        );
      }
    );
    this.user_id = this.auth.getUserId();
  }

  onModify() {
    this.router.navigate(['/modify-profile', this.user_id]);
  }

  initModifyForm(user: User) {
    this.updateForm = this.formBuilder.group({
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      password: [this.user.password, Validators.required],
      email: [this.user.email, Validators.required],
    });
  }

  onUpdate() {
    this.loading = true;
    const updateUser = new User();
    updateUser.email = this.updateForm.get('email').value;
    updateUser.password = this.updateForm.get('password').value;
    updateUser.firstname = this.updateForm.get('firstname').value;
    updateUser.lastname = this.updateForm.get('lastname').value;
    updateUser.user_id = this.auth.getUserId();

    this.auth.updateUser(this.user.user_id, updateUser).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/user-profile']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        console.error(error);
        this.errorMsg = error.message;
      }
    );
  }
}