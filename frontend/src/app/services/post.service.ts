import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PostMedia } from '../models/post-media.model';
import { PostMessage } from '../models/post-message.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  medias$ = new Subject<PostMedia[]>();
  messages$ = new Subject<PostMessage[]>();

  constructor(private http: HttpClient,
    private auth: AuthService,) { }

  getMedias() {
    this.http.get('http://localhost:3000/api/postMedia/timeline').subscribe(
      (medias: PostMedia[]) => {
        this.medias$.next(medias);
      },
      (error) => {
        this.medias$.next([]);
        console.error(error);
      }
    );
  }

  getMessages() {
    this.http.get('http://localhost:3000/api/postMessage/timeline').subscribe(
      (messages: PostMessage[]) => {
        this.messages$.next(messages);
      },
      (error) => {
        this.messages$.next([]);
        console.error(error);
      }
    );
  }

  getMediaById(media_id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/postMedia/timeline' + media_id).subscribe(
        (media: PostMedia) => {
          resolve(media);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getMessageById(message_id: string) {
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
  }

  likeMedia(media_id: string, like: boolean) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/postMedia/timeline/' + media_id + '/like',
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

  likeMessage(message_id: string, like: boolean) {
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
  }

  dislikeMedia(media_id: string, dislike: boolean) {
    return new Promise((resolve, reject) => {
      this.http.post(
        'http://localhost:3000/api/postMedia/timeline' + media_id + '/like',
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

  dislikeMessage(message_id: string, dislike: boolean) {
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
  }

  createMedia(media: PostMedia, image: File) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('media', JSON.stringify(media));
      formData.append('image', image);
      this.http.post('http://localhost:3000/api/postMedia/timeline', formData).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  createMessage(message: PostMessage) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/postMessage/timeline', message).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  deleteMedia(media_id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/postMedia/timeline/' + media_id).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  deleteMessage(message_id: string) {
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
  }
}

