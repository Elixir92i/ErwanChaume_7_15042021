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
  imagePreview: string;


  constructor(
    private formBuilder: FormBuilder,
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
    }

    onModify() {
      this.router.navigate(['/profile-update']);
    }

}
