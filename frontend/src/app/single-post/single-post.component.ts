import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

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

  constructor(private posts: PostService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.user_id = this.auth.getUserId();
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        this.posts.getPostById(params.post_id).then(
          (post: Post) => {
            this.post = post;
            this.loading = false;
            /*if (post.users_liked.find(user => user === this.user_id)) {
              this.liked = true;
            } else if (post.users_disliked.find(user => user === this.user_id)) {
              this.disliked = true;
            }*/
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
              console.log(user);
              this.user = user;
              this.loading = false;
            }
          );
        }
      );
  }

  /*onLike() {
    if (this.disliked) {
      return 0;
    }
    this.likePending = true;
    this.posts.likePost(this.post.post_id, !this.liked).then(
      (liked: boolean) => {
        this.likePending = false;
        this.liked = liked;
        if (liked) {
          this.post.likes++;
        } else {
          this.post.likes--;
        }
      }
    );
  }*/

  /*onDislike() {
    if (this.liked) {
      return 0;
    }
    this.likePending = true;
    this.posts.dislikePost(this.post.post_id, !this.disliked).then(
      (disliked: boolean) => {
        this.likePending = false;
        this.disliked = disliked;
        if (disliked) {
          this.post.dislikes++;
        } else {
          this.post.dislikes--;
        }
      }
    );
  }*/

  onBack() {
    this.router.navigate(['/timeline']);
  }

  onDelete() {
    this.loading = true;
    this.posts.deletePost(this.post.post_id).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        //this.router.navigate(['/timeline']);
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
