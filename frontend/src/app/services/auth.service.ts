import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken: string;
  private user_id: string;

  constructor(private http: HttpClient,
    private router: Router) { }

  // Service de création d'un utilisateur
  createUser(email: string, password: string, firstname: string, lastname: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/users/signup', { email: email, password: password, firstname: firstname, lastname: lastname }).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Récupération du token
  getToken() {
    return this.authToken;
  }

  // Récupération du user_id dans le localStorage
  getUserId() {
    return JSON.parse(localStorage.getItem("Users")).userId;
  }

  // Service de connexion d'un utilisateur
  loginUser(email: string, password) {
    return new Promise<void>((resolve, reject) => {
      this.http.post('http://localhost:3000/api/users/login', { email: email, password: password }).subscribe(
        (response: { user_id: string, token: string }) => {
          this.user_id = response.user_id;
          this.authToken = response.token;
          this.isAuth$.next(true);
          var Data = {
            "Token": response.token,
            "userId": response.user_id
          }
          localStorage.clear();
          localStorage.setItem("Users", JSON.stringify(Data));
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Service de récupération d'un utilisateur
  getUserById(user_id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/users/user-profile/' + user_id).subscribe(
        (user: User) => {
          resolve(user);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Service de mise à jour du profil
  updateUser(user_id: string, user: User, image: string | File) {
    return new Promise((resolve, reject) => {
      // Si il n'y a pas d'image
      if (typeof image === 'string') {
        this.http.put('http://localhost:3000/api/users/user-profile/' + user_id, user).subscribe(
          (response: { message: string }) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      }
      // Si il y a une image
      else {
        const formData = new FormData();
        formData.append('user', JSON.stringify(user));
        formData.append('image', image);
        this.http.put('http://localhost:3000/api/users/user-profile/' + user_id, formData).subscribe(
          (response: { message: string }) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }

  // Service de mise à jour du mot de passe
  updateUserPassword(user_id: string, user: User) {
    return new Promise((resolve, reject) => {
      this.http.put('http://localhost:3000/api/users/user-profile/' + user_id + '/password', user).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    })
  }

  // Service de suppression d'un utilisateur
  deleteUser(user_id: string) {
    return new Promise((resolve, reject) => {
      this.http.delete('http://localhost:3000/api/users/user-profile/' + user_id).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Service de déconnexion d'un utilisateur
  logout() {
    this.authToken = null;
    this.user_id = null;
    this.isAuth$.next(false);
    this.router.navigate(['login']);
  }

}
