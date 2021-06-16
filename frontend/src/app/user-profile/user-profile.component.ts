import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  currentPage = 1;
  itemsPerPage = 5;
  pageSize: number;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.route.params.subscribe(
      (params) => {
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

  public onPageChange(pageNum: number): void {

    this.pageSize = this.itemsPerPage * (pageNum - 1);

  }

  public changePagesize(num: number): void {

    this.itemsPerPage = this.pageSize + num;

  }

  onClickPost(post_id: string) {
    this.router.navigate(['timeline/', post_id]);
  }

  onClickEmpty() {
    this.router.navigate(['timeline/']);
  }

  onModify() {
    this.router.navigate(['/profile-update']);
  }

}
