import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
    /*this.user_id = this.auth.getUserId();
    this.route.params.subscribe(
      (params) => {
        this.auth.getUserById(params.id).then(
          (user: User) => {
            this.user = user;
            this.loading = false;
          }
        );
      }
    );*/
    this.user_id = this.auth.getUserId();
  }

  myProfile() {
    this.router.navigate(['user-profile']);
    console.log(this.user_id)
  }
}
