import { Component, OnInit, Inject, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Subscription, Observable } from 'rxjs';
import { PostService } from '../services/post.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PostMediaDialog } from '../timeline/timeline.component';
import { PostMessageDialog } from '../timeline/timeline.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  postSub: Subscription;
  postForm: FormGroup;
  loading: boolean;
  posts: Post[];
  errorMsg: string;
  imagePreview: string;
  user_id: string;
  user: User;
  currentPage = 1;
  itemsPerPage = 5;
  pageSize: number;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public post: PostService,
    private auth: AuthService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.route.params.subscribe(
      (params) => {
        this.auth.getUserById(this.auth.getUserId()).then(
          (user: User) => {
            this.user = user;
            this.loading = false;
          }
        );
      }
    );
    this.loading = true;
    this.postSub = this.post.posts$.subscribe(
      (posts) => {
        this.posts = posts;
        this.loading = false;
        this.errorMsg = null;
      },
      (error) => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
      }
    );
    this.post.getMessages();
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

  onClickFilterAll() {
    this.router.navigate(['./timeline/']);
  }

  onClickFilterMedias() {
    this.router.navigate(['./medias/']);
  }

  onClickPublish(){
    this.router.navigate(['./timeline/']);
  }

  onLike(post_id: string) {
    this.loading = true;
    this.post.likePost(post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMsg = error.message;
        console.error(error);
      }
    );
  }
}
