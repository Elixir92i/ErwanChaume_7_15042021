import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model'
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts$ = new Subject<Post[]>();

  constructor(private http: HttpClient,
    private auth: AuthService,) { }

  // Service de récupération des posts
  getPosts() {
    this.http.get('http://localhost:3000/api/post/timeline').subscribe(
      (posts: Post[]) => {
        this.posts$.next(posts);
      },
      (error) => {
        this.posts$.next([]);
        console.error(error);
      }
    );
  }

  // Service de récupération des posts (messsages)
  getMessages() {
    this.http.get('http://localhost:3000/api/post/messages').subscribe(
      (posts: Post[]) => {
        this.posts$.next(posts);
      },
      (error) => {
        this.posts$.next([]);
        console.error(error);
      }
    );
  }

  // Service de récupération des posts (médias)
  getMedias() {
    this.http.get('http://localhost:3000/api/post/medias').subscribe(
      (posts: Post[]) => {
        this.posts$.next(posts);
      },
      (error) => {
        this.posts$.next([]);
        console.error(error);
      }
    );
  }

  // Service de récupération d'un post via l'ID
  getPostById(post_id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/post/timeline/' + post_id).subscribe(
        (post: Post) => {
          resolve(post);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Service d'ajout/suppression de like
  likePost(post_id: string) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/post/timeline/' + post_id + '/like',
        {
          user_id: this.auth.getUserId(),
        })
        .subscribe(
          (response: { message: string }) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // Service de création d'un post (média)
  createMedia(post: Post, image: File) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      formData.append('image', image);
      this.http.post('http://localhost:3000/api/post/timeline/media', formData).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Service de création d'un post (message)
  createMessage(post: Post) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/post/timeline/message', post).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Service de suppression d'un post
  deletePost(post_id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/post/timeline/' + post_id).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Service de création d'un commentaire
  createComment(comment: Comment, post_id: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/post/timeline/' + post_id + '/comment', comment).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Service de suppression d'un commentaire
  deleteComment(post_id: string, comment_id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/post/timeline/' + post_id + '/comment/' + comment_id).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}