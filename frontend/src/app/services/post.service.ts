import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts$ = new Subject<Post[]>();

  constructor(private http: HttpClient,
    private auth: AuthService,) { }

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

  /*getMessages() {
    this.http.get('http://localhost:3000/api/postMessage/timeline').subscribe(
      (messages: PostMessage[]) => {
        this.messages$.next(messages);
      },
      (error) => {
        this.messages$.next([]);
        console.error(error);
      }
    );
  }*/

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

  /*getMessageById(message_id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/postMessage/timeline' + message_id).subscribe(
        (message: PostMessage) => {
          resolve(message);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }*/

  likePost(post_id: string, like: boolean) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/post/timeline/' + post_id + '/like',
        {
          user_id: this.auth.getUserId(),
          like: like ? 1 : 0
        })
        .subscribe(
          (response: { message: string }) => {
            resolve(like);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  /*likeMessage(message_id: string, like: boolean) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/postMessage/timeline/' + message_id + '/like',
        {
          user_id: this.auth.getUserId(),
          like: like ? 1 : 0
        })
        .subscribe(
          (response: { message: string }) => {
            resolve(like);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }*/

  dislikePost(post_id: string, dislike: boolean) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/post/timeline' + post_id + '/like',
        {
          user_id: this.auth.getUserId(),
          like: dislike ? -1 : 0
        })
        .subscribe(
          (response: { message: string }) => {
            resolve(dislike);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  /*dislikeMessage(message_id: string, dislike: boolean) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/postMessage/timeline' + message_id + '/like',
        {
          user_id: this.auth.getUserId(),
          like: dislike ? -1 : 0
        })
        .subscribe(
          (response: { message: string }) => {
            resolve(dislike);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }*/

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


  /*deleteMessage(message_id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/postMessage/timeline/' + message_id).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }*/
}

