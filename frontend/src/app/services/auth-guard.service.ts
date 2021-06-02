import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {}
  
  isLoggedin: boolean = false;

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> {
    return Observable.create(
      (observer) => {
        this.auth.isAuth$.subscribe(
          (auth) => {
            if (localStorage.getItem("Users")) {
              observer.next(true);
              this.isLoggedin = true;
              return this.isLoggedin;
            } else {
              this.router.navigate(['/login']);
              this.isLoggedin = false;
              return this.isLoggedin;
            }
          }
        );
      }
    );
  }
}