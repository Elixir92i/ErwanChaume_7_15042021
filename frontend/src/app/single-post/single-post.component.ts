import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

  loading: boolean;
  post: Post;
  user_id: string;
  likePending: boolean;
  liked: boolean;
  disliked: boolean;
  errorMessage: string;
  user: User;
  commentForm: FormGroup;
  durationInSeconds = 3;

  constructor(public posts: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.posts.getPostById(params.post_id).then(
          (post: Post) => {
            console.log(post)
            this.post = post;
            this.loading = false;
          }
        );
      }
    );
    this.user_id = this.auth.getUserId();
    this.route.params.subscribe(
      (params) => {
        console.log(this.auth.getUserId());
        this.auth.getUserById(this.auth.getUserId()).then(
          (user: User) => {
            this.user = user;
            this.loading = false;
          }
        );
      }
    );
    this.initEmptyFormComment();
  }

  openDeletePostSnackBar() {
    this._snackBar.openFromComponent(DeletePostComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  openDeleteCommentSnackBar() {
    this._snackBar.openFromComponent(DeleteCommentComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  openPostCommentSnackBar() {
    this._snackBar.openFromComponent(PostCommentComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }


  onLike() {
    this.loading = true;
    this.posts.likePost(this.post.post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.location.reload();
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }

  onBack() {
    this.router.navigate(['/timeline']);
  }

  onDelete() {
    this.loading = true;
    this.posts.deletePost(this.post.post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/timeline']);
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }

  initEmptyFormComment() {
    this.commentForm = this.formBuilder.group({
      commentContent: [null, Validators.required],
    });
  }

  onComment() {
    this.loading = true;
    const newComment = new Comment();
    newComment.commentContent = this.commentForm.get('commentContent').value;
    newComment.user_id = this.auth.getUserId();

    this.posts.createComment(newComment, this.post.post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.setTimeout(function(){location.reload()},500)
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMessage = error.message;
      }
    );
  }
  onDeleteComment(comment_id) {
    this.loading = true;
    console.log(comment_id);
    this.posts.deleteComment(this.post.post_id, comment_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.setTimeout(function(){location.reload()},500)
      }
    ).catch(
      (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
      }
    );
  }
}

@Component({
  selector: 'delete-post-snackbar',
  templateUrl: 'delete-post-snackbar.html',
  styles: [`
    .delete-post {
      color: grey;
    }
  `],
})
export class DeletePostComponent {}


@Component({
  selector: 'comment-delete-snackbar',
  templateUrl: 'comment-delete-snackbar.html',
  styles: [`
    .delete-post {
      color: grey;
    }
  `],
})
export class DeleteCommentComponent {}

@Component({
  selector: 'comment-post-snackbar',
  templateUrl: 'comment-post-snackbar.html',
  styles: [`
    .delete-post {
      color: grey;
    }
  `],
})
export class PostCommentComponent {}