import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  currentPage = 1;
  itemsPerPage = 5;
  pageSize: number;

  constructor(public posts: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  // Récupération des données du post et user + création du form commentaire
  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.posts.getPostById(params.post_id).then(
          (post: Post) => {
            this.post = post;
            this.loading = false;
          }
        );
      }
    );
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
    this.initEmptyFormComment();
  }

  // Pagination
  public onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }
  // Pagination

  // Snackbar
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
  // Snackbar

  // Ajout/suppression d'un like
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

  // Fonction de retour
  onBack() {
    this.router.navigate(['/timeline']);
  }

  // Fonction de suppression d'un post
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

  // Création du form commentaire
  initEmptyFormComment() {
    this.commentForm = this.formBuilder.group({
      commentContent: [null, Validators.required],
    });
  }

  // Fonction d'ajout d'un commentaire
  onComment() {
    this.loading = true;
    const newComment = new Comment();
    newComment.commentContent = this.commentForm.get('commentContent').value;
    newComment.user_id = this.auth.getUserId();

    this.posts.createComment(newComment, this.post.post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.setTimeout(function () { location.reload() }, 500)
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMessage = error.message;
      }
    );
  }

  // Fonction de suppression d'un commentaire
  onDeleteComment(comment_id) {
    this.loading = true;
    console.log(comment_id);
    this.posts.deleteComment(this.post.post_id, comment_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        window.setTimeout(function () { location.reload() }, 500)
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

// Snackbar
@Component({
  selector: 'delete-post-snackbar',
  templateUrl: 'delete-post-snackbar.html',
  styles: [`
    .delete-post {
      color: grey;
    }
  `],
})
export class DeletePostComponent { }


@Component({
  selector: 'comment-delete-snackbar',
  templateUrl: 'comment-delete-snackbar.html',
  styles: [`
    .delete-post {
      color: grey;
    }
  `],
})
export class DeleteCommentComponent { }

@Component({
  selector: 'comment-post-snackbar',
  templateUrl: 'comment-post-snackbar.html',
  styles: [`
    .delete-post {
      color: grey;
    }
  `],
})
export class PostCommentComponent { }
// Snackbar